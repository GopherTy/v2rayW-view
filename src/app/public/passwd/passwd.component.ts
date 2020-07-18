import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SessionService } from 'src/app/service/session/session.service';
import { BackEndData } from '../data';
import { ToasterService } from 'angular2-toaster';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Md5 } from 'ts-md5';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-passwd',
  templateUrl: './passwd.component.html',
  styleUrls: ['./passwd.component.css']
})
export class PasswdComponent implements OnInit {
  // 属性
  hide: boolean
  disabled: boolean

  // 用户id 
  uid: number
  password = new FormControl('', [Validators.required])

  constructor(
    private session: SessionService,
    private toasterService: ToasterService,
    private helper: JwtHelperService,
    private dialogRef: MatDialogRef<PasswdComponent>
  ) { }

  // password
  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return '密码不能为空'
    }

    return '密码长度至少为6位'
  }


  ngOnInit(): void {
    this.hide = true
    this.disabled = false

    const userInfo = this.helper.decodeToken(this.helper.tokenGetter())
    this.uid = userInfo.user_id
    console.log(this.uid)
  }

  // trim all space in string
  trim(str: string) {
    const reg = /\s+/g;
    return str.replace(reg, '')
  }

  // 修改密码
  passwd() {
    if (this.password.invalid) {
      console.log("parameter invalid")
      return
    }

    let pwd = this.password.value as string
    pwd = this.trim(pwd)

    if (pwd === '') {
      console.log('password  null')
      return
    }

    // 禁用按钮
    this.password.disable()
    this.disabled = true


    let md5Pwd = Md5.hashStr(pwd)
    md5Pwd = md5Pwd as string

    this.session.password<BackEndData>(this.uid, md5Pwd).then(() => {
      this.toasterService.pop("success", "修改成功")
      this.dialogRef.close()
    }).catch((e: HttpErrorResponse) => {
      // 不是刷新 token 的错误，弹出错误内容。
      if (e.status == 403) {
        this.toasterService.pop("warning", "长时间未操作请重新登录")
      } else {
        this.toasterService.pop("error", "修改失败", e.error.error)
      }
    }).finally(() => {
      this.password.enable()
      this.disabled = false
    })
  }
}
