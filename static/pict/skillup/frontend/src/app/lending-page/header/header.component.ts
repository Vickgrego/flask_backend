import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header-styles/header-styles.scss']
})

export class HeaderComponent implements OnInit {
  showSearchInput: boolean;
  filterString: string = "";
  lastFilter: string = "";
  previousPath: string = "/";
  delayCall;
  showNav: boolean;
  logoMin: boolean;
  btnIcon: string = "search";

  constructor(private router: Router) {
    this.delayCall = (function(){
      var timer: any = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();
  }

  ngOnInit() {
    if (this.router.url.indexOf('search') < 0) {
      this.previousPath = this.router.url;
    } else {
      this.filterString = this.router.url.split(';id=')[1];
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('search') < 0) {
          this.filterString = "";
          this.lastFilter = "";
          this.filterAssets();
          this.previousPath = event.url;
        }
      }
    });

  }

  hideSubMenu() {
    this.showNav = false;
  }

  toggleMenu(): void {
    this.showNav = !this.showNav;
  }

  triggerBtn(ev) {
    this.showNav = ev;
  }

  toggleSearch(): void {
    if (document.body.offsetWidth < 1025) {
      if (this.showSearchInput) {
        this.filterString = "";
      }
      this.showSearchInput = !this.showSearchInput;
      this.btnIcon = this.showSearchInput ? 'close' : 'search';
    }
    this.filterAssets();
  }

  filterAssets() {
    this.delayCall(() => {
      if (this.lastFilter != this.filterString && this.filterString !== '') {
        this.lastFilter = this.filterString;
        this.router.navigate(['/search', {id: this.filterString}]);
      } else if (this.filterString == '') {
        this.router.navigate([this.previousPath]);
      }
    }, 700);
  }

}
