import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminUserService } from '../../shared/admin-user.service';

@Component({
  selector: 'app-users',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  user: any = this.userService.user;

  constructor(private router: Router,
              private userService: AdminUserService) {
  }

  ngOnInit() {
  }

  editUser() {
    this.router.navigate(['admin', 'users', 'edit', this.user.id]);
  }

  resetPassword() {
    this.router.navigate(['admin', 'account', 'reset-password']);
    return false;
  }

  isResetPasswordRoute() {
    return this.router.url.indexOf('reset-password') > -1;
  }

}
