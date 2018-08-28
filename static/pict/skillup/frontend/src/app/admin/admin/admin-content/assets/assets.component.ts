import { Component, OnInit, OnDestroy } from '@angular/core';
import { AssetsService } from "../../../shared/assets.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})

export class AssetsComponent implements OnInit, OnDestroy {

  fileTypes: any = [{"id":"File","name":"File"},{"id":"URL","name":"URL"}];
  filter: any = {
    searchString: null,
    hasFiles: null,
    isFeatured: null,
    isActive: null,
    assetType: null,
    pageNumber: 1,
    itemsPerPage: 10
  };
  assets: Array<any> = [];
  assetsSub: any;
  delayCall: any;
  totalCount: number;

  constructor(private router: Router,
              private assetsService: AssetsService) {
    this.delayCall = (function(){
      var timer: any = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();
  }

  ngOnInit() {
    this.assetsSub = this.assetsService.assets.subscribe((resp: any) => {
      this.assets = resp.items;
      this.totalCount = resp.totalCount;
    });
  }

  ngOnDestroy() {
    this.assetsSub.unsubscribe();
  }

  onPage(event) {
    this.filter.itemsPerPage = event.rows;
    this.filter.pageNumber = (event.first / event.rows) + 1;
    this.assetsService.getAssets(this.filter);
  }

  onFilterChange(event) {
    this.delayCall(() => {
      this.assetsService.getAssets(this.filter);
    }, 700);
  }

  addAsset() {
    this.router.navigate(['admin/assets/add'])
  }

  editAsset(ev) {
    this.router.navigate(['admin/assets/edit/' + ev.data.id ])
  }

}
