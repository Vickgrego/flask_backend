import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.scss']
})
export class AuthResetPasswordComponent implements OnInit, OnDestroy {
  errorMessage: string;
  formSubmitted: boolean = false;
  form: FormGroup;

  private sub: any;
  private resetCode: string;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
    this.buildForm();
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.resetCode = params['resetCode'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
      data.resetCode = this.resetCode;
      this.authService.validateResetCode(data).then(() => {
        data.newPassword = this.form.value.newPassword;
        this.authService.resetPassword(data).then(() => {
          this.router.navigate(['auth', 'login']);
        });
      });
    } finally {
      this.formSubmitted = false;
    }
  }

  private clearErrorMessage() {
    if (this.errorMessage) {
      delete this.errorMessage;
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
  }

}
