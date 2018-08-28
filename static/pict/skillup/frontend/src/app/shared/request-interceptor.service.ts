import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { TimeoutError} from 'rxjs/util/TimeoutError';
import { environment } from "../../environments/environment";

import { SessionService } from './session.service';
import { SpinnerService } from './spinner.service'

@Injectable()
export class RequestInterceptorService implements HttpInterceptor {
  private apiUrl: string;

  constructor(private router: Router,
              private spinnerService: SpinnerService,
              private sessionService: SessionService,
              private toastsManager: ToastsManager) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let customHeaders = req.headers;

    if (this.isAuthRequest(req.url)) {
      customHeaders = customHeaders.set('apiKey', 'secret');
      this.apiUrl = environment.apiAdmin;
    } else if (this.isAdminRoute()) {
      customHeaders = customHeaders.set('authorization', `Bearer ${this.sessionService.token}`);
      this.apiUrl = environment.apiAdmin;
    } else {
      this.apiUrl = environment.apiSite;
    }

    const changedReq = req.clone({
      headers: customHeaders,
      url: this.apiUrl + req.url
    });

    if (this.isAuthRequest(req.url) || this.isAdminRoute()) {
      this.spinnerService.isLoading++;
    }
    return next.handle(changedReq)
      .timeout(60000)
      .do((res: any) => {
        if (res instanceof HttpResponse) {
          // hide spinner or other
          if (this.isAuthRequest(req.url) || this.isAdminRoute()) {
            this.spinnerService.isLoading--;
          }
        }

        return res;
      })
      .catch(error => {
        if (error instanceof HttpErrorResponse) {
          if (this.isAuthRequest(req.url) || this.isAdminRoute()) {
            this.spinnerService.isLoading--;
            if (error.status === 401) {
              this.sessionService.clearToken();
              if (error.error && error.error.items) {
                for (let i in error.error.items) {
                  this.toastsManager.error(error.error.items[i].message, error.error.items[i].field);
                }
              } else {
                this.toastsManager.error(error.statusText, 'Error!')
              }
              this.router.navigate(['auth', 'login']);
            } else if (error.status === 422 && error.error && error.error.items) {
              for (let i in error.error.items) {
                this.toastsManager.error(error.error.items[i].message, error.error.items[i].field);
              }
            } else {
              this.toastsManager.error(error.statusText, 'Error!')
            }
          }
        } else if (error instanceof TimeoutError) {
          this.spinnerService.isLoading--;
          this.toastsManager.error(error.message, 'Error!')
        } else {
          this.spinnerService.isLoading--;
          this.toastsManager.error('Unknown Error', 'Error!')
        }

        return Observable.throw(error);
      });
  }

  private isAuthRequest(url) {
    const routerUrl = this.router.url;
    return url.indexOf('auth') !== -1 || routerUrl.indexOf('auth') !== -1;
  }

  private isAdminRoute() {
    const routerUrl = this.router.url;
    return routerUrl.indexOf('admin') !== -1 ;
  }

}
