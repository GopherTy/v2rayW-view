import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ProtocolService } from '../service/protocol/protocol.service';
import { MatDialog } from '@angular/material/dialog';
import { VmessComponent } from '../vmess/vmess.component';
import { V2rayService } from '../service/v2ray/v2ray.service';
import { BackEndData } from '../public/data';
import { ToasterService } from 'angular2-toaster';
import { HttpErrorResponse } from '@angular/common/http';
import { MsgService } from '../service/msg/msg.service';
import { VlessComponent } from '../vless/vless.component';
import { QrcodeComponent, Vmess, Vless } from '../qrcode/qrcode.component';
import { SocksParam } from '../v2ray/param';
import { SocksComponent } from '../socks/socks.component';

@Component({
  selector: 'app-protocol',
  templateUrl: './protocol.component.html',
  styleUrls: ['./protocol.component.css']
})
export class ProtocolComponent implements OnInit {
  power = false // v2ray 启动状态 
  disable: boolean // 按钮状态

  socksParam: SocksParam = {}

  data: any // 协议数据内容
  @Input()
  set value(data: any) {
    if (isNullOrUndefined(data)) {
      return
    }
    this.data = data
  }

  @Output('clickEvt')
  click = new EventEmitter<any>() // 导出属性

  constructor(
    private protocol: ProtocolService,
    private toaster: ToasterService,
    private v2ray: V2rayService,
    private dialog: MatDialog,
    private msg: MsgService,
  ) { }

  ngOnInit(): void {
    // 禁用按钮状态
    this.msg.disableSource.subscribe((b) => {
      this.disable = b
    })

    // v2ray服务器启动状态
    this.msg.statusSource.subscribe((v) => {
      if (v) {
        const status = JSON.parse(v)
        // 运行状态
        if (this.data.ID == status.id && this.data.Protocol == status.protocol) {
          this.power = status.running
        } else {
          this.power = false
        }
      }
    })

    // 订阅本地配置
    this.msg.localSettingSource.subscribe((v) => {
      if (!v) {
        this.socksParam = {
          Protocol: "socks",
          Port: 1080,
          Address: "127.0.0.1",
        }
        return
      }

      this.socksParam.Address = v.Address
      this.socksParam.Port = v.Port
      this.socksParam.Protocol = v.Protocol
    })
  }

  // 删除配置
  remove(data: any) {
    this.disable = true

    this.protocol.delete<any>({
      "name": data.Protocol,
      "id": data.ID,
    }).then(() => {
      this.toaster.pop("success", "删除成功")
      this.click.emit(this.data)
    }).catch(() => {
      this.toaster.pop("error", "删除失败")
    }).finally(() => {
      this.disable = false
    })
  }

  // 打开窗口
  openProtocolWindow(v: any) {
    switch (v.Protocol) {
      case "vmess":
        this.dialog.open(VmessComponent, {
          width: "45%",
          data: {
            "op": "update",
            "value": v,
          }
        })
        break;
      case "vless":
        this.dialog.open(VlessComponent, {
          width: "45%",
          data: {
            "op": "update",
            "value": v,
          }
        })
        break;
      case "socks":
        this.dialog.open(SocksComponent, {
          width: "45%",
          data: {
            "op": "update",
            "value": v,
          }
        })
        break;
      default:
        break;
    }
  }
  // 二维码窗口
  openQrCodeWindow(v: any) {
    this.dialog.open(QrcodeComponent, {
      data: v,
    })
  }

  // 复制base64编码到剪贴板
  copyToClipboard() {
    let content
    switch (this.data.Protocol) {
      case "vmess":
        const vms: Vmess = {
          v: this.data.Level,
          ps: this.data.Name,
          add: this.data.Address,
          port: this.data.Port,
          id: this.data.UserID,
          aid: this.data.AlertID,
          net: this.data.Network,
          host: this.data.Domains,
          type: this.data.Security,
          path: this.data.Path,
          tls: this.data.NetSecurity,
        }
        let objJsonStr = JSON.stringify(vms);
        content = "vmess://" + btoa(unescape(encodeURIComponent(objJsonStr)))
        break;
      case "vless":
        const vls: Vless = {
          v: this.data.Level,
          ps: this.data.Name,
          add: this.data.Address,
          port: this.data.Port,
          id: this.data.UserID,
          encry: this.data.Encryption,
          flow: this.data.Flow,
          net: this.data.Network,
          sec: this.data.NetSecurity,
          path: this.data.Path,
        }
        content = "vless://" + btoa(unescape(encodeURIComponent(JSON.stringify(vls))))
        break;
      default:
        content = 'TODO'
        break;
    }
    return content
  }

