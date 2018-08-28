import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../../shared/session.service'

@Component({
  selector: 'app-admin-menu-panel',
  templateUrl: './admin-menu-panel.component.html',
  styleUrls: ['./admin-menu-panel.component.scss']
})
export class AdminMenuPanelComponent implements OnInit {

  constructor(private router: Router,
              private sessionService: SessionService) { }

  ngOnInit() {
  }

  isActive(route) {
    return this.router.url.indexOf(route) !== -1;
  }

  logOut() {
    this.sessionService.clearToken();
    this.router.navigate(['auth', 'login']);
  }

}
