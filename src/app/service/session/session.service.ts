import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login, Join, Logout } from './api';
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

  // 如果 token 过期，刷新 token。
  refreshToken<T>(refreshToken: string) {
    return this.httpClient.post<T>(refreshToken, {
      "refresh_token": refreshToken,
    })
  }

  // 登录 
  login<T>(user: string, password: string) {
    return this.httpClient.post<T>(Login, {
      "user": user,
      "password": password,
    }).pipe(tap<any>(res => {
      localStorage.setItem("access_token", res.token.access_token)
      localStorage.setItem("refresh_token", res.token.refresh_token)
    })).toPromise()
  }

  // 登出
  logout<T>() {
    return this.httpClient.get<T>(Logout).toPromise()
  }

  // 注册
  join<T>(username: string, password: string, email: string) {
    return this.httpClient.post<T>(Join, {
      "username": username,
      "password": password,
      "email": email,
    }).toPromise()
  }
}