  // 复制完整配置文件
  copyAllToClipboard() {
    let content = {
      "log": {
        "access": "",
        "error": "",
        "loglevel": "warning"
      },
      "api": null,
      "dns": {},
      "routing": {},
      "policy": {},
      "inbounds": [
        {
          "listen": this.socksParam.Address,
          "port": this.socksParam.Port,
          "protocol": this.socksParam.Protocol,
          "settings": {
            "auth": "noauth"
          },
          "sniffing": {
            "destOverride": [
              "http",
              "tls"
            ],
            "enabled": true
          }
        }
      ],
      "outbounds": [
        {},
      ],
      "transport": {},
      "stats": {},
      "reverse": {}
    }
    if (this.data.Direct) {
      content.routing = {
        "domainStrategy": "IPOnDemand",
        "rules": [
          {
            "type": "field",
            "outboundTag": "direct",
            "domain": ["geosite:cn"], // 中国大陆主流网站的域名
          },
          {
            "type": "field",
            "outboundTag": "direct",
            "ip": ["geoip:cn", "geoip:private"],
          }
        ],
      }
      content.outbounds.push({
        "protocol": "freedom",
        "settings": {},
        "tag": "direct",
      })
    }
    switch (this.data.Protocol) {
      case "vmess":
        content.outbounds[0] = {
          "mux": {
            "concurrency": 8,
            "enabled": false
          },
          "protocol": "vmess",
          "settings": {
            "vnext": [
              {
                "address": this.data.Address,
                "port": this.data.Port,
                "users": [
                  {
                    "alterId": this.data.AlertID,
                    "id": this.data.UserID,
                    "level": this.data.Level,
                    "security": this.data.Security
                  }
                ]
              }
            ]
          },
          "streamSettings": {
            "network": this.data.Network,
            "security": this.data.NetSecurity,
            "wsSettings": {
              "path": this.data.Path
            }
          }
        }
        break;
      case "vless":
        content.outbounds[0] = {
          "mux": {
            "concurrency": 8,
            "enabled": false
          },
          "protocol": "vless",
          "settings": {
            "vnext": [
              {
                "address": this.data.Address,
                "port": this.data.Port,
                "users": [
                  {
                    "id": this.data.UserID,
                    "flow": this.data.Flow,
                    "encryption": this.data.Encryption,
                    "level": this.data.Level,
                  }
                ]
              }
            ]
          },
          "streamSettings": {
            "network": this.data.Network,
            "security": this.data.NetSecurity,
            "wsSettings": {
              "path": this.data.Path
            }
          }
        }
        break;
      default:
        break;
    }

    return JSON.stringify(content)
  }

  // 控制 v2ray 的开启和关闭
  switch() {
    if (this.power) {
      this.stop()
    } else {
      this.start()
    }
  }

  // 开启
  start() {
    this.msg.disableButton(true)
    // 启动
    this.v2ray.start<BackEndData>(this.data).then((res) => {
      this.toaster.pop("success", "启动成功", res.data.msg)
      this.power = true
    }).catch((e: HttpErrorResponse) => {
      // 不是刷新 token 的错误，弹出错误内容。
      if (e.status == 403) {
        this.toaster.pop("warning", "长时间未操作请重新登录")
      } else {
        this.toaster.pop("error", "启动失败", e.error.error)
      }
    }).finally(() => {
      this.msg.disableButton(false)
    })
  }

  // 关闭
  stop() {
    this.msg.disableButton(true)

    this.v2ray.stop<BackEndData>().then((res) => {
      this.power = false
      this.toaster.pop("success", "关闭成功", res.data.msg)
    }).catch((e: HttpErrorResponse) => {
      // 不是刷新 token 的错误，弹出错误内容。
      if (e.status == 403) {
        this.toaster.pop("warning", "长时间未操作请重新登录")
      } else {
        this.toaster.pop("error", "关闭失败", e.error.error)
      }
    }).finally(() => {
      this.msg.disableButton(false)
    })
  }
}
