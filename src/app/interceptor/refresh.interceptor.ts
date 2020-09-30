import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { SessionService } from '../service/session/session.service';
import { Router } from '@angular/router';
import { MsgService } from '../service/msg/msg.service';
import { ToasterService } from 'angular2-toaster';

@Injectable()
export class RefreshInterceptor implements HttpInterceptor {

  constructor(
    private session: SessionService,
    private router: Router,
    private msg: MsgService,
    private toaster: ToasterService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err, caught) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 403) {
            this.msg.changemessage(2)
            localStorage.clear()
            this.router.navigateByUrl("")
            return throwError(err);
          }
          if (err.status === 401) {
            this.toaster.pop("warning", "token 已过期请刷新界面，保证数据服务状态正常")
            const refreshToken = localStorage.getItem("refresh_token")
            return this.handleToken(refreshToken).pipe(
              switchMap((v) => {
                const access = v.token.access_token
                localStorage.setItem("access_token", access)
                const req = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${access}`
                  },
                })
                return next.handle(req);
              })
            );
          } else {
            return throwError(err);
          }
        }
        return caught;
      })
    )
  }

  handleToken(refreshToken: string): Observable<any> {
    return this.session.refreshToken<any>(refreshToken)
  }
}
