import { Injectable } from '@angular/core';

@Injectable()
export class SpinnerService {
  isLoading: number = 0;

  constructor() { }

  get loading(): boolean {
    return !!this.isLoading;
  }

}
