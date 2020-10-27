import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params, SubscribeParam } from 'src/app/v2ray/param';
import { Save, Delete, Update, List, Subscribe, Clear, AddSubscribeURL, UpdateSubscribeURL, DeleteSubscribeURL, ListSubscribeURL } from './api';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {

  constructor(
    private http: HttpClient,
  ) { }

  // 保存协议
  save<T>(param: Params) {
    return this.http.post<T>(Save, param).toPromise()
  }

  // 删除协议
  delete<T>(param: any) {
    return this.http.post<T>(Delete, param).toPromise()
  }

  // 修改协议
  update<T>(param: Params) {
    return this.http.post<T>(Update, param).toPromise()
  }

  // 查询协议
  list<T>(param: any) {
    return this.http.post<T>(List, param).toPromise()
  }

  // 订阅协议
  subscribe<T>(param: SubscribeParam) {
    return this.http.post<T>(Subscribe, param).toPromise()
  }
  // 增加订阅地址
  addSubscribeURL<T>(param: SubscribeParam) {
    return this.http.post<T>(AddSubscribeURL, param).toPromise()
  }
  // 修改订阅地址
  updateSubscribeURL<T>(param: SubscribeParam) {
    return this.http.post<T>(UpdateSubscribeURL, param).toPromise()
  }
  // 删除订阅地址
  deleteSubscribeURL<T>(param: SubscribeParam) {
    return this.http.post<T>(DeleteSubscribeURL, param).toPromise()
  }
  // 查询订阅地址
  listSubscribeURL<T>(param: SubscribeParam) {
    return this.http.post<T>(ListSubscribeURL, param).toPromise()
  }


  // 清空协议
  clear<T>(param: any) {
    return this.http.post<T>(Clear, param).toPromise()
  }
}
