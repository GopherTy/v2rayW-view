import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsgService {
  public messageSource = new BehaviorSubject<number>(0);
  public protocolSource = new BehaviorSubject<any>(null);
  public updateProtocolSource = new BehaviorSubject<any>(null);
  public addSubscribeSource = new BehaviorSubject<any>(null);
  public updateSubscribeSource = new BehaviorSubject<any>(null);
  public statusSource = new BehaviorSubject<any>(null);
  public localSettingSource = new BehaviorSubject<any>(null);
  public disableSource = new BehaviorSubject<boolean>(false);

  changemessage(single: number): void {
    this.messageSource.next(single);
  }

  addProtocol(data: any): void {
    this.protocolSource.next(data)
  }

  updateProtocol(data: any): void {
    this.updateProtocolSource.next(data)
  }

  addSubscribeURL(data: any): void {
    this.addSubscribeSource.next(data)
  }

  updateSubscribeURL(data: any): void {
    this.updateSubscribeSource.next(data)
  }

  v2rayStatus(status: any): void {
    this.statusSource.next(status)
  }

  disableButton(b: boolean): void {
    this.disableSource.next(b)
  }

  localSetting(data: any): void {
    this.localSettingSource.next(data)
  }
}
