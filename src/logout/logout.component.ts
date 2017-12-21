import {Component, Injectable, OnInit} from '@angular/core';
import {FtpAuthService} from '../auth.service';

@Component({
  selector: 'app-ftp-logout',
  template: `
    <p *ngIf="inProgress">En cours de déconnexion...</p>
    <p *ngIf="!inProgress">Vous avez été déconnecté!</p>
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
