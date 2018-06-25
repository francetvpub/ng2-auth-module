import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface FtpAuthConfig {
  ApiBaseUrl: string;
  OpenIdClientId: string;
  OpenIdClientSecret?: string;
  OpenIdScope: string;
  OpenIdAuthorizeEndpoint: string;
}

export interface FtpRequestOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}
