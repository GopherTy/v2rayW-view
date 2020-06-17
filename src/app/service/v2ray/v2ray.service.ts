import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Start, Stop } from './api';
@Injectable({
  providedIn: 'root'
})
export class V2rayService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  // 启动 v2ray
  start<T>() {
    return this.httpClient.get<T>(Start).toPromise()
  }

  // 关闭 v2ray
  stop<T>() {
    return this.httpClient.get<T>(Stop).toPromise()
  }
}
