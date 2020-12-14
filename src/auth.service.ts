import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FtpAuthConfig, FtpRequestOptions} from './auth.config';
import {FTP_AUTH_CONFIG} from './auth.config.provider';
import {CookieService} from 'ngx-cookie';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/publishLast';
import 'rxjs/add/operator/publish';
import * as moment from 'moment';
import {Identity, JsonIdentity} from './identity';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscriber} from 'rxjs/Subscriber';

export interface JsonOAuthToken {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  expires?: number;
}

export class OAuthToken {
  accessToken: string;
  refreshToken: string;
  expires: Date;

  constructor(jsonToken?: JsonOAuthToken) {
    if (!!jsonToken) {
      this.accessToken = jsonToken.access_token;
      this.refreshToken = jsonToken.refresh_token;
      if (!!jsonToken.expires_in) {
        this.expires = new Date(new Date().getTime() + jsonToken.expires_in * 1000);
      }
      if (!!jsonToken.expires) {
        this.expires = new Date(jsonToken.expires);
      }
    }
  }

  extract(): JsonOAuthToken {
    const token = {
      access_token: this.accessToken,
      refresh_token: this.refreshToken
    };

    if (!!this.expires) {
      token['expires'] = this.expires.getTime();
    }

    return token;
  }

  isValid(): boolean {
    return (!!this.expires && new Date(new Date().getTime() + 300000) < this.expires);
  }
}

@Injectable()
export class FtpAuthService {

  private config: FtpAuthConfig;

  private refreshToken$: Observable<OAuthToken>[] = [];

  protected _token?: OAuthToken;

  protected _isAuthenticated: Subject<boolean>;

  get token(): OAuthToken {
    let tokenData;
    if (!!this.cookieService.get('token')) {
      tokenData = JSON.parse(this.cookieService.get('token'));
    }

    if (!!tokenData) {
      this._token = new OAuthToken(tokenData);
    }

    if (!this._token) {
      return new OAuthToken();
    }

    return this._token;
  }

  set token(token: OAuthToken) {
    this.cookieService.put('token', JSON.stringify(token.extract()), {
      expires: moment().add(15, 'd').toDate()
    });

    this._token = token;
  }

  get redirectUrl(): string {
    const url = this.cookieService.get('auth-redirect-url');

    if (!url) {
      return '/';
    }

    return this.cookieService.get('auth-redirect-url');
  }

  set redirectUrl(url: string) {
    this.cookieService.put('auth-redirect-url', url, {
      expires: moment().add(15, 'd').toDate()
    });
  }

  constructor(
    @Inject(FTP_AUTH_CONFIG) config: FtpAuthConfig,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.config = config;
  }

  public get callbackUrl(): string {
    return window.location.protocol + '//' + window.location.host + '/login/callback';
  }

  isAuthenticated(): Observable<boolean> {
    this.checkAuthentication();

    return this._isAuthenticated;
  }

  authenticate(authorizationCode: string): Observable<boolean> {
    let url = this.config.ApiBaseUrl + '/oauth/token';

    const params = new URLSearchParams();
    params.set('redirect_uri', this.callbackUrl);
    params.set('grant_type', 'authorization_code');
    params.set('client_id', this.config.OpenIdClientId);
    params.set('code', authorizationCode);
    if (!!this.config.OpenIdClientSecret) {
      params.set('client_secret', this.config.OpenIdClientSecret);
    }

    url += '?' + params.toString();

    return this.http.post(url, {})
      .do((jsonToken: JsonOAuthToken) => {
        this.token = new OAuthToken(jsonToken);
        this.checkAuthentication();
      }).map(result => !!result);
  }

  private checkAuthentication() {
    if (!this._isAuthenticated) {
      this._isAuthenticated = new BehaviorSubject<boolean>(false);
    }

    if (!this.token) {
      this._isAuthenticated.next(false);
    } else if (this.token.isValid()) {
      this._isAuthenticated.next(true);
    } else {
      this.refreshToken()
        .map(token => !!token && token.isValid(), () => false)
        .subscribe(
          (result) => this._isAuthenticated.next(result),
          (error) => this._isAuthenticated.next(false)
        );
    }
  }

  refreshToken(): Observable<OAuthToken> {
    if (!this.token.refreshToken) {
      return Observable.of(new OAuthToken());
    }

    if (!this.refreshToken$[this.token.refreshToken]) {
      this.refreshToken$[this.token.refreshToken] = this.http.post(this.config.ApiBaseUrl + '/oauth', {
        'client_id': this.config.OpenIdClientId,
        'client_secret': this.config.OpenIdClientSecret,
        'refresh_token': this.token.refreshToken,
        'grant_type': 'refresh_token'
      })
        .map((jsonToken: JsonOAuthToken) => new OAuthToken(jsonToken))
        .do(token => this.token = token)
        .publishLast()
        .refCount();
    }
    return this.refreshToken$[this.token.refreshToken];
  }

  getRequestOptionsArgs(requestOptions?: FtpRequestOptions): Observable<FtpRequestOptions> {
    return this.getHeaders(requestOptions)
      .map((headers: HttpHeaders) => {
        return Object.assign({}, requestOptions, {
          headers: headers
        });
      });
  }

  getHeaders(requestOptions?: FtpRequestOptions): Observable<HttpHeaders> {
    let headers = <HttpHeaders>((requestOptions && requestOptions['headers']) ?
      requestOptions['headers'] : new HttpHeaders());

    if (!!this.token && this.token.isValid()) {
      headers = headers.append('Authorization', 'Bearer ' + this.token.accessToken);
    } else if (!!this.token) {
      return this.refreshToken()
        .map(token => {
          headers = headers.append('Authorization', 'Bearer ' + token.accessToken);
          return headers;
        }, () => {
          return headers;
        });
    }

    return Observable.of(headers);
  }

  getIdentity(): Observable<Identity>|Observable<null> {
    const url = this.config.ApiBaseUrl + '/oauth/userinfo';

    if (!!this.token) {
      return this.getRequestOptionsArgs()
        .switchMap(requestOptionsArgs => this.http.get(url, requestOptionsArgs))
        .map((jsonIdentity: JsonIdentity) => new Identity(jsonIdentity));
    } else {
      return Observable.of(null);
    }
  }

  clearIdentity(): Observable<any> {
    return Observable.create((observer: Subscriber<any>) => {
      this.cookieService.remove('token');
      this._token = undefined;
      this.cookieService.remove('auth-redirect-url');

      if (!!this._isAuthenticated) {
        this._isAuthenticated.next(false);
      }

      observer.next();
    });
  }
}
