import { Component, OnInit } from '@angular/core';

import { SpinnerService } from '../shared/spinner.service'

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit() {
  }

  get loading(): boolean {
    return this.spinnerService.loading;
  }

}
