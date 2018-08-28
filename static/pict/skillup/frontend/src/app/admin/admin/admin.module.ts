import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { CommonModule } from '@angular/common';
import { DialogModule, DataTableModule, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { SharedModule } from '../../shared/shared.module';
import { AdminComponent } from './admin.component';
import { routing } from './admin.routes';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminContentComponent } from './admin-content/admin-content.component';
import { UsersComponent } from './admin-content/users/users.component'
import { UsersTableComponent } from './admin-content/users/users-table/users-table.component'
import { AccountComponent } from './admin-content/account/account.component';
import { TagsComponent } from './admin-content/tags/tags.component';
import { AssetsComponent } from './admin-content/assets/assets.component';
import { AdminTagService } from './shared/admin-tag.service';
import { AdminTagGroupService } from './shared/admin-tag-group.service';
import { AdminUserService } from './shared/admin-user.service';
import { AdminSharedModule } from '../shared/admin-shared.module';
import { ResetPasswordComponent } from './admin-content/account/reset-password/reset-password.component';
import { UsersEditComponent } from './admin-content/users/users-edit/users-edit.component';
import { UsersAddComponent } from './admin-content/users/users-add/users-add.component';
import { AdminMenuPanelComponent } from './admin-menu-panel/admin-menu-panel.component';
import { NavigationComponent } from './admin-content/navigation/navigation.component';
import { AdminNavigationItemService } from './shared/admin-navigation-item.service';
import { NavigationEditComponent } from './admin-content/navigation/navigation-edit/navigation-edit.component';
import { NavigationAddComponent } from './admin-content/navigation/navigation-add/navigation-add.component';
import { TagGroupComponent } from './admin-content/tag-group/tag-group.component';
import { TagGroupAddComponent } from './admin-content/tag-group/tag-group-add/tag-group-add.component';
import { TagGroupEditComponent } from './admin-content/tag-group/tag-group-edit/tag-group-edit.component';
import { ListBoxComponent } from './shared/list-box/list-box.component';
import { FilterNamePipe } from "./admin-content/assets/filterName.pipe";
import { TagEditComponent } from './admin-content/tags/tag-edit/tag-edit.component';
import { TagAddComponent } from './admin-content/tags/tag-add/tag-add.component';
import { AssetFormComponent } from "./admin-content/assets/asset-form/asset-form.component";

@NgModule({
  declarations: [
    AdminComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminContentComponent,
    UsersComponent,
    UsersTableComponent,
    AccountComponent,
    TagsComponent,
    AssetsComponent,
    AssetFormComponent,
    ResetPasswordComponent,
    UsersEditComponent,
    UsersAddComponent,
    AdminMenuPanelComponent,
    NavigationComponent,
    NavigationEditComponent,
    NavigationAddComponent,
    TagGroupComponent,
    TagGroupAddComponent,
    TagGroupEditComponent,
    ListBoxComponent,
    FilterNamePipe,
    TagEditComponent,
    TagAddComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TreeModule,
    CommonModule,
    DialogModule,
    DataTableModule,
    ConfirmDialogModule,
    routing,
    SharedModule,
    AdminSharedModule
  ],
  providers: [
    ConfirmationService,
    AdminTagService,
    AdminTagGroupService,
    AdminUserService,
    AdminNavigationItemService
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
