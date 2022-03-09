import { Component, OnInit, Inject } from '@angular/core';
import { Params } from '../v2ray/param';
import { ProtocolService } from '../service/protocol/protocol.service';
import { ToasterService } from 'angular2-toaster';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MsgService } from '../service/msg/msg.service';
import { Shadowsocks } from '../service/protocol/api';

@Component({
  selector: 'app-shadowsocks',
  templateUrl: './shadowsocks.component.html',
  styleUrls: ['./shadowsocks.component.css']
})
export class ShadowsocksComponent implements OnInit {
  // 是否禁用按钮
  disable = false
  // 显示密码
  hide = true
  // 启动配置参数
  params: Params


  // 控制增加或者修改的开关，默认增加。
  on: boolean
  constructor(
    private protocol: ProtocolService,
    private toaster: ToasterService,
    private dialogRef: MatDialogRef<ShadowsocksComponent>,
    private msg: MsgService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.params = {
      Protocol: Shadowsocks, // shadowsocks 协议

      Security: "none" // 默认值
    }

    // 修改
    if (this.data.op === "update") {
      this.params.ID = this.data.value.ID
      this.params.Name = this.data.value.Name
      this.params.Address = this.data.value.Address
      this.params.Port = this.data.value.Port
      this.params.Passwd = this.data.value.Passwd
      this.params.Security = this.data.value.Security
      this.params.Direct = this.data.value.Direct

      this.on = true
    }

    // 增加
    if (this.data.op === 'add') {
      this.on = false
    }
  }

  // 增加
  save() {
    this.disable = true

    this.protocol.save<any>(this.params).then((value) => {
      // 通知主界面将新增的协议增加到列表里。
      this.params.ID = value.data.id
      this.params.ConfigFile = value.data.cnf
      this.msg.addProtocol(this.params)
      this.toaster.pop("success", "增加成功")
      this.dialogRef.close()
    }).catch(() => {
      this.toaster.pop("error", "增加失败")
    }).finally(() => {
      this.disable = false
    })
  }

  // 修改
  update() {
    this.disable = true

    this.protocol.update<any>(this.params).then((v) => {
      this.params.ConfigFile = v.data.cnf
      this.msg.updateProtocol(this.params)
      this.toaster.pop("success", "修改成功")
      this.dialogRef.close()
    }).catch((e) => {
      this.toaster.pop("error", "修改失败")
    }).finally(() => {
      this.disable = false
    })
  }

  // 加密方式
  security(evt) {
    this.params.Security = evt.value
  }
  // 国内直连
  direct(evt) {
    this.params.Direct = evt.checked
  }
}
