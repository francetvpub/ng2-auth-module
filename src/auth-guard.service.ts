import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {FtpAuthService} from './auth.service';

@Injectable()
export class FtpAuthGuardService implements CanActivate {

  constructor(
    private authService: FtpAuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated()
      .do((result) => {
        if (!result) {
          this.authService.redirectUrl = state.url;
          this.router.navigate(['/login']);
        }
      });
  }

}
