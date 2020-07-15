import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Params } from '../v2ray/param';
import { isNullOrUndefined } from 'util';
import { ProtocolService } from '../service/protocol/protocol.service';
import { MatDialog } from '@angular/material/dialog';
import { VmessComponent } from '../vmess/vmess.component';

@Component({
  selector: 'app-protocol',
  templateUrl: './protocol.component.html',
  styleUrls: ['./protocol.component.css']
})
export class ProtocolComponent implements OnInit {
  data: any
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
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  // 删除配置
  remove(id: number) {
    this.protocol.delete<any>({
      "name": "vmess",
      "id": id,
    }).then((v) => {
      console.log("success", v)
      this.click.emit(this.data)
    }).catch((e) => {
      console.log("error", e)
    })
  }

  // 打开窗口
  openVmessWindow(v: any) {
    this.dialog.open(VmessComponent, {
      width: "45%",
      data: v,
    })
  }
}
