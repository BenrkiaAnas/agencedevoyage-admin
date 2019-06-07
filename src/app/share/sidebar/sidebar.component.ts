import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../service/authentication.service';
import {AdminService} from '../../service/admin.service';


declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  {path: '/home', title: 'Dashboard', icon: 'design_app', class: ''},
  {path: '/voyage', title: 'Destination des Voyages', icon: 'media-1_album', class: ''},
  {path: '/planning', title: 'Programme des Voyages', icon: 'location_map-big', class: ''},
  {path: '/promotion', title: 'Promotions', icon: 'business_chart-bar-32', class: ''},
  {path: '/hotels', title: 'Hotels', icon: 'shopping_shop', class: ''},
  {path: '/inclusion', title: 'Inclusions', icon: 'shopping_tag-content', class: ''},
  {path: '/categorie', title: 'Categories', icon: 'ui-1_calendar-60', class: ''},
];

export const ROUTESADMIN: RouteInfo[] = [
  {path: '/home', title: 'Dashboard', icon: 'design_app', class: ''},
  {path: '/voyage', title: 'Destination des Voyages', icon: 'media-1_album', class: ''},
  {path: '/planning', title: 'Programme des Voyages', icon: 'location_map-big', class: ''},
  {path: '/promotion', title: 'Promotions', icon: 'business_chart-bar-32', class: ''},
  {path: '/hotels', title: 'Hotels', icon: 'shopping_shop', class: ''},
  {path: '/inclusion', title: 'Inclusions', icon: 'shopping_tag-content', class: ''},
  {path: '/categorie', title: 'Categories', icon: 'ui-1_calendar-60', class: ''},

  {path: '/admin', title: 'Gestion des Admins', icon: 'users_single-02', class: ''},
  {path: '/log', title: 'Historiques', icon: 'education_paper', class: ''}
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  roles = localStorage.getItem('roles');
  role: string;

  constructor(private authenticationService: AuthenticationService,
              private adminService: AdminService) {
  }

  ngOnInit() {
    this.getroles();
    if (this.role === 'sa') {
      this.menuItems = ROUTESADMIN.filter(menuItem => menuItem);
    } else {
      this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
  }

  getroles() {
    if (this.roles === 'Super-Admin') {
      this.role = 'sa';
    } else {
      this.role = 'a';
    }
  }

  isauthenticated() {
    return this.authenticationService.isAuthenticated();
  }

  logOut() {
    this.authenticationService.logOut();
  }

  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

}
