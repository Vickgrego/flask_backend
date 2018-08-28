import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  @Input()
  private iconName: string;

  @Input() iconWidth: number;

  @Input() iconHeight: number;

  private path: string = '../../../assets/images/icons.svg';

  constructor() { }

  ngOnInit() {
  }

  get iconPath(): string {
    return `${ this.path }#${ this.iconName }`;
  }
}
