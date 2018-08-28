import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ValidationMessageComponent } from './validation-message/validation-message.component';
import { TagGroupService } from "./tag-group.service";
import { AuthService } from "./auth.service";
import { TagService } from "./tag.service";
import {AssetsService} from "./assets.service";

@NgModule({
  declarations: [
    ValidationMessageComponent
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    ValidationMessageComponent
  ],
  providers: [
    TagService,
    AssetsService,
    AuthService,
    TagGroupService
  ]
})
export class AdminSharedModule { }
