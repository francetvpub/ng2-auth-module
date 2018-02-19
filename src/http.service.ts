import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FtpAuthService} from './auth.service';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class FtpHttpService {

  constructor(
    private http: HttpClient,
    private authService: FtpAuthService
  ) { }

  public get(url: string): Observable<Object> {
    return this.authService.getRequestOptionsArgs()
      .switchMap((requestOptionsArgs: {headers?: HttpHeaders | {
        [header: string]: string | string[];
      }}) => this.http.get(url, requestOptionsArgs));
  }

  public post(url: string, data: any): Observable<Object> {
    return this.authService.getRequestOptionsArgs()
      .switchMap((requestOptionsArgs: {headers?: HttpHeaders | {
        [header: string]: string | string[];
      }}) => this.http.post(url, data, requestOptionsArgs));
  }

  public delete(url: string): Observable<Object> {
    return this.authService.getRequestOptionsArgs()
      .switchMap((requestOptionsArgs: {headers?: HttpHeaders | {
        [header: string]: string | string[];
      }}) => this.http.delete(url, requestOptionsArgs));
  }

  public put(url: string, data: any): Observable<Object> {
    return this.authService.getRequestOptionsArgs()
      .switchMap((requestOptionsArgs: {headers?: HttpHeaders | {
        [header: string]: string | string[];
      }}) => this.http.put(url, data, requestOptionsArgs));
  }
}
