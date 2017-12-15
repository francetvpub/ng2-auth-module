import { Injectable } from '@angular/core';
import {FtpAuthService} from './auth.service';

@Injectable()
export class FtpAuthServiceMock extends FtpAuthService {

  public get callbackUrl(): string {
    return 'http://my-mock-callback/login/callback';
  }

}
