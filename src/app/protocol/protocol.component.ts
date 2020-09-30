import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isNullOrUndefined, isNull } from 'util';
import { ProtocolService } from '../service/protocol/protocol.service';
import { MatDialog } from '@angular/material/dialog';
import { VmessComponent } from '../vmess/vmess.component';
import { V2rayService } from '../service/v2ray/v2ray.service';
import { BackEndData } from '../public/data';
import { ToasterService } from 'angular2-toaster';
import { HttpErrorResponse } from '@angular/common/http';
import { MsgService } from '../service/msg/msg.service';
import { VlessComponent } from '../vless/vless.component';

@Component({
  selector: 'app-protocol',
  templateUrl: './protocol.component.html',
  styleUrls: ['./protocol.component.css']
})
export class ProtocolComponent implements OnInit {
  power = false // v2ray 启动状态 
  disable: boolean // 按钮状态

  data: any // 协议数据内容
  @Input()
  set value(data: any) {
    if (isNullOrUndefined(data)) {
      return
    }
    this.data = data
  }

  @Output('clickEvt')
  click = new EventEmitter<any>() // 导出属性

  constructor(
    private protocol: ProtocolService,
    private toaster: ToasterService,
    private v2ray: V2rayService,
    private dialog: MatDialog,
    private msg: MsgService,
  ) { }

  ngOnInit(): void {
    // 禁用按钮状态
    this.msg.disableSource.subscribe((b) => {
      this.disable = b
    })

    // v2ray服务器启动状态
    this.msg.statusSource.subscribe((v) => {
      if (v) {
        const status = JSON.parse(v)
        // 运行状态
        if (this.data.ID === status.id && this.data.Protocol == this.data.Protocol) {
          this.power = status.running
        } else {
          this.power = false
        }
      }
    })
  }

  // 删除配置
  remove(data: any) {
    this.disable = true

    this.protocol.delete<any>({
      "name": data.Protocol,
      "id": data.ID,
    }).then(() => {
      this.toaster.pop("success", "删除成功")
      this.click.emit(this.data)
    }).catch(() => {
      this.toaster.pop("error", "删除失败")
    }).finally(() => {
      this.disable = false
    })
  }

  // 打开窗口
  openProtocolWindow(v: any) {
    switch (v.Protocol) {
      case "vmess":
        this.dialog.open(VmessComponent, {
          width: "45%",
          data: {
            "op": "update",
            "value": v,
          }
        })
        break;
      case "vless":
        this.dialog.open(VlessComponent, {
          width: "45%",
          data: {
            "op": "update",
            "value": v,
          }
        })
        break;
      default:
        break;
    }

  }

  // 控制 v2ray 的开启和关闭
  switch() {
    if (this.power) {
      this.stop()
    } else {
      this.start()
    }
  }

  // 开启
  start() {
    this.msg.disableButton(true)
    // 启动
    this.v2ray.start<BackEndData>(this.data).then((res) => {
      this.toaster.pop("success", "启动成功", res.data.msg)
      this.power = true
    }).catch((e: HttpErrorResponse) => {
      // 不是刷新 token 的错误，弹出错误内容。
      if (e.status == 403) {
        this.toaster.pop("warning", "长时间未操作请重新登录")
      } else {
        this.toaster.pop("error", "启动失败", e.error.error)
      }
    }).finally(() => {
      this.msg.disableButton(false)
    })
  }

  // 关闭
  stop() {
    this.msg.disableButton(true)

    this.v2ray.stop<BackEndData>().then((res) => {
      this.power = false
      this.toaster.pop("success", "关闭成功", res.data.msg)
    }).catch((e: HttpErrorResponse) => {
      // 不是刷新 token 的错误，弹出错误内容。
      if (e.status == 403) {
        this.toaster.pop("warning", "长时间未操作请重新登录")
      } else {
        this.toaster.pop("error", "关闭失败", e.error.error)
      }
    }).finally(() => {
      this.msg.disableButton(false)
    })
  }
}
