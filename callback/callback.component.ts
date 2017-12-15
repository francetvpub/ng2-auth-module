import {Component, Injectable, OnInit} from '@angular/core';
import {FtpAuthService} from '../auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-ftp-auth-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
@Injectable()
export class FtpCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: FtpAuthService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      const authorizationCode = params['code'];

      this.authService.authenticate(authorizationCode)
        .subscribe(result => {
          this.router.navigate([this.authService.redirectUrl]);
        });
    });
  }

}
