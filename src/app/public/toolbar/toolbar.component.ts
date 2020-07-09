import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { JoinComponent } from '../join/join.component';
import { MsgService } from 'src/app/service/msg/msg.service';
import { SessionService } from 'src/app/service/session/session.service';
import { BackEndData } from '../data';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'public-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  // properties
  hiddenIcon: boolean

  // inject dialog service
  constructor(
    private dialog: MatDialog,
    private session: SessionService,
    private toast: ToasterService,
    private router: Router,
    private msg: MsgService,
  ) { }

  ngOnInit(): void {
    this.hiddenIcon = true
    this.msg.messageSource.subscribe((single) => {
      switch (single) {
        case 1:
          this.hiddenIcon = false
          break;
        case 2:
          this.hiddenIcon = true
          break;
        default:
          break;
      }
    })
  }

  // open LoginComponent
  openLogin() {
    this.dialog.open(LoginComponent)
  }

  // open JoinComponent
  openJoin() {
    this.dialog.open(JoinComponent)
  }

  // 登出
  loggout() {
    this.session.logout<BackEndData>().then((v) => {
      this.msg.changemessage(2)
      this.toast.pop("success", "登出成功", "你已经退出本系统")
      localStorage.clear()
      this.router.navigateByUrl("")
    }).catch((e: HttpErrorResponse) => {
      console.log("Loggout Error", e)
      // 不是刷新 token 的错误，弹出错误内容。
      if (e.status == 403) {
        this.toast.pop("warning", "长时间未操作请重新登录")
      } else {
        this.toast.pop("error", "登出失败", e.error.error)
      }
    })
  }
}
