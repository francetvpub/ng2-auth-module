import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FtpAuthRoutingModule } from './auth-routing.module';
import { FtpLoginComponent } from './login/login.component';
import { FtpLogoutComponent } from './logout/logout.component';
import { FtpCallbackComponent } from './callback/callback.component';
import { FTP_AUTH_CONFIG, FTP_DEFAULT_AUTH_CONFIG } from './auth.config.provider';
import { FtpAuthService } from './auth.service';
import { HttpModule } from '@angular/http';
import { CookieModule } from 'ngx-cookie';
import { FtpAuthGuardService } from './auth-guard.service';
import { FtpHttpService } from './http.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FtpAuthRoutingModule,
    MatButtonModule,
    CookieModule.forChild()
  ],
  declarations: [
    FtpLoginComponent,
    FtpLogoutComponent,
    FtpCallbackComponent
  ],
  providers: [
    FtpHttpService,
    FtpAuthService,
    FtpAuthGuardService,
    {provide: FTP_AUTH_CONFIG, useValue: FTP_DEFAULT_AUTH_CONFIG}
  ]
})
export class FtpAuthModule { }
