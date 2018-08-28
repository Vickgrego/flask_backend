import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './auth-reset-password-email.component.html',
  styleUrls: ['./auth-reset-password-email.component.scss']
})
export class AuthResetPasswordEmailComponent implements OnInit, OnDestroy {
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
    this.sub = this.route.params.subscribe(params => {
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

    this.clearErrorMessage();
    try {
      let data: any = new Object();
      data.email = this.form.value.email;
      this.authService.resetPasswordEmail(data).then(() => {
        this.router.navigate(['auth', 'reset-password-message']);
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
      email: ['', [Validators.required, Validators.email]]
    });
  }

}
