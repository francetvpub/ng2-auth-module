import {TestBed, inject, async} from '@angular/core/testing';
import {FtpAuthService, OAuthToken} from './auth.service';
import { FtpAuthConfig } from './auth.config';
import {FTP_AUTH_CONFIG} from './auth.config.provider';
import {Http, HttpModule, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {CookieModule, CookieOptions, CookieService} from 'ngx-cookie';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

const AUTH_CONFIG: FtpAuthConfig = {
  ApiBaseUrl: 'http://www.example.com',
  OpenIdClientId: 'my-client-id',
  OpenIdScope: 'my-scope',
  OpenIdAuthorizeEndpoint: 'http://www.example.com/authorize'
};

export class CookieMockService extends CookieService {
  _values = {};

  get(key: string): string {
    return this._values[key];
  }

  put(key: string, value: string, options?: CookieOptions): void {
    this._values[key] = value;
  }

  remove(key: string, options?: CookieOptions): void {
    delete this._values[key];
  }
}

describe('AuthService', () => {

  let httpFixture: Http;
  let routerFixture: Router;
  let cookieServiceFixture: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: XHRBackend, useClass: MockBackend },
        {provide: FTP_AUTH_CONFIG, useValue: AUTH_CONFIG},
        {provide: CookieService, useClass: CookieMockService},
        FtpAuthService
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpModule,
        CookieModule.forRoot()
      ]
    });
  });

  function getService(): FtpAuthService {
    return new FtpAuthService(
      AUTH_CONFIG,
      httpFixture,
      routerFixture,
      cookieServiceFixture
    );
  }

  beforeEach(inject([Http, Router, CookieService], (http: Http, router: Router, cookieService: CookieService) => {
    httpFixture = http;
    routerFixture = router;
    cookieServiceFixture = cookieService;
  }));

  it('should be disconnected if no token is stored',
    (done) => {
      getService().isAuthenticated().subscribe((result) => {
        expect(result).toBeFalsy();
        done();
      });
  });

  it('should be connected if a valid is stored',
    (done) => {
      const service = getService(),
            token = new OAuthToken(),
            tokenSpy = spyOn(token, 'isValid').and.returnValue(true),
            tokenGetterSpy = spyOnProperty(service, 'token', 'get').and.returnValue(token);
      service.token = token;

      service.isAuthenticated().subscribe((result) => {
        expect(result).toBeTruthy();
        expect(tokenSpy.calls.count()).toBe(1);
        expect(tokenGetterSpy.calls.count()).toBeGreaterThanOrEqual(1);
        done();
      });
  });

  it('should be disconnected if an invalid is stored',
    (done) => {
      const service = getService(),
            token = new OAuthToken(),
            spy = spyOn(token, 'isValid').and.returnValue(false),
            tokenGetterSpy = spyOnProperty(service, 'token', 'get').and.returnValue(token),
            refreshTokenSpy = spyOn(service, 'refreshToken').and.returnValue(Observable.of(new OAuthToken()));
      service.token = token;

      service.isAuthenticated().subscribe((result) => {
        expect(result).toBeFalsy();
        expect(spy.calls.count()).toBe(1);
        expect(tokenGetterSpy.calls.count()).toBeGreaterThanOrEqual(1);
        expect(refreshTokenSpy.calls.count()).toBe(1);
        done();
      });
  });
});
