import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { login, join } from './api';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private httpClient: HttpClient) { }

  // 登录 
  login<T>(user: string, password: string) {
    return this.httpClient.post<T>(login, {
      "user": user,
      "password": password,
    }).toPromise()
  }

  // 注册
  join<T>(user: string, password: string, email: string) {
    return this.httpClient.post<T>(join, {
      "user": user,
      "password": password,
      "email": email,
    }).toPromise()
  }
}
