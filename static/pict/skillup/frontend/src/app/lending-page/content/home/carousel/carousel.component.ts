import { Component, OnInit } from '@angular/core';
import { NgxGalleryAnimation, INgxGalleryOptions, INgxGalleryImage} from 'ngx-gallery';
import 'hammerjs';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  options: INgxGalleryOptions[];
  images: INgxGalleryImage[];
  logos: String[];
  carIndex: number = 0;

  constructor() { }

  ngOnInit() {

    this.options = [
      {
        width: '100%',
        height: '100%',
        thumbnails: false,
        previewDescription: false,
        preview: false,
        imageAnimation: NgxGalleryAnimation.Fade,
        imageInfinityMove: true
      }
    ];

    this.logos = ['carver', 'marquis', 'larson', 'larson-fx', 'striper', 'escape' ];

    this.images = [
      {
        // small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-small.jpeg',
        medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-medium.jpeg',
        // big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-big.jpeg',
        description: 'Image 1'
      },
      {
        // small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-small.jpeg',
        medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-medium.jpeg',
        // big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-big.jpeg',
        description: 'Image 2'
      },
      {
        // small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-small.jpeg',
        medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-medium.jpeg',
        // big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-big.jpeg',
        description: 'Image 3'
      },
      {
        // small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/4-small.jpeg',
        medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/4-medium.jpeg',
        // big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/4-big.jpeg',
        description: 'Image 4'
      },
      {
        // small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/5-small.jpeg',
        medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/5-medium.jpeg',
        // big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/5-big.jpeg',
        description: 'Image 5'
      },
      {
        // small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/6-small.jpeg',
        medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/6-medium.jpeg',
        // big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/6-big.jpeg',
        description: 'Image 6'
      }
    ];
  }

  onChange (data) {
    this.carIndex = data.index;
    console.log('data:', data);
  }

}
