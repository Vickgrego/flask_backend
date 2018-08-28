import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { User } from '../../../models/user'
import { Session } from '../../../models/session'
import { SessionService } from '../../../shared/session.service'

@Injectable()
export class AdminUserService {
  private users: Array<User>;

  constructor(private http: HttpClient, private sessionService: SessionService) { }

  get user(): User {
    if (!this.sessionService.user) {
      this.sessionService.user = new User();

      this.http.get(`/users/current`)
        .subscribe((res: User) => {
          this.sessionService.user.id = res.id;
          this.sessionService.user.userName = res.userName;
          this.sessionService.user.firstName = res.firstName;
          this.sessionService.user.lastName = res.lastName;
          this.sessionService.user.email = res.email;
        });
    }
    return this.sessionService.user;
  }

  getUsers(pageNumber: number, pageSize: number, searchString?: string) {
    let promise = new Promise((resolve, reject) => {
      let params: HttpParams = new HttpParams()
        .set('itemsPerPage', `${pageSize}`)
        .set('pageNumber', `${pageNumber}`);

      if (searchString) {
        params.set('searchString', searchString);
      }

      this.http.get(`/Users`, {params: params})
        .subscribe((res: any) => {
          this.users = res.items;
          resolve(res);
        });
    });

    return promise;
  }

  getUserById(id: number): User {
    let res: User;

    if (this.user.id == id) {
      res = this.user;
    } else if (this.users) {
      res = this.users.filter(e => {return e.id == id;})[0];
    }

    return res;
  }

  addUser(data: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.post(`/Users`, data)
        .subscribe((res: any) => {
          resolve();
        });
    });

    return promise;
  }

  editUser(data: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.put(`/Users/${data.id}`, data)
        .subscribe((res: User) => {
          let user: User = this.getUserById(res.id);

          user.firstName = res.firstName;
          user.lastName = res.lastName;
          user.email = res.email;

          resolve();
        });
    });

    return promise;
  }

  resetPassword(data: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.put(`/users/password`, data)
        .subscribe((res: Session) => {
          this.sessionService.session = res;
          resolve();
        });
    });

    return promise;
  }

}
