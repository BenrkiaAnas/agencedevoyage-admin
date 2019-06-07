import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  host = `${environment.URL}`;
  jwt: string;
  username: string;
  roles: string;
  nom: string;
  prenom: string;
  email: string;
  id: number;

  constructor(private http: HttpClient) {
  }

  login(data) {
    return this.http.post(this.host + 'login2', data, {observe: 'response'});
  }

  saveToken(jwt: any) {
    localStorage.setItem('token', jwt);
    this.jwt = jwt;
    this.parseJwt();
  }

  saveData(username: any, nom: any, prenom: any, email: any, roles: any, id: any) {
    localStorage.setItem('username', username);
    this.username = username;
    localStorage.setItem('nom', nom);
    this.nom = nom;
    localStorage.setItem('prenom', prenom);
    this.prenom = prenom;
    localStorage.setItem('email', email);
    this.email = email;
    localStorage.setItem('roles', roles);
    this.roles = roles;
    localStorage.setItem('id', id);
    this.id = id;
    this.parseJwt();
  }

  parseJwt() {
    const jwtHelper = new JwtHelperService();
    this.username = jwtHelper.decodeToken(this.jwt).obj;
    this.roles = jwtHelper.decodeToken(this.jwt).roles;
  }

  isSuperAdmin() {
    if (this.roles.indexOf('ADMIN') >= 0) {
      return true;
    }
  }

  isSimpleAdmin() {
    return this.roles.indexOf('SIMPLE-ADMIN') >= 0;
  }

  isAuthenticated(): boolean {
    if (this.jwt) {
      return true;
    } else {
      return false;
    }
  }

  loadToken() {
    this.jwt = localStorage.getItem('token');
    this.parseJwt();
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('nom');
    localStorage.removeItem('prenom');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
    localStorage.removeItem('id');
    this.initParams();
  }

  initParams() {
    this.jwt = undefined;
    this.username = undefined;
    this.roles = undefined;
  }

  loggedIn() {
    return this.jwt;
  }
}
