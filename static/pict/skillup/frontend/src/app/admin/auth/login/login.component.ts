import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  formSubmitted: boolean = false;
  form: FormGroup;

  private redirectUrl: string;
  private sub: any;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
    this.buildForm();
  }

  ngOnInit() {
    this.sub = this.route.queryParamMap.subscribe((params: any) => {
      this.redirectUrl = params.params['url'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  login() {
    this.formSubmitted = true;
    if (this.form.pristine || this.form.invalid) {
      return;
    }

    try {
      let data: any = new Object();
      data.username = this.form.value.userName;
      data.password = this.form.value.password;
      this.authService.login(data).then(() => {
        console.log('this.redirectUrl:', this.redirectUrl);
        this.router.navigate([this.redirectUrl ? this.redirectUrl : 'admin']);
      });
    } catch (er) {
      console.log('error:', er);
    } finally {
      this.formSubmitted = false;
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
    });
  }

}
