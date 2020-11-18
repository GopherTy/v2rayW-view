import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToasterService } from 'angular2-toaster';
import { MsgService } from '../service/msg/msg.service';
import { Params } from '../v2ray/param';
import { ProtocolService } from '../service/protocol/protocol.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-unmarshal',
  templateUrl: './unmarshal.component.html',
  styleUrls: ['./unmarshal.component.css']
})
export class UnmarshalComponent implements OnInit {
  content = ''
  protocol: Params
  constructor(
    private toaster: ToasterService,
    private msg: MsgService,
    private jwt: JwtHelperService,
    private protService: ProtocolService,
    private dialogRef: MatDialogRef<UnmarshalComponent>,
  ) { }

  ngOnInit(): void {
  }

  // 导入
  import() {
    const content = this.content.trim()
    if (!content || content === '') {
      this.toaster.pop("error", "导入失败", "格式错误")
      return
    }

    const rest = content.split("://")
    if (rest.length != 2) {
      this.toaster.pop("error", "导入失败", "不支持该格式")
      return
    }
    const protName = rest[0]
    const protContent = rest[1]

    const uid = this.jwt.decodeToken(this.jwt.tokenGetter()).user_id
    switch (protName.toUpperCase()) {
      case "VLESS":
        const s = this.b64_to_utf8(protContent)
        console.log(s)
        break;
      case "VMESS":
        const vmess = JSON.parse(this.b64_to_utf8(protContent))
        this.protocol = {
          Protocol: "vmess",
          UID: uid,
          Name: vmess.ps,
          Address: vmess.add,
          AlertID: vmess.aid,
          Domains: vmess.host,
          Level: vmess.v,
          NetSecurity: vmess.tls,
          Network: vmess.net,
          Path: vmess.path,
          Port: vmess.port,
          Security: vmess.type,
          UserID: vmess.id,
          Direct: false
        }
        this.protService.save<any>(this.protocol).then((v) => {
          this.protocol.ID = v.data.id
          this.msg.addProtocol(this.protocol)
          this.toaster.pop("success", "导入成功")
        }).catch((e) => {
          console.log(e)
          this.toaster.pop("error", "导入失败")
        })
        break;
      default:
        this.toaster.pop("warning", "导入失败", "暂不支持该协议")
        return;
    }

    this.dialogRef.close()
  }

  // decode 
  b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
  }
}
