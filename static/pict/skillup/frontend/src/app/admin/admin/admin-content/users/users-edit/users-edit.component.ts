import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminUserService } from '../../../shared/admin-user.service';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit, OnDestroy {
  formSubmitted: boolean = false;
  form: FormGroup;
  user: any;

  private sub: any;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private userService: AdminUserService) {
    this.buildForm();
  }


  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.user = this.userService.getUserById(params['id']);
        if (this.user) {
          this.form.controls.firstName.setValue(this.user.firstName);
          this.form.controls.lastName.setValue(this.user.lastName);
          this.form.controls.email.setValue(this.user.email);
        } else {
          this.router.navigate(['admin', 'users']);
        }
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    this.formSubmitted = true;
    if (this.form.pristine || this.form.invalid) {
      return;
    }

    try {
      let data: any = new Object();
      data.id = this.user.id;
      data.firstName = this.form.value.firstName;
      data.lastName = this.form.value.lastName;
      data.email = this.form.value.email;
      this.userService.editUser(data).then(() => {
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
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

}
