import { TestBed, inject } from '@angular/core/testing';
import {HttpModule, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {
  ActivatedRoute, ActivatedRouteSnapshot, DefaultUrlSerializer, Router,
  RouterStateSnapshot
} from '@angular/router';
import {FTP_AUTH_CONFIG} from './auth.config.provider';
import {CookieModule, CookieService} from 'ngx-cookie';
import {FtpAuthConfig} from './auth.config';
import {FtpAuthService} from './auth.service';
import {RouterTestingModule} from '@angular/router/testing';
import {FtpAuthGuardService} from './auth-guard.service';

const AUTH_CONFIG: FtpAuthConfig = {
  ApiBaseUrl: 'http://www.example.com',
  OpenIdClientId: 'my-client-id',
  OpenIdScope: 'my-scope',
  OpenIdAuthorizeEndpoint: 'http://www.example.com/authorize'
};

describe('AuthGuardService', () => {

  let routerFixture: Router;
  let authServiceFixture: FtpAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: XHRBackend, useClass: MockBackend },
        {provide: FTP_AUTH_CONFIG, useValue: AUTH_CONFIG},
        FtpAuthService
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpModule,
        CookieModule.forRoot()
      ]
    });
  });

  function getService(): FtpAuthGuardService {
    return new FtpAuthGuardService(
      authServiceFixture,
      routerFixture
    );
  }

  beforeEach(inject([Router, FtpAuthService], (router: Router, authService: FtpAuthService) => {
    authServiceFixture = authService;
    routerFixture = router;
  }));

  it('redirect to login page if not connected', (done) => {
    const route = new ActivatedRouteSnapshot(),
          state = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']),
          redirectUrlSpy = spyOnProperty(authServiceFixture, 'redirectUrl', 'set');

    spyOn(routerFixture, 'navigate');

    getService().canActivate(route, state)
      .subscribe((result) => {
        expect(routerFixture.navigate).toHaveBeenCalledWith(['/login']);
        expect(redirectUrlSpy).toHaveBeenCalled();
        done();
      });
  });
});
