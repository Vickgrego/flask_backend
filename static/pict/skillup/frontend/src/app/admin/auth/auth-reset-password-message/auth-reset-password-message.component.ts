import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-reset-password-message',
  templateUrl: './auth-reset-password-message.component.html',
  styleUrls: ['./auth-reset-password-message.component.scss']
})
export class AuthResetPasswordMessageComponent {

  constructor(private router: Router) {
  }

}
