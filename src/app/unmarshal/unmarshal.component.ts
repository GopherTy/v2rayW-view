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
    const ss = protContent.split("#")
    let data, ps, userCnf, serverCnf
    if (ss.length == 2) {
      ps = decodeURI(ss[1])
      data = this.b64_to_utf8(ss[0])
      const cnf = data.split("@")
      if (cnf.length != 2) {
        this.toaster.pop("error", "导入失败", "不支持该格式")
        return
      }
      userCnf = cnf[0].split(":")
      serverCnf = cnf[1].split(":")
      if (userCnf.length != 2 || serverCnf.length != 2) {
        this.toaster.pop("error", "导入失败", "不支持该格式")
        return
      }
    } else {
      data = JSON.parse(this.b64_to_utf8(protContent))
    }

    const uid = this.jwt.decodeToken(this.jwt.tokenGetter()).user_id
    switch (protName.toUpperCase()) {
      case "VLESS":
        this.toaster.pop("error", "导入失败", "不支持该格式")
        break;
      case "VMESS":
        this.protocol = {
          Protocol: protName,
          UID: uid,
          Name: data.ps,
          Address: data.add,
          AlertID: +data.aid,
          Domains: data.host,
          Level: +data.v,
          NetSecurity: data.tls,
          Network: data.net,
          Path: data.path,
          Port: +data.port,
          Security: data.type,
          UserID: data.id,
          Direct: false
        }
        break;
      case "SOCKS":
        this.protocol = {
          Protocol: protName,
          UID: uid,
          Direct: false,
          Name: ps,
          Address: serverCnf[0],
          Port: +serverCnf[1],
          User: userCnf[0],
          Passwd: userCnf[1],
        }
        break;
      case "SS":
        this.protocol = {
          Protocol: "shadowsocks",
          UID: uid,
          Direct: false,
          Name: ps,
          Address: serverCnf[0],
          Port: +serverCnf[1],
          Security: userCnf[0],
          Passwd: userCnf[1],
        }
        break;
      default:
        this.toaster.pop("warning", "导入失败", "暂不支持该协议")
        return;
    }

    this.protService.save<any>(this.protocol).then((v) => {
      this.protocol.ID = v.data.id
      this.protocol.ConfigFile = v.data.cnf
      this.msg.addProtocol(this.protocol)
      this.toaster.pop("success", "导入成功")
    }).catch((e) => {
      console.log(e)
      this.toaster.pop("error", "导入失败")
    })

    this.dialogRef.close()
  }

  // decode 
  b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
  }
}
