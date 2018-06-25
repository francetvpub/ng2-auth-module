import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FtpAuthService} from './auth.service';
import 'rxjs/add/operator/switchMap';
import { FtpRequestOptions } from './auth.config';

@Injectable()
export class FtpHttpService {

  constructor(
    private http: HttpClient,
    private authService: FtpAuthService
  ) { }

  public get(url: string, options?: FtpRequestOptions): Observable<any> {
    return this.authService.getRequestOptionsArgs(options)
      .switchMap((requestOptionsArgs: {headers?: HttpHeaders | {
        [header: string]: string | string[];
      }}) => this.http.get(url, requestOptionsArgs));
  }

  public post(url: string, data: any, options?: FtpRequestOptions): Observable<any> {
    return this.authService.getRequestOptionsArgs(options)
      .switchMap((requestOptionsArgs: {headers?: HttpHeaders | {
        [header: string]: string | string[];
      }}) => this.http.post(url, data, requestOptionsArgs));
  }

  public delete(url: string, options?: FtpRequestOptions): Observable<any> {
    return this.authService.getRequestOptionsArgs(options)
      .switchMap((requestOptionsArgs: {headers?: HttpHeaders | {
        [header: string]: string | string[];
      }}) => this.http.delete(url, requestOptionsArgs));
  }

  public put(url: string, data: any, options?: FtpRequestOptions): Observable<any> {
    return this.authService.getRequestOptionsArgs(options)
      .switchMap((requestOptionsArgs: {headers?: HttpHeaders | {
        [header: string]: string | string[];
      }}) => this.http.put(url, data, requestOptionsArgs));
  }

  public patch(url: string, data: any, options?: FtpRequestOptions): Observable<any> {
    return this.authService.getRequestOptionsArgs(options)
      .switchMap((requestOptionsArgs: {headers?: HttpHeaders | {
        [header: string]: string | string[];
      }}) => this.http.patch(url, data, requestOptionsArgs));
  }
}
