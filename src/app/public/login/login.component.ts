import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // properties
  hide: boolean

  user: string
  passwd: string

  username = new FormControl('', [Validators.required])
  password = new FormControl('', [Validators.required])
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor() { }

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

  // login
  login() {
    // illegal request
    if (isNullOrUndefined(this.user) || isNullOrUndefined(this.passwd)
      || this.user === '' || this.passwd === '') {
      console.log("illegal request")
      return
    }


  }
}
