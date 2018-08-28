import { Injectable } from '@angular/core';

import { Session } from '../models/session'
import { User } from '../models/user'

@Injectable()
export class SessionService {
  private currentUser: User;
  private _session: Session = new Session();

  constructor() {
    this._session['access_token'] = localStorage.getItem('access_token');
  }

  set session(data: Session) {
    this._session = data;
    this.token = data['access_token'];
  }

  set token(token: string) {
    this.currentUser = undefined;
    localStorage.setItem('access_token', token);
  }

  get token(): string {
    return this._session['access_token'];
  }

  set user(user: User) {
    this.currentUser = user;
  }

  get user(): User {
    return this.currentUser;
  }

  clearToken() {
    this._session['access_token'] = undefined;
    this.currentUser = undefined;
    localStorage.removeItem('access_token');
  }

}
