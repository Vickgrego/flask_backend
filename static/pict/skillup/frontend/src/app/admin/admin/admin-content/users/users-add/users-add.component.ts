import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AdminUserService } from '../../../shared/admin-user.service';

@Component({
  selector: 'app-users-add',
  templateUrl: './users-add.component.html',
  styleUrls: ['./users-add.component.scss']
})
export class UsersAddComponent implements OnInit {
  formSubmitted: boolean = false;
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private location: Location,
              private userService: AdminUserService) {
    this.buildForm();
  }

  ngOnInit() {
  }

  save() {
    this.formSubmitted = true;
    if (this.form.pristine || this.form.invalid) {
      return;
    }

    try {
      let data: any = new Object();
      data.userName = this.form.value.userName;
      data.firstName = this.form.value.firstName;
      data.lastName = this.form.value.lastName;
      data.email = this.form.value.email;
      data.password = this.form.value.password;
      this.userService.addUser(data).then(() => {
        this.location.back();
      });
    } finally {
      this.formSubmitted = false;
    }
  }

  cancel() {
    this.location.back();
  }

  private buildForm() {
    this.form = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

}
