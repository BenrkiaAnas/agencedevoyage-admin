import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../service/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  nom = localStorage.getItem('nom');
  prenom = localStorage.getItem('prenom');
  namePath: any;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

  isauthenticated() {
    return this.authenticationService.isAuthenticated();
  }

  logOut() {
    this.authenticationService.logOut();
  }
}
