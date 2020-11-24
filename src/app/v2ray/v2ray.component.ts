import { Component, OnInit, OnDestroy } from '@angular/core';
import { V2rayService } from '../service/v2ray/v2ray.service';
import { ToasterService } from 'angular2-toaster';
import { BackEndData } from '../public/data';
import { HttpErrorResponse } from '@angular/common/http';
import { Params, SocksParam, SubscribeParam } from './param';
import { MsgService } from '../service/msg/msg.service';
import { SessionService } from '../service/session/session.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { VmessComponent } from '../vmess/vmess.component';
import { ProtocolService } from '../service/protocol/protocol.service';
import { getWebSocketAddr, Status, Logs } from '../service/v2ray/api';
import { VlessComponent } from '../vless/vless.component';
import { SubconfigComponent } from '../subconfig/subconfig.component';
import { SubscribeService } from '../service/subscribe/subscribe.service';
import { UnmarshalComponent } from '../unmarshal/unmarshal.component';
import { SocksComponent } from '../socks/socks.component';
import { Vmess, Vless, Socks, Shadowsocks } from '../service/protocol/api';
import { ShadowsocksComponent } from '../shadowsocks/shadowsocks.component';
import { ConfigfileComponent } from '../configfile/configfile.component';

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

  // 本地代理配置 
  socksParam: SocksParam
  // 订阅
  subscribeParam: SubscribeParam

  // v2ray 状态
  wsStatus: WebSocket
  // logs 
  wsLogs: WebSocket

  // 协议内容
  _vmessProt: Map<number, any> = new Map<number, any>();
  _vlessProt: Map<number, any> = new Map<number, any>();
  _socksProt: Map<number, any> = new Map<number, any>();
  _shadowsocksProt: Map<number, any> = new Map<number, any>();
  protocols: Array<any>

  // 订阅地址
  subscribes: Array<any>
  _subscribeMap: Map<number, any> = new Map<number, any>();

  constructor(
    private v2ray: V2rayService,
    private toaster: ToasterService,
    private session: SessionService,
    private helper: JwtHelperService,
    private msg: MsgService,
    private dialog: MatDialog,
    private proto: ProtocolService,
    private subSerivce: SubscribeService,
  ) { }

  ngOnInit(): void {
    this.disable = false
    this.enabled = false
    this.params = {}
    this.logs = ''
    this.protocols = new Array<any>()
    this.socksParam = {}
    this.subscribes = new Array<any>()
    this.subscribeParam = {}

    // 获取 v2ray 参数配置
    this.v2ray.listSettings<any>().then((v) => {
      const settings = v.data.settings
      if (!settings) {
        this.socksParam = {
          Protocol: "socks",
          Port: 1080,
          Address: "127.0.0.1",
        }
        return
      }

      this.socksParam.Address = settings.address
      this.socksParam.Port = settings.port
      this.socksParam.Protocol = settings.protocol

      this.msg.localSetting(this.socksParam)
    }).catch((e) => {
      this.toaster.pop("error", "获取参数配置失败", e.error)
    })

    // 订阅协议，增加到视图上。
    this.msg.protocolSource.subscribe((protocol) => {
      if (!protocol) {
        return
      }
      this.protocols.push(protocol)
      switch (protocol.Protocol) {
        case Vmess:
          this._vmessProt.set(protocol.ID, protocol)
          break;
        case Vless:
          this._vlessProt.set(protocol.ID, protocol)
          break;
        case Socks:
          this._socksProt.set(protocol.ID, protocol)
          break;
        case Shadowsocks:
          this._shadowsocksProt.set(protocol.ID, protocol)
          break;
      }
    })
    // 修改协议
    this.msg.updateProtocolSource.subscribe((protocol) => {
      if (!protocol) {
        return
      }
      let preProtocol: any
      switch (protocol.Protocol) {
        case Vmess:
          preProtocol = this._vmessProt.get(protocol.ID)
          this._vmessProt.set(protocol.ID, protocol)
          break;
        case Vless:
          preProtocol = this._vlessProt.get(protocol.ID)
          this._vlessProt.set(protocol.ID, protocol)
          break;
        case Socks:
          preProtocol = this._socksProt.get(protocol.ID)
          this._socksProt.set(protocol.ID, protocol)
          break;
        case Shadowsocks:
          preProtocol = this._shadowsocksProt.get(protocol.ID)
          this._shadowsocksProt.set(protocol.ID, protocol)
          break;
      }

      const index = this.protocols.indexOf(preProtocol)
      if (index === -1) {
        return
      }
      this.protocols[index] = protocol
    }, (err) => {
      console.error(err)
    })

    // 增加订阅地址
    this.msg.addSubscribeSource.subscribe((data) => {
      if (!data) {
        return
      }
      this.subscribes.push(data)
      this._subscribeMap.set(data.ID, data)
    }, (err) => {
      console.error(err)
    })
    // 修改订阅地址
    this.msg.updateSubscribeSource.subscribe((data) => {
      if (!data) {
        return
      }

      const preData = this._subscribeMap.get(data.ID)
      const index = this.subscribes.indexOf(preData)
      if (index === -1) {
        return
      }
      this.subscribes[index] = data
      this._subscribeMap.set(data.ID, data)
    }, (err) => {
      console.error(err)
    })

    // 获取协议列表
    const userInfo = this.helper.decodeToken(this.helper.tokenGetter())
    this.proto.list<any>({
      uid: userInfo.user_id,
    }).then((v) => {
      if (!v.data.vmess && !v.data.vless &&
        !v.data.socks && !v.data.shadowsocks) {
        this.toaster.pop("warning", "暂无代理协议")
        return
      }
      if (v.data.vmess) {
        v.data.vmess.forEach((data) => {
          this.protocols.push(data)
          this._vmessProt.set(data.ID, data)
        })
      }
      if (v.data.vless) {
        v.data.vless.forEach((data) => {
          this.protocols.push(data)
          this._vlessProt.set(data.ID, data)
        })
      }
      if (v.data.socks) {
        v.data.socks.forEach((data) => {
          this.protocols.push(data)
          this._socksProt.set(data.ID, data)
        })
      }
      if (v.data.shadowsocks) {
        v.data.shadowsocks.forEach((data) => {
          this.protocols.push(data)
          this._shadowsocksProt.set(data.ID, data)
        })
      }
    }).catch((e) => {
      console.log(e)
      this.toaster.pop("error", "获取协议列表失败")
    })

    // 获取订阅地址
    this.subscribeParam.UID = userInfo.user_id
    this.subSerivce.list<any>(this.subscribeParam).
      then((v) => {
        if (!v.data.content) {
          return
        }
        if (v.data.content) {
          v.data.content.forEach((data) => {
            this.subscribes.push(data)
          })
        }
      }).catch((e) => {
        console.log(e)
        this.toaster.pop("error", "获取订阅地址失败")
      })


    // 登录成功后开启 ws 协议，用于开启日志
    const statusAddr = getWebSocketAddr(Status)
    this.wsStatus = new WebSocket(statusAddr, [localStorage.getItem("access_token")])
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
          this.wsStatus = new WebSocket(statusAddr, [localStorage.getItem("access_token")])
        })
      }
    }

    // 登录成功后开启 ws 协议，用于开启日志
    const logsAddr = getWebSocketAddr(Logs)
    this.wsLogs = new WebSocket(logsAddr, [localStorage.getItem("access_token")])
    this.wsLogs.onmessage = (v) => {
      if (this.on) {
        this.logs = v.data + this.logs
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
          this.wsLogs = new WebSocket(logsAddr, [localStorage.getItem("access_token")])
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
    this.params.Network = evt.value
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

  // 打开 vless 协议的窗口配置
  openVLESSWindow() {
    this.dialog.open(VlessComponent, {
      width: "45%",
      data: {
        "op": "add",
      }
    })
  }


  // 打开 socks 协议的窗口配置
  openSocksWindow() {
    this.dialog.open(SocksComponent, {
      width: "45%",
      data: {
        "op": "add",
      }
    })
  }

  // 打开 shadowsocks 协议的窗口配置
  openShadowsocksWindow() {
    this.dialog.open(ShadowsocksComponent, {
      width: "45%",
      data: {
        "op": "add",
      }
    })
  }

  // 打开 URL 导入窗口
  openLoadConfigWindow() {
    this.dialog.open(UnmarshalComponent, {
      width: "45%",
      data: {
        "op": "add",
      }
    })
  }
  // 完整配置导入
  openLoadConfigFileWindow() {
    this.dialog.open(ConfigfileComponent, {
      width: "45%",
      data: {
        "op": "add",
      }
    })
  }

  // 打开订阅窗口配置
  openSubconfigWindow() {
    this.dialog.open(SubconfigComponent, {
      width: "45%",
      data: {
        "op": "add",
      }
    })
  }

  // 删除协议
  remove(evt: any) {
    const index = this.protocols.indexOf(evt, 0)
    if (index > -1) {
      this.protocols.splice(index, 1)
    }

    switch (evt.Protocol) {
      case Vmess:
        this._vmessProt.delete(evt.ID)
        break;
      case Vless:
        this._vlessProt.delete(evt.ID)
        break;
      case Socks:
        this._socksProt.delete(evt.ID)
        break;
      case Shadowsocks:
        this._socksProt.delete(evt.ID)
        break;
    }
  }


  // 参数设置
  settings() {
    if (Object.keys(this.socksParam).length === 0) {
      return
    }
    this.disable = true

    this.v2ray.settings<BackEndData>(this.socksParam).then((res) => {
      this.toaster.pop("success", "保存成功", res.data.msg)
    }).catch((e: HttpErrorResponse) => {
      // 不是刷新 token 的错误，弹出错误内容。
      if (e.status == 403) {
        this.toaster.pop("warning", "长时间未操作请重新登录")
      } else {
        this.toaster.pop("error", "保存失败", e.error.error)
      }
    }).finally(() => {
      this.disable = false
    })
  }

  // 订阅服务
  subscribe() {
    this.disable = true
    this.subscribes.forEach((param) => {
      this.subSerivce.subscribe<any>(param).then((v) => {
        this.toaster.pop("success", param.Name + ": 订阅成功")
        if (!v.data.vmess && !v.data.vless && !v.data.socks && v.data.shadowsocks) {
          return
        }
        if (v.data.vmess) {
          v.data.vmess.forEach((data) => {
            this.protocols.push(data)
            this._vmessProt.set(data.ID, data)
          })
        }
        if (v.data.vless) {
          v.data.vless.forEach((data) => {
            this.protocols.push(data)
            this._vlessProt.set(data.ID, data)
          })
        }
        if (v.data.socks) {
          v.data.socks.forEach((data) => {
            this.protocols.push(data)
            this._socksProt.set(data.ID, data)
          })
        }
        if (v.data.shadowsocks) {
          v.data.shadowsocks.forEach((data) => {
            this.protocols.push(data)
            this._shadowsocksProt.set(data.ID, data)
          })
        }
      }).catch((e) => {
        console.log(e)
        this.toaster.pop("error", param.Name + ": 订阅失败")
      }).finally(() => {
        this.disable = false
      })
    })
  }

  // 删除订阅地址
  removeSubscribeURL(evt: any) {
    const index = this.subscribes.indexOf(evt, 0)
    if (index > -1) {
      this.subscribes.splice(index, 1)
    }

    this._subscribeMap.delete(evt.ID)
  }

  //清空服务列表
  clearProtocol() {
    this.disable = true

    const userInfo = this.helper.decodeToken(this.helper.tokenGetter())
    this.proto.clear({
      UID: userInfo.user_id,
    }).then(() => {
      this.toaster.pop("success", "清空成功")
      this.protocols = []
      this._vmessProt.clear()
      this._vlessProt.clear()
      this._shadowsocksProt.clear()
      this._socksProt.clear()
    }).catch((e) => {
      console.log(e)
      this.toaster.pop("error", "清空失败")
    }).finally(() => {
      this.disable = false
    })
  }

  // 清空日志
  clearLog() {
    this.logs = ''
  }
}
