import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Vmess, Vless, Socks } from '../service/protocol/api';
import { URL } from 'url';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {
  // 二维码内容
  value: string

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    switch (this.data.Protocol) {
      case Vmess:
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
        this.value = "vmess://" + btoa(unescape(encodeURIComponent(objJsonStr)))
        break;
      case Vless:
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
        this.value = "vless://" + btoa(unescape(encodeURIComponent(JSON.stringify(vls))))
        break;
      case Socks:
        const socks = this.data.User + ":" + this.data.Passwd + "@" +
          this.data.Address + ":" + this.data.Port
        this.value = "socks://" + btoa(unescape(encodeURIComponent(JSON.stringify(socks)))) +
          "#" + encodeURI(this.data.Name)
        break;
      default:
        this.value = 'TODO'
        break;
    }
  }

}

// 主流 vmess 协议的格式
export interface Vmess {
  v?: string
  ps?: string
  add?: string
  port?: string
  id?: string
  aid?: string
  net?: string
  type?: string
  host?: string
  path?: string
  tls?: string
}

// 自定义 vless 协议的格式
export interface Vless {
  v?: number
  ps?: string
  add?: string
  port?: number
  id?: string
  encry?: string
  flow?: string
  net?: string
  sec?: string
  path?: string
}

