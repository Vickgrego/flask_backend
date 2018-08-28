import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../../models/user'

import { SessionService } from '../../shared/session.service';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private sessionService: SessionService) { }

  login(data: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.post(`/auth`, data)
        .subscribe((res: any) => {
          this.sessionService.session = res;

          resolve();
        });
    });

    return promise;
  }

  resetPasswordEmail(data: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.post(`/users/password/reset`, data)
        .subscribe((res: User) => {
          resolve();
        });
    });

    return promise;
  }

  validateResetCode(data: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.put(`/users/password/reset/validate`, data)
        .subscribe(() => {
          resolve();
        });
    });

    return promise;
  }

  resetPassword(data: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.put(`/users/password/reset`, data)
        .subscribe(() => {
          resolve();
        });
    });

    return promise;
  }

}
