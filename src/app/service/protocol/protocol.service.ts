import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params } from 'src/app/v2ray/param';
import { Save, Delete, Update, List } from './api';

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
}
