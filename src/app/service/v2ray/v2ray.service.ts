import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Start, Stop } from './api';
import { Params } from 'src/app/v2ray/param';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RefreshToken } from '../session/api';
@Injectable({
  providedIn: 'root'
})
export class V2rayService {

  constructor(
    private httpClient: HttpClient,
    private helper: JwtHelperService
  ) { }

  // 启动 v2ray
  async start<T>(param: Params) {
    // 判断 token 是否过期，如果已经过期，用 refresh_token 去获取新的 token 
    if (this.helper.isTokenExpired()) {
      const refreshToken = localStorage.getItem("refresh_token")
      console.log("refresh token", refreshToken)
      const token = await this.httpClient.post<string>(RefreshToken, {
        "refresh_token": refreshToken,
      }).toPromise()
      localStorage.setItem("access_token", token)
    }
    return this.httpClient.post<T>(Start, param).toPromise()
  }

  // 关闭 v2ray
  stop<T>() {
    // 判断 token 是否过期，如果已经过期，用 refresh_token 去获取新的 token 
    if (this.helper.isTokenExpired(this.helper.tokenGetter())) {
      const refreshToken = localStorage.getItem("refresh_token")
      console.log("refresh token", refreshToken)
    }
    return this.httpClient.get<T>(Stop).toPromise()
  }
}
