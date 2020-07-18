import { Component, OnInit, OnDestroy } from '@angular/core';
import { V2rayService } from '../service/v2ray/v2ray.service';
import { ToasterService } from 'angular2-toaster';
import { BackEndData } from '../public/data';
import { HttpErrorResponse } from '@angular/common/http';
import { Params } from './param';
import { MsgService } from '../service/msg/msg.service';
import { SessionService } from '../service/session/session.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { VmessComponent } from '../vmess/vmess.component';
import { ProtocolService } from '../service/protocol/protocol.service';
import { isNull, isNullOrUndefined } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-v2ray',
  templateUrl: './v2ray.component.html',
  styleUrls: ['./v2ray.component.css']
})
export class V2rayComponent implements OnInit, OnDestroy {
  // 是否禁用按钮
  disable: boolean
  enabled: boolean
  // 启动配置参数
  params: Params
  logs: string
  checked = true
  on = true

  // v2ray 状态
  wsStatus: WebSocket
  // logs 
  wsLogs: WebSocket

  // 协议内容
  protocols: Array<any>

  constructor(
    private v2ray: V2rayService,
    private toaster: ToasterService,
    private session: SessionService,
    private helper: JwtHelperService,
    private msg: MsgService,
    private dialog: MatDialog,
    private proto: ProtocolService,
  ) { }

  ngOnInit(): void {
    this.disable = false
    this.enabled = false
    this.params = {}
    this.logs = ''
    this.protocols = new Array<any>()

    // 订阅协议，增加到视图上。
    this.msg.protocolSource.subscribe((protocol) => {
      if (isNull(protocol)) {
        return
      }
      this.protocols.push(protocol)
    })

    // 获取协议列表
    const userInfo = this.helper.decodeToken(this.helper.tokenGetter())
    this.proto.list<any>({
      uid: userInfo.user_id,
    }).then((v) => {
      if (v.data.vmess === null) {
        this.toaster.pop("warning", "此用户无代理协议")
        return
      }
      v.data.vmess.forEach((data) => {
        this.protocols.push(data)
      })
    }).catch(() => {
      this.toaster.pop("error", "获取协议列表失败")
    })


    // 登录成功后开启 ws 协议，用于开启日志
    this.wsStatus = new WebSocket("ws://localhost:4200/api/v2ray/status", [localStorage.getItem("access_token")])
    this.wsStatus.onmessage = (v) => {
      this.msg.v2rayStatus(v.data)
    }
    this.wsStatus.onerror = (v) => {
      console.log(v)
      this.toaster.pop("error", "获取 v2ray 状态失败")
    }
    this.wsStatus.onclose = (v) => {
      // 刷新 token 
      if (v.code === 5001) {
        const refresh = localStorage.getItem("refresh_token")
        if (refresh === '' || this.helper.isTokenExpired(refresh)) {
          return
        }

        this.session.refreshToken<any>(refresh).subscribe((v) => {
          localStorage.setItem("access_token", v.token.access_token)
          this.msg.changemessage(1)
          this.wsStatus = new WebSocket("ws://localhost:4200/api/v2ray/status", [localStorage.getItem("access_token")])
        })
      }
    }

    // 登录成功后开启 ws 协议，用于开启日志
    this.wsLogs = new WebSocket("ws://localhost:4200/api/v2ray/logs", [localStorage.getItem("access_token")])
    this.wsLogs.onmessage = (v) => {
      if (this.on) {
        this.logs += v.data
      }
    }
    this.wsLogs.onerror = (v) => {
      console.log(v)
      this.toaster.pop("error", "获取 v2ray 日志失败")
    }
    this.wsLogs.onclose = (v) => {
      // 刷新 token 
      if (v.code === 5001) {
        const refresh = localStorage.getItem("refresh_token")
        if (refresh === '' || this.helper.isTokenExpired(refresh)) {
          return
        }

        this.session.refreshToken<any>(refresh).subscribe((v) => {
          localStorage.setItem("access_token", v.token.access_token)
          this.msg.changemessage(1)
          this.wsLogs = new WebSocket("ws://localhost:4200/api/v2ray/logs", [localStorage.getItem("access_token")])
        })
      }
    }
  }
  ngOnDestroy(): void {
    this.wsLogs.close()
    this.wsStatus.close()
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
      width: "45%",
      data: {
        "op": "add",
      }
    })
  }

  // 删除
  remove(evt: any) {
    const index = this.protocols.indexOf(evt, 0)
    if (index > -1) {
      this.protocols.splice(index, 1)
    }
  }
}
