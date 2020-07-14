import { Component, OnInit } from '@angular/core';
import { Params } from '../v2ray/param';
import { ProtocolService } from '../service/protocol/protocol.service';
import { ToasterService } from 'angular2-toaster';
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
  ) { }

  ngOnInit(): void {
    this.disable = false
    this.enabled = false
    this.params = {}
    this.logs = ''
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
    }).catch((e) => {
      console.log("save error ---> ", e)
    })
  }
}
