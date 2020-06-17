import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Md5 } from "ts-md5/dist/md5";

import { ToasterService } from 'angular2-toaster';
import { SessionService } from 'src/app/service/session/session.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { BackEndData } from '../data';
import { Router } from '@angular/router';
import { MsgService } from 'src/app/service/msg/msg.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // 属性
  hide: boolean
  disabled: boolean

  username = new FormControl({ value: '', disabled: false }, [Validators.required])
  password = new FormControl({ value: '', disabled: false }, [Validators.required])

  constructor(
    private msg: MsgService,
    private session: SessionService,
    private toasterService: ToasterService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.hide = true
    this.disabled = false
  }

  // validator functions
  // user
  getUserErrorMessage() {
    if (this.username.hasError('required')) {
      return '用户名不能为空'
    }
  }
  // password
  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return '密码不能为空'
    }

    return '密码长度至少为6位'
  }

  // trim all space in string
  trim(str: string) {
    const reg = /\s+/g;
    return str.replace(reg, '')
  }

  // 登录
  login() {
    if (this.username.invalid || this.password.invalid) {
      console.log("parameter invalid")
      return
    }

    // trim space 
    let user = this.username.value as string
    user = this.trim(user)
    let pwd = this.password.value as string
    pwd = this.trim(pwd)
    if (user == '' || pwd == '') {
      console.log('name or password null')
      return
    }

    // 禁用按钮
    this.username.disable()
    this.password.disable()
    this.disabled = true

    let md5Pwd = Md5.hashStr(pwd)
    md5Pwd = md5Pwd as string

    // 发送请求
    this.session.login(user, md5Pwd).then(
      (res: BackEndData) => {
        this.msg.changemessage(1)
        this.toasterService.pop("success", res.data.msg, "欢迎你使用 V2rayWeb")
        this.dialogRef.close()
        this.router.navigateByUrl("v2ray")
      }
    ).catch((error: HttpErrorResponse) => {
      console.log(error)
      const res = error.error as BackEndData
      console.log(res)
      this.toasterService.pop("error", "登录失败", res.desc)
    }).finally(() => {
      this.username.enable()
      this.password.enable()
      this.disabled = false
    })
  }
}
