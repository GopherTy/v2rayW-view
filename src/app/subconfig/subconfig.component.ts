import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ProtocolService } from '../service/protocol/protocol.service';
import { ToasterService } from 'angular2-toaster';
import { MsgService } from '../service/msg/msg.service';
import { SubscribeParam } from '../v2ray/param';
import { SubscribeService } from '../service/subscribe/subscribe.service';

@Component({
  selector: 'app-subconfig',
  templateUrl: './subconfig.component.html',
  styleUrls: ['./subconfig.component.css']
})
export class SubconfigComponent implements OnInit {
  // 是否禁用按钮
  disable = false
  // 启动配置参数
  params: SubscribeParam

  // 控制增加或者修改的开关，默认增加。
  on: boolean

  constructor(
    private subService: SubscribeService,
    private toaster: ToasterService,
    private dialogRef: MatDialogRef<SubconfigComponent>,
    private msg: MsgService,
    private jwt: JwtHelperService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    // 获取用户信息
    const userInfo = this.jwt.decodeToken(this.jwt.tokenGetter())
    this.params = {
      UID: userInfo.user_id, // 用户 id 
    }

    // 修改
    if (this.data.op === 'update') {
      this.params.ID = this.data.value.ID
      this.params.Name = this.data.value.Name
      this.params.URL = this.data.value.URL

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

    this.subService.add<any>(this.params).then((value) => {
      this.params.ID = value.data.id
      this.msg.addSubscribeURL(this.params)
      this.toaster.pop("success", "增加成功")
      this.dialogRef.close()
    }).catch((e) => {
      console.log(e)
      this.toaster.pop("error", "增加失败")
    }).finally(() => {
      this.disable = false
    })
  }
  // 修改
  update() {
    this.disable = true

    this.subService.update<any>(this.params).then(() => {
      this.msg.updateSubscribeURL(this.params)
      this.toaster.pop("success", "修改成功")
      this.dialogRef.close()
    }).catch((e) => {
      console.log(e)
      this.toaster.pop("error", "修改失败")
    }).finally(() => {
      this.disable = false
    })
  }
}



