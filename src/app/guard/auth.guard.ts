import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MsgService } from '../service/msg/msg.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private helper: JwtHelperService,
    private router: Router,
    private msg: MsgService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.helper.isTokenExpired(localStorage.getItem("refresh_token"))) {
      this.router.navigateByUrl("/")
      return false;
    }

    this.msg.changemessage(1)
    return true;
  }

}
