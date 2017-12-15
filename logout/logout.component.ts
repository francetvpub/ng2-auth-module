import {Component, Injectable, OnInit} from '@angular/core';
import {FtpAuthService} from '../auth.service';

@Component({
  selector: 'app-ftp-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
@Injectable()
export class FtpLogoutComponent implements OnInit {

  public inProgress = true;

  constructor(
    private authService: FtpAuthService
  ) {}

  ngOnInit() {
    this.inProgress = true;
    this.authService.clearIdentity().subscribe(() => {
      this.inProgress = false;
    });
  }

}
