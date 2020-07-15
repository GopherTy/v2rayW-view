import { Component, OnInit, Inject } from '@angular/core';
import { Params } from '../v2ray/param';
import { ProtocolService } from '../service/protocol/protocol.service';
import { ToasterService } from 'angular2-toaster';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-vmess',
  templateUrl: './vmess.component.html',
  styleUrls: ['./vmess.component.css']
})
export class VmessComponent implements OnInit {
  // 是否禁用按钮
  disable: boolean
  enabled: boolean
  // 启动配置参数
  params: Params
  logs: string
  checked = true
  on = true

  constructor(
    private protocol: ProtocolService,
    private toaster: ToasterService,
    private dialogRef: MatDialogRef<VmessComponent>,
    @Inject(MAT_DIALOG_DATA) public value: any,
  ) { }

  ngOnInit(): void {
    this.disable = false
    this.enabled = false
    this.params = {
      Protocol: "vmess",
      UID: 1,
    }
    this.logs = ''

    if (!isNullOrUndefined(this.value)) {
      this.params.Address = this.value.Address
      this.params.AlertID = this.value.AlertID
      this.params.Domains = this.value.Domains
      this.params.Level = this.value.Level
      this.params.NetSecurity = this.value.NetSecurity
      this.params.NetWork = this.value.NetWork
      this.params.Path = this.value.Path
      this.params.Port = this.value.Port
      this.params.Protocol = this.value.Protocol
      this.params.Security = this.value.Security
      this.params.UID = this.value.UID
      this.params.UserID = this.value.UserID
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

  // 保存协议
  save() {
    this.protocol.save<string>(this.params).then((v) => {
      console.log(v)
      this.toaster.pop("success", "成功", v)
      this.dialogRef.close()
    }).catch((e) => {
      console.log("save error ---> ", e)
    })
  }
}
