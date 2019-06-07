import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './service/authentication.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AdminService} from "./service/admin.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'agenceVoyageAdmin';
  constructor(private authenticationService: AuthenticationService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.authenticationService.loadToken();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }
  isSuperAdmin() {
    return this.authenticationService.isSuperAdmin();
  }

  isSimpleAdmin() {
    return this.authenticationService.isSimpleAdmin();
  }

  isauthenticated() {
    return this.authenticationService.isAuthenticated();
  }
  logOut() {
    this.authenticationService.logOut();
  }
}
