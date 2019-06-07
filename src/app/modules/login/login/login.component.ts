import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public loading = false;
    message: string;
  constructor(private authenticationService: AuthenticationService, private route: Router) { }

  ngOnInit() {
  }
    onLogin(data) {
        // console.log(data);
        this.loading = true;
        this.authenticationService.login(data)
            .subscribe(resp => {
                    this.loading = false;
                    const resSTR = JSON.stringify(resp);
                    const resJSON = JSON.parse(resSTR);
                    // console.log(resJSON.body.data.token);
                    this.message = resJSON.body.message;
                    const jwt = resJSON.body.data.token;
                    const username = resJSON.body.data.user.username;
                    const email = resJSON.body.data.user.email;
                    const nom = resJSON.body.data.user.nom;
                    const prenom = resJSON.body.data.user.prenom;
                    const roles = resJSON.body.data.user.roles;
                    const id = resJSON.body.data.user.id;
                    this.authenticationService.saveToken(jwt);
                    this.authenticationService.saveData(username, nom , prenom, email, roles, id)
                    // console.log(resJSON.body.data.user.username);
                    this.route.navigate(['/']);
                }
            );
    }

    logout() {
        this.authenticationService.logOut();
    }
  isauthenticated() {
    return this.authenticationService.isAuthenticated();
  }


}
