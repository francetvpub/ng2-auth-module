import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FtpCallbackComponent } from './callback.component';
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

describe('FtpCallbackComponent', () => {
  let component: FtpCallbackComponent;
  let fixture: ComponentFixture<FtpCallbackComponent>;

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
    fixture = TestBed.createComponent(FtpCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
