import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsgService {
  public messageSource = new BehaviorSubject<number>(0);
  public protocolSource = new BehaviorSubject<any>(null);

  changemessage(single: number): void {
    this.messageSource.next(single);
  }

  addProtocol(data: any): void {
    this.protocolSource.next(data)
  }
}
