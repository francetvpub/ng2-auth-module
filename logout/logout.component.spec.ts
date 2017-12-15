import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FtpLogoutComponent } from './logout.component';
import {FtpAuthConfig} from '../auth.config';
import {FTP_AUTH_CONFIG} from '../auth.config.provider';
import {FtpAuthModule} from '../auth.module';
import {FtpAuthService} from '../auth.service';
import {FtpAuthServiceMock} from '../auth.service.mock';
import { RouterTestingModule } from '@angular/router/testing';

const AUTH_CONFIG: FtpAuthConfig = {
  ApiBaseUrl: 'http://www.example.com',
  OpenIdClientId: 'my-client-id',
  OpenIdScope: 'my-scope',
  OpenIdAuthorizeEndpoint: 'http://www.example.com/authorize'
};

describe('FtpLogoutComponent', () => {
  let component: FtpLogoutComponent;
  let fixture: ComponentFixture<FtpLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FtpAuthModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {provide: FTP_AUTH_CONFIG, useValue: AUTH_CONFIG},
        {provide: FtpAuthService, useClass: FtpAuthServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtpLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defines the right logout url', () => {
    expect(document.querySelector('a').getAttribute('href'))
      .toBe('http://www.example.com/authorize'
          + '?response_type=code'
          + '&scope=my-scope'
          + '&client_id=my-client-id'
          + '&redirect_uri=http://my-mock-callback/logout/callback');
  });
});
