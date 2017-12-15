import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {FtpAuthService} from './auth.service';

@Injectable()
export class FtpHttpService {

  constructor(
    private http: Http,
    private authService: FtpAuthService
  ) { }

  public get(url: string): Observable<Response> {
    return this.authService.getRequestOptionsArgs()
      .switchMap(requestOptionsArgs => this.http.get(url, requestOptionsArgs));
  }

  public post(url: string, data: any): Observable<Response> {
    return this.http.post(url, data);
  }

  public delete(url: string): Observable<Response> {
    return this.http.delete(url);
  }
}
