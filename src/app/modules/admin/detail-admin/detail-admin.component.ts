import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatTableDataSource} from '@angular/material';
import {AdminModel} from '../../../modeles/admin.model';
import {AuthenticationService} from '../../../service/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../../service/admin.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-detail-admin',
  templateUrl: './detail-admin.component.html',
  styleUrls: ['./detail-admin.component.scss']
})
export class DetailAdminComponent implements OnInit {
    nom = localStorage.getItem('nom');
    prenom = localStorage.getItem('prenom');
    registerForm: FormGroup;
    newAdmin: AdminModel;
    constructor(public dialogRef: MatDialogRef<DetailAdminComponent>,
                private adminService: AdminService,
                private authenticationService: AuthenticationService,
                private formBuilder: FormBuilder,
                private router: Router,
                @Inject(MAT_DIALOG_DATA) public data) {
        this.newAdmin = new AdminModel();
        // this.newAdmin = this.data[0];
        // this.adminDetails(this.data[0]);
    }
    onClose() {
        this.registerForm.reset();
        this.dialogRef.close();
    }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          id: [''],
          username: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          nom: ['', Validators.required],
          prenom: ['', Validators.required],
          role: ['', Validators.required]
      });
      this.adminDetails(this.data[0]);
  }
    isauthenticated() {
        return this.authenticationService.isAuthenticated();
    }
    adminDetails(admin: AdminModel) {
        this.registerForm.setValue({
            id: admin.id,
            username: admin.username,
            email: admin.email,
            nom: admin.nom,
            prenom: admin.prenom,
            role: admin.role
        });
    }

}
