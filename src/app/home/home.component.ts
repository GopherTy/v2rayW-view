import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { MsgService } from '../service/msg/msg.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private helper: JwtHelperService,
    private msg: MsgService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const access = localStorage.getItem("access_token")
    if (access === '' || this.helper.isTokenExpired(access)) {
      return
    }
    this.msg.changemessage(1)
    this.router.navigateByUrl("/v2ray")
  }

}
