import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private helper: JwtHelperService
  ) { }

  // 拦截请求中未过期 token 请求，增加上 token 信息。
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const access = this.helper.tokenGetter()
    if (access) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${access}`
        },
      })
    }
    return next.handle(request);
  }
}
