import { Component, OnInit } from '@angular/core';
import { V2rayService } from '../service/v2ray/v2ray.service';
import { ToasterService } from 'angular2-toaster';
import { BackEndData } from '../public/data';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-v2ray',
  templateUrl: './v2ray.component.html',
  styleUrls: ['./v2ray.component.css']
})
export class V2rayComponent implements OnInit {
  // 是否禁用按钮
  disable: boolean
  enabled: boolean

  constructor(
    private v2ray: V2rayService,
    private toaster: ToasterService,
  ) { }

  ngOnInit(): void {
    this.disable = false
    this.enabled = false
  }

  start() {
    this.disable = true

    this.v2ray.start<string>().then((res) => {
      console.log(res)
      this.toaster.pop("success", "启动成功", res)
      this.enabled = true
    }).catch((e) => {
      console.log(e)
      this.toaster.pop("error", "启动失败", e.error)
    }).finally(() => {
      this.disable = false
    })
  }

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
      console.log(e)
      this.toaster.pop("error", "关闭失败", e)
    }).finally(() => {
      this.disable = false
    })
  }
}
