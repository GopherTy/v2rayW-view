import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { isNullOrUndefined } from 'util';
import { Md5 } from "ts-md5/dist/md5";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // properties
  hide: boolean

  username = new FormControl('', [Validators.required])
  password = new FormControl('', [Validators.required])
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.hide = true
  }

  // validator functions
  // user
  getUserErrorMessage() {
    if (this.username.hasError('required')) {
      return 'You must enter a value'
    }
  }
  // password
  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'You must enter a value'
    }

    return 'Make sure password at least 6 characters'
  }
  // email
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // trim all space in string
  trim(str: string) {
    const reg = /\s+/g;
    return str.replace(reg, '')
  }

  // login
  login() {
    // illegal request
    if (isNullOrUndefined(this.username.value) || isNullOrUndefined(this.password.value)) {
      console.log("illegal request")
      return
    }

    // trim space 
    let user = this.username.value as string
    user = this.trim(user)
    let pwd = this.password.value as string
    pwd = this.trim(pwd)
    if (user == '' || pwd == '') {
      console.log('name password null')
      return
    }

    const md5Pwd = Md5.hashStr(pwd)

    // request
    this.httpClient.post('user/login', {
      "user": user,
      "password": md5Pwd,
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }),
    }
    ).toPromise().then((v) => {
      console.log(v)
    }).catch((e) => {
      console.log(e)
    })
  }
}
