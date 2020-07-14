import { Component, OnInit } from '@angular/core';
import { V2rayService } from '../service/v2ray/v2ray.service';
import { ToasterService } from 'angular2-toaster';
import { BackEndData } from '../public/data';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Params } from './param';
import { MsgService } from '../service/msg/msg.service';
import { SessionService } from '../service/session/session.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Stop } from '../service/v2ray/api';
import { MatDialog } from '@angular/material/dialog';
import { VmessComponent } from '../vmess/vmess.component';
// import { isNull } from 'util';

@Component({
  selector: 'app-v2ray',
  templateUrl: './v2ray.component.html',
  styleUrls: ['./v2ray.component.css']
})
export class V2rayComponent implements OnInit {
  // 是否禁用按钮
  disable: boolean
  enabled: boolean
  // 启动配置参数
  params: Params
  logs: string
  checked = true
  on = true

  constructor(
    private v2ray: V2rayService,
    private toaster: ToasterService,
    private session: SessionService,
    private helper: JwtHelperService,
    private msg: MsgService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.disable = false
    this.enabled = false
    this.params = {}
    this.logs = ''

    // 登录成功后开启 ws 协议，用于开启日志
    let ws = new WebSocket("ws://localhost:4200/api/v2ray/logs", [localStorage.getItem("access_token")])
    ws.onmessage = (v) => {
      if (this.on) {
        this.logs += v.data
      }
    }
    ws.onerror = (v) => {
      console.log(v)
    }
    ws.onclose = (v) => {
      // 刷新 token 
      if (v.code === 5001) {
        const refresh = localStorage.getItem("refresh_token")
        if (refresh === '' || this.helper.isTokenExpired(refresh)) {
          return
        }

        this.session.refreshToken<any>(refresh).subscribe((v) => {
          localStorage.setItem("access_token", v.token.access_token)
          this.msg.changemessage(1)
          ws = new WebSocket("ws://localhost:4200/api/v2ray/logs", [localStorage.getItem("access_token")])
        })
      }
    }
  }

  // 加密方式
  security(evt) {
    this.params.Security = evt.value
  }
  // 传输协议
  network(evt) {
    this.params.NetWork = evt.value
  }
  // 传输协议加密方式
  netSecurity(evt) {
    this.params.NetSecurity = evt.value
  }

  // 启动
  start() {
    if (this.enabled) {
      this.disable = true
      return
    }
    if (Object.keys(this.params).length === 0) {
      return
    }
    this.disable = true

    // 启动
    this.v2ray.start<BackEndData>(this.params).then((res) => {
      this.toaster.pop("success", "启动成功", res.data.msg)
      this.enabled = true
      this.logs = ''
    }).catch((e: HttpErrorResponse) => {
      console.log("V2ray Start Error", e)
      // 不是刷新 token 的错误，弹出错误内容。
      if (e.status == 403) {
        this.toaster.pop("warning", "长时间未操作请重新登录")
      } else {
        this.toaster.pop("error", "关闭失败", e.error.error)
      }
    }).finally(() => {
      this.disable = false
    })
  }

  // 关闭
  stop() {
    if (!this.enabled) {
      this.toaster.pop("error", "关闭失败", "服务未启动")
      return
    }
    this.disable = true

    this.v2ray.stop<BackEndData>().then((res) => {
      this.enabled = false
      this.toaster.pop("success", "关闭成功", res.data.msg)
    }).catch((e: HttpErrorResponse) => {
      console.log("V2ray Stop Error", e)
      // 不是刷新 token 的错误，弹出错误内容。
      if (e.status == 403) {
        this.toaster.pop("warning", "长时间未操作请重新登录")
      } else {
        this.toaster.pop("error", "关闭失败", e.error.error)
      }
    }).finally(() => {
      this.disable = false
    })
  }

  // 开启日志
  startLogs(started: boolean) {
    this.on = started
  }

  // 打开 vmess 协议的配置窗口
  openVmessWindow() {
    this.dialog.open(VmessComponent, {
      width: "45%"
    })
  }
}
