import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DialogModule } from 'primeng/primeng';
import { NgxGalleryModule } from 'ngx-gallery';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { LendingPageComponent } from './lending-page/lending-page.component';
import { HeaderComponent } from './lending-page/header/header.component';
import { FooterComponent } from './lending-page/footer/footer.component';
import { NavigatorComponent } from './lending-page/header/navigator/navigator.component';
import { ContentComponent } from './lending-page/content/content.component';
import { HomeComponent } from './lending-page/content/home/home.component';
import { AssetsComponent } from './lending-page/content/assets/assets.component';
import { RequestInterceptorService } from './shared/request-interceptor.service';
import { AssetCardComponent } from './lending-page/content/asset-card/asset-card.component';
import { CarouselComponent } from './lending-page/content/home/carousel/carousel.component'
import { ContentService } from "./lending-page/shared/content.service";
import { SharedModule } from "./shared/shared.module";
import { GroupedAssetsComponent } from "./lending-page/content/grouped-assets/grouped-assets.component";
import { NavigationItemService } from "./shared/navigation-item.service";
import { SessionService } from "./shared/session.service";
import { AuthGuardService } from "./shared/auth-guard.service";
import { SpinnerService } from "./shared/spinner.service";
import { SearchAssetsComponent } from "./lending-page/content/assets-search/assets-search.component";
import { SpinnerComponent } from './spinner/spinner.component'


@NgModule({
  declarations: [
    AppComponent,
    LendingPageComponent,
    HeaderComponent,
    FooterComponent,
    NavigatorComponent,
    ContentComponent,
    HomeComponent,
    AssetsComponent,
    SearchAssetsComponent,
    GroupedAssetsComponent,
    AssetCardComponent,
    CarouselComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    DialogModule,
    NgxGalleryModule,
    ToastModule.forRoot(),
    routing
  ],
  providers: [
    AuthGuardService,
    ContentService,
    SessionService,
    NavigationItemService,
    SpinnerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
