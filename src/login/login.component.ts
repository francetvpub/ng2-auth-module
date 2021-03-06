import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {FTP_AUTH_CONFIG} from '../auth.config.provider';
import {FtpAuthConfig} from '../auth.config';
import {FtpAuthService} from '../auth.service';

@Component({
  selector: 'app-ftp-login',
  template: `
    <a mat-raised-button color="primary"
       [href]="loginPage">
      Connexion avec France Télévision Publicité
    </a>
  `,
  styles: [`
    :host {
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
    }
  `]
})
@Injectable()
export class FtpLoginComponent implements OnInit {

  private config: FtpAuthConfig;

  public get loginPage(): string {
    if (!!this.config) {
      return this.config.OpenIdAuthorizeEndpoint
              + '?response_type=code'
              + '&scope=' + this.config.OpenIdScope
              + '&client_id=' + this.config.OpenIdClientId
              + '&redirect_uri=' + this.authService.callbackUrl;
    }
    return '';
  }

  constructor(
    @Inject(FTP_AUTH_CONFIG) config: FtpAuthConfig,
    private authService: FtpAuthService
  ) {
    this.config = config;
  }

  ngOnInit() {
  }

}
