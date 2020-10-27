import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubconfigComponent } from '../subconfig/subconfig.component';
import { ProtocolService } from '../service/protocol/protocol.service';
import { ToasterService } from 'angular2-toaster';
import { MsgService } from '../service/msg/msg.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {
  disable: boolean // 按钮状态

  data: any // 订阅数据
  @Input()
  set value(data: any) {
    if (!data) {
      return
    }
    this.data = data
  }
  @Output('clickEvt')
  click = new EventEmitter<any>() // 导出属性

  constructor(
    private protocol: ProtocolService,
    private toaster: ToasterService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

  }

  // 打开窗口
  openSubconfigWindow(v: any) {
    this.dialog.open(SubconfigComponent, {
      width: "45%",
      data: {
        "op": "update",
        "value": v,
      }
    })
  }
  // 删除配置
  remove(data: any) {
    this.disable = true

    this.protocol.deleteSubscribeURL<any>({
      ID: data.ID,
    }).then(() => {
      this.toaster.pop("success", "删除成功")
      this.click.emit(this.data)
    }).catch(() => {
      this.toaster.pop("error", "删除失败")
    }).finally(() => {
      this.disable = false
    })
  }

}
