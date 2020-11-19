import { Component, OnInit, Inject } from '@angular/core';
import { Params } from '../v2ray/param';
import { ProtocolService } from '../service/protocol/protocol.service';
import { ToasterService } from 'angular2-toaster';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MsgService } from '../service/msg/msg.service';
import { Vmess } from '../service/protocol/api';
@Component({
  selector: 'app-vmess',
  templateUrl: './vmess.component.html',
  styleUrls: ['./vmess.component.css']
})
export class VmessComponent implements OnInit {
  // 是否禁用按钮
  disable = false
  // 启动配置参数
  params: Params

  // 控制增加或者修改的开关，默认增加。
  on: boolean

  constructor(
    private protocol: ProtocolService,
    private toaster: ToasterService,
    private dialogRef: MatDialogRef<VmessComponent>,
    private msg: MsgService,
    private jwt: JwtHelperService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    // 获取用户信息
    const userInfo = this.jwt.decodeToken(this.jwt.tokenGetter())
    this.params = {
      Protocol: Vmess, // 固定 vmess 协议
      UID: userInfo.user_id, // 用户 id 

      //  v2fly 官方文档配置说明的推荐默认值
      AlertID: 0,
      Security: "auto",
      Network: "tcp",
      NetSecurity: "none",
    }

    // 修改
    if (this.data.op === 'update') {
      this.params.ID = this.data.value.ID
      this.params.Name = this.data.value.Name
      this.params.Address = this.data.value.Address
      this.params.AlertID = this.data.value.AlertID
      this.params.Domains = this.data.value.Domains
      this.params.Level = this.data.value.Level
      this.params.NetSecurity = this.data.value.NetSecurity
      this.params.Network = this.data.value.Network
      this.params.Path = this.data.value.Path
      this.params.Port = this.data.value.Port
      this.params.Security = this.data.value.Security
      this.params.UserID = this.data.value.UserID
      this.params.Direct = this.data.value.Direct

      this.on = true
    }

    // 增加
    if (this.data.op === 'add') {
      this.on = false
    }
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

  // 保存协议
  save() {
    this.disable = true

    this.protocol.save<any>(this.params).then((value) => {
      // 通知主界面将新增的协议增加到列表里。
      this.params.ID = value.data.id
      this.msg.addProtocol(this.params)
      this.toaster.pop("success", "增加成功")
      this.dialogRef.close()
    }).catch(() => {
      this.toaster.pop("error", "增加失败")
    }).finally(() => {
      this.disable = false
    })
  }

  // 修改协议
  update() {
    this.disable = true

    this.protocol.update(this.params).then(() => {
      this.msg.updateProtocol(this.params)
      this.toaster.pop("success", "修改成功")
      this.dialogRef.close()
    }).catch((e) => {
      this.toaster.pop("error", "修改失败")
    }).finally(() => {
      this.disable = false
    })
  }

  // 国内直连
  direct(evt) {
    this.params.Direct = evt.checked
  }
}
