import { Component, OnInit } from '@angular/core';
import { V2rayService } from '../service/v2ray/v2ray.service';
import { ToasterService } from 'angular2-toaster';
import { BackEndData } from '../public/data';
import { HttpErrorResponse } from '@angular/common/http';
import { Params } from './param';
import { MsgService } from '../service/msg/msg.service';

@Component({
  selector: 'app-v2ray',
  templateUrl: './v2ray.component.html',
  styleUrls: ['./v2ray.component.css']
})
export class V2rayComponent implements OnInit {
  // 是否禁用按钮
  disable: boolean
  enabled: boolean
  // 启动配置参数
  params: Params


  constructor(
    private v2ray: V2rayService,
    private toaster: ToasterService,
    private msg: MsgService,
  ) { }

  ngOnInit(): void {
    this.disable = false
    this.enabled = false
    this.params = {}

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

  // 启动
  start() {
    if (this.enabled) {
      this.disable = true
      return
    }
    this.disable = true

    this.v2ray.start<BackEndData>(this.params).then((res) => {
      this.toaster.pop("success", "启动成功", res.data.msg)
      this.enabled = true
    }).catch((err: HttpErrorResponse) => {
      console.log(err)
      if (err.status === 401) {
        this.msg.changemessage(2)
        localStorage.clear()
      }
      this.toaster.pop("error", "启动失败", err.message)
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
      console.log(res)
      this.enabled = false
      this.toaster.pop("success", "关闭成功", res.data.msg)
    }).catch((e) => {
      if (e.status === 401) {
        this.msg.changemessage(2)
        localStorage.clear()
      }
      console.log(e)
      this.toaster.pop("error", "关闭失败", e)
    }).finally(() => {
      this.disable = false
    })
  }
}
