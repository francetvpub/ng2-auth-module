import { TestBed, inject } from '@angular/core/testing';

import { FtpHttpService } from './http.service';
import {HttpModule, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {FtpAuthServiceMock} from '../../../ng2-auth-module/auth.service.mock';

describe('FtpHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FtpHttpService,
        { provide: XHRBackend, useClass: MockBackend },
        FtpAuthServiceMock
      ],
      imports: [
        HttpModule
      ]
    });
  });

  it('should be created', inject([FtpHttpService], (service: FtpHttpService) => {
    expect(service).toBeTruthy();
  }));
});
