import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
        this.value = "vmess://" + btoa(unescape(encodeURIComponent(objJsonStr)))
        break;
      case "vless":

        break;
      default:
        this.value = 'TODO'
        break;
    }
  }

}

// 主流 vmess 协议的格式
interface Vmess {
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
interface Vless {
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

