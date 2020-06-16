import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { login, join, logout } from './api';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private httpClient: HttpClient) { }

  // 是否已经登录
  public get loggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  // 登录 
  login<T>(user: string, password: string) {
    return this.httpClient.post<T>(login, {
      "user": user,
      "password": password,
    }).pipe(tap<any>(res => {
      localStorage.setItem("access_token", res.token.access_token)
    })).toPromise()
  }

  // 登出
  logout<T>() {
    return this.httpClient.get<T>(logout).toPromise()
  }

  // 注册
  join<T>(username: string, password: string, email: string) {
    return this.httpClient.post<T>(join, {
      "username": username,
      "password": password,
      "email": email,
    }).toPromise()
  }
}
