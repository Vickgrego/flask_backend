import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminUserService } from '../../../shared/admin-user.service';
import { User } from '../../../../../models/user';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})

export class UsersTableComponent implements OnInit {
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: string;
  totalCount: number = 0;
  users: Array<User>;

  constructor(private userService: AdminUserService,
              private router: Router) {
    this.loadUsers();
  }

  ngOnInit() {
  }

  onPage(event) {
    this.pageSize = event.rows;
    this.pageNumber = (event.first / event.rows) + 1;
    this.loadUsers();
  }

  editUser(event) {
    this.router.navigate(['admin', 'users', 'edit', event.data.id]);
    return false;
  }

  // editUser(user) {
  //   this.router.navigate(['admin', 'users', 'edit', user.id]);
  //   return false;
  // }

  private loadUsers() {
    this.userService.getUsers(this.pageNumber, this.pageSize, this.searchString).then((data: any) => {
      this.totalCount = data.totalCount;
      this.users = data.items;
    });
  }

}
