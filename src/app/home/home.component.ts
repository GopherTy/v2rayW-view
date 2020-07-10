import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { MsgService } from '../service/msg/msg.service';
import { SessionService } from '../service/session/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private helper: JwtHelperService,
    private msg: MsgService,
    private session: SessionService,

  ) { }

  ngOnInit(): void {
    const refresh = localStorage.getItem("refresh_token")
    if (refresh === '' || this.helper.isTokenExpired(refresh)) {
      return
    }

    this.session.refreshToken<any>(refresh).subscribe((v) => {
      localStorage.setItem("access_token", v.token.access_token)
      this.msg.changemessage(1)
    })
    // this.router.navigateByUrl("/v2ray")
  }



}
