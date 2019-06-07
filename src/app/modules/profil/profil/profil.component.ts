import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../service/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordService} from '../../../service/password.service';
import {Router} from '@angular/router';
import {AdminModel} from '../../../modeles/admin.model';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
    public loading = false;
    message: string;
    show = false;
    admin: AdminModel = new AdminModel();
    username = localStorage.getItem('username');
    nom = localStorage.getItem('nom');
    prenom = localStorage.getItem('prenom');
    role = localStorage.getItem('roles');
    email = localStorage.getItem('email');
    id = localStorage.getItem('id');
    registerForm: FormGroup;
    registerForm1: FormGroup;
    submitted = false;
    constructor(private authenticationService: AuthenticationService,
                private formBuilder: FormBuilder,
                private passwordService: PasswordService,
                private router: Router) { }

    ngOnInit() {
        this.registerForm1 = this.formBuilder.group({
            password: ['', [Validators.required]],
        })
        this.registerForm = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, {
            validator: this.MustMatch('password', 'confirmPassword')
        });
    }

    MustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }

            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }
    get f() { return this.registerForm.controls; }
    isauthenticated() {
        return this.authenticationService.isAuthenticated();
    }
    onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            this.loading = false;
            return;
        }
        // console.log('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value));
        const pass = JSON.stringify(this.registerForm.value);
        return this.passwordService.passwordchange(pass)
            .subscribe(() =>
                this.authenticationService.logOut()
            );
    }
    verifie() {
        this.loading = true;
        this.show = false;
        const passverifie = JSON.stringify(this.registerForm1.value);
        this.passwordService.checkpassword(passverifie).subscribe(resp => {
            this.loading = false;
            if (resp.code === 1) {
                return   this.show = true;
            }
            else {
                this.message = '* Mot de passe Incorrect !';
                return this.show = false;
            }
        });
    }

}
