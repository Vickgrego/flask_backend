import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminUserService } from '../../../shared/admin-user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  errorMessage: string;
  formSubmitted: boolean = false;
  form: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              private userService: AdminUserService) {
    this.buildForm();
  }

  ngOnInit() {
  }

  reset() {
    this.formSubmitted = true;
    if (this.form.pristine || this.form.invalid) {
      return;
    }
    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.errorMessage = 'Your password and confirmation password do not match.';
      return;
    }

    this.clearErrorMessage();
    try {
      let data: any = new Object();
      data.oldPassword = this.form.value.oldPassword;
      data.password = this.form.value.newPassword;
      this.userService.resetPassword(data).then((data: any) => {
        this.router.navigate(['admin', 'account']);
      });
    } finally {
      this.formSubmitted = false;
    }
  }

  cancel() {
    this.router.navigate(['admin', 'account'])
  }

  private clearErrorMessage() {
    if (this.errorMessage) {
      delete this.errorMessage;
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]]
    });
  }

}
