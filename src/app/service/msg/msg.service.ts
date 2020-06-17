import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsgService {
  public messageSource = new BehaviorSubject<number>(0);

  changemessage(single: number): void {
    this.messageSource.next(single);
  }
}
