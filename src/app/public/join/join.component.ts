import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { isNullOrUndefined } from 'util';
import { Md5 } from "ts-md5/dist/md5";

import { ToasterService } from 'angular2-toaster';
import { SessionService } from 'src/app/service/session/session.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { BackEndData } from '../data';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  // 属性
  hide: boolean
  disabled: boolean

  username = new FormControl('', [Validators.required])
  password = new FormControl('', [Validators.required])
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private session: SessionService,
    private toasterService: ToasterService,
    private dialogRef: MatDialogRef<JoinComponent>
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
  // email
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return '邮箱不能为空';
    }

    return this.email.hasError('email') ? '邮箱地址格式不正确' : '';
  }

  // trim all space in string
  trim(str: string) {
    const reg = /\s+/g;
    return str.replace(reg, '')
  }

  // 登录
  join() {
    if (this.username.invalid || this.password.invalid || this.email.invalid) {
      console.log("parameter invalid")
      return
    }

    // trim space 
    let user = this.username.value as string
    user = this.trim(user)
    let pwd = this.password.value as string
    pwd = this.trim(pwd)
    let email = this.email.value as string
    email = this.trim(email)
    if (user === '' || pwd === '' || email === '') {
      console.log('name or password or email null')
      return
    }

    // 禁用按钮
    this.username.disable()
    this.password.disable()
    this.email.disable()
    this.disabled = true

    let md5Pwd = Md5.hashStr(pwd)
    md5Pwd = md5Pwd as string

    // 发送请求
    this.session.join<BackEndData>(user, md5Pwd, email).then(
      (res) => {
        console.log(res.data.msg)
        this.toasterService.pop("success", "注册成功", "请登录系统")
        this.dialogRef.close()
      }
    ).catch((error: HttpErrorResponse) => {
      const res = error.error as BackEndData
      console.log(res)
      this.toasterService.pop("error", "注册失败", "系统错误，请重新注册")
    }).finally(() => {
      this.username.enable()
      this.password.enable()
      this.email.enable()
      this.disabled = false
    })
  }
}
