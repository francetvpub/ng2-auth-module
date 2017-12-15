import {InjectionToken} from '@angular/core';
import {FtpAuthConfig} from './auth.config';

export const FTP_DEFAULT_AUTH_CONFIG: FtpAuthConfig = {
  ApiBaseUrl: '',
  OpenIdClientId: '',
  OpenIdScope: '',
  OpenIdAuthorizeEndpoint: ''
}

export const FTP_AUTH_CONFIG = new InjectionToken<FtpAuthConfig>('ftp-auth-config');
