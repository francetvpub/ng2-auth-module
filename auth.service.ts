import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {Http, RequestOptionsArgs, Headers} from '@angular/http';
import {FtpAuthConfig} from './auth.config';
import {FTP_AUTH_CONFIG} from './auth.config.provider';
import {CookieService} from 'ngx-cookie';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishLast';
import 'rxjs/add/operator/publish';
import * as moment from 'moment';
import {Subscriber} from 'rxjs/Subscriber';
import {Identity} from './identity';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

interface JsonOAuthToken {
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
    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
      expires: this.expires ? this.expires.getTime() : null
    };
  }

  isValid(): boolean {
    return new Date(new Date().getTime() + 300000) < this.expires;
  }
}

@Injectable()
export class FtpAuthService {

  private config: FtpAuthConfig;

  private refreshToken$: Observable<OAuthToken>[] = [];

  protected _token: OAuthToken;

  protected _isAuthenticated: Subject<boolean>;

  get token(): OAuthToken {
    let tokenData;
    if (!!this.cookieService.get('token')) {
      tokenData = JSON.parse(this.cookieService.get('token'));
    }

    if (!!tokenData) {
      this._token = new OAuthToken(tokenData);
    }

    return this._token;
  }

  set token(token: OAuthToken) {
    if (!!token) {
      this.cookieService.put('token', JSON.stringify(token.extract()), {
        expires: moment().add(15, 'd').toDate()
      });
    } else {
      this.cookieService.remove('token');
    }
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
    private http: Http,
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
    let url = this.config.ApiBaseUrl + '/oauth';

    const params = new URLSearchParams();
    params.set('redirect_uri', this.callbackUrl);
    params.set('response_type', 'code');
    params.set('client_id', this.config.OpenIdClientId);
    params.set('code', authorizationCode);
    if (!!this.config.OpenIdClientSecret) {
      params.set('client_secret', this.config.OpenIdClientSecret);
    }

    url += '?' + params.toString();

    return this.http.post(url, {}).map(response => response.json())
      .do((jsonResponse) => {
        this.token = new OAuthToken(jsonResponse);
        this.checkAuthentication();
      });
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
        .subscribe((result) => this._isAuthenticated.next(result));
    }
  }

  refreshToken(): Observable<OAuthToken> {
    if (!this.refreshToken$[this.token.refreshToken]) {
      this.refreshToken$[this.token.refreshToken] = this.http.post(this.config.ApiBaseUrl + '/oauth', {
        'client_id': this.config.OpenIdClientId,
        'client_secret': this.config.OpenIdClientSecret,
        'refresh_token': this.token.refreshToken,
        'grant_type': 'refresh_token'
      })
        .map(response => response.json())
        .map(jsonResponse => new OAuthToken(jsonResponse))
        .do(token => this.token = token)
        .publishLast()
        .refCount();
    }
    return this.refreshToken$[this.token.refreshToken];
  }

  getRequestOptionsArgs(additionalHeaders?: Headers): Observable<RequestOptionsArgs> {
    return this.getHeaders(additionalHeaders)
      .map((headers: Headers) => {
        return {
          headers: headers
        };
      });
  }

  getHeaders(additionalHeaders?: Headers): Observable<Headers> {
    const headers = !!additionalHeaders ? additionalHeaders : new Headers();

    if (!!this.token && this.token.isValid()) {
      headers.set('Authorization', 'Bearer ' + this.token.accessToken);
    } else if (!!this.token) {
      return this.refreshToken()
        .map(token => {
          headers.set('Authorization', 'Bearer ' + token.accessToken);
          return headers;
        }, error => {
          return headers;
        });
    }

    return Observable.of(headers);
  }

  getIdentity(): Observable<Identity> {
    const url = this.config.ApiBaseUrl + '/oauth/userinfo';

    if (!!this.token) {
      return this.getRequestOptionsArgs()
        .switchMap(requestOptionsArgs => this.http.get(url, requestOptionsArgs))
        .map(response => response.json())
        .map(jsonIdentity => new Identity(jsonIdentity));
    } else {
      return Observable.of(null);
    }
  }

  clearIdentity(): Observable<any> {
    return Observable.create((observer) => {
      this.token = null;
      this.cookieService.remove('auth-redirect-url');

      if (!!this._isAuthenticated) {
        this._isAuthenticated.next(false);
      }

      observer.next();
    });
  }
}
