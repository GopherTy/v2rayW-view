import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pull, Add, Delete, List, Update } from './api';
import { SubscribeParam } from 'src/app/v2ray/param';

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {

  constructor(
    private http: HttpClient,
  ) { }

  // 订阅协议
  subscribe<T>(param: SubscribeParam) {
    return this.http.post<T>(Pull, param).toPromise()
  }
  // 增加订阅地址
  add<T>(param: SubscribeParam) {
    return this.http.post<T>(Add, param).toPromise()
  }
  // 修改订阅地址
  update<T>(param: SubscribeParam) {
    return this.http.post<T>(Update, param).toPromise()
  }
  // 删除订阅地址
  delete<T>(param: SubscribeParam) {
    return this.http.post<T>(Delete, param).toPromise()
  }
  // 查询订阅地址
  list<T>(param: SubscribeParam) {
    return this.http.post<T>(List, param).toPromise()
  }
}
