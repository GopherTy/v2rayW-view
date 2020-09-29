import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Start, Stop, Settings, ListSettings } from './api';
import { Params, SocksParam } from 'src/app/v2ray/param';

@Injectable({
  providedIn: 'root'
})
export class V2rayService {

  constructor(
    private httpClient: HttpClient
  ) { }

  // 启动 v2ray
  async start<T>(param: Params) {
    return this.httpClient.post<T>(Start, param).toPromise()
  }

  // 关闭 v2ray
  stop<T>() {
    return this.httpClient.get<T>(Stop).toPromise()
  }

  // 参数设置
  settings<T>(param: SocksParam) {
    return this.httpClient.post<T>(Settings, param).toPromise()
  }

  // 获取参数配置
  listSettings<T>() {
    return this.httpClient.get<T>(ListSettings).toPromise()
  }
}
