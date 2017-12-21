import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { CookieModule } from 'ngx-cookie';
import { FtpAuthGuardService } from './src/auth-guard.service';
import { FtpAuthService } from './src/auth.service';
import { FtpHttpService } from './src/http.service';
import { FtpCallbackComponent } from './src/callback/callback.component';
import { FtpLogoutComponent } from './src/logout/logout.component';
import { FtpLoginComponent } from './src/login/login.component';
import { FtpAuthRoutingModule } from './src/auth-routing.module';
import { FTP_AUTH_CONFIG, FTP_DEFAULT_AUTH_CONFIG } from './src/auth.config.provider';

export * from './src/auth.config.provider';
export * from './src/auth.config';
export * from './src/auth.service';
export * from './src/auth-guard.service';
export * from './src/http.service';
export * from './src/identity';
export * from './src/callback/callback.component';
export * from './src/login/login.component';
export * from './src/logout/logout.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
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
