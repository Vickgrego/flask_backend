import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss']
})
export class ValidationMessageComponent implements OnInit {


  @Input()
  private submitted: boolean;

  @Input()
  private control: FormControl;

  constructor() { }

  ngOnInit() {
  }

  get hasMessage(): boolean {
    let res: boolean = false;

    if (this.control) {
      res = this.submitted && this.control.invalid ||
        !this.submitted && this.control.touched && this.control.invalid;
    }

    return res;
  }

  get messages(): Array<string> {
    let res: Array<string> = new Array();

    if (!this.control || !this.control.errors) {
      return res;
    }
    if (this.control.errors.required) {
      res.push('is required');
    }
    if (this.control.errors.minlength) {
      res.push('too short');
    }
    if (this.control.errors.maxlength) {
      res.push('too long');
    }
    if (this.control.errors.email) {
      res.push('invalid e-mail');
    }

    return res;
  }

}
