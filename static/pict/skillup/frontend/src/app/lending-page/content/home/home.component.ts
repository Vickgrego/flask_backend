import { Component, OnInit } from '@angular/core';
import {ContentService} from "../../shared/content.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // galereaImages: Array<any>;
  assets: Array<any> = [];

  constructor(private contentService: ContentService) {
    // this.galereaImages = [];
    // this.galereaImages.push({source:'http://www.angulartypescript.com/wp-content/uploads/2016/03/car1.jpg',title:'BMW 1'});
    // this.galereaImages.push({source:'http://www.angulartypescript.com/wp-content/uploads/2016/03/car2.jpg',title:'BMW 2'});
    // this.galereaImages.push({source:'http://www.angulartypescript.com/wp-content/uploads/2016/03/car3.jpg',title:'BMW 3'});
    // this.galereaImages.push({source:'http://www.angulartypescript.com/wp-content/uploads/2016/03/car4.jpg',title:'BMW 4'});
    // this.galereaImages.push({source:'http://www.angulartypescript.com/wp-content/uploads/2016/03/car5.jpg',title:'BMW 5'});
    // this.galereaImages.push({source:'http://www.angulartypescript.com/wp-content/uploads/2016/03/car6.jpg',title:'BMW 6'});
  }

  ngOnInit() {
    this.assets = this.contentService.featuredAssets;
    this.contentService.getFeaturedAssets();
  }

}
