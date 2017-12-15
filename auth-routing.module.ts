import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FtpCallbackComponent } from './callback/callback.component';
import { FtpLoginComponent } from './login/login.component';
import { FtpLogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: 'logout', component: FtpLogoutComponent },
  { path: 'login', component: FtpLoginComponent },
  { path: 'login/callback', component: FtpCallbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FtpAuthRoutingModule { }
