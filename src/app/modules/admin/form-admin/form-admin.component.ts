import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminModel} from '../../../modeles/admin.model';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
    MatPaginator,
    MatSnackBar, MatSort,
    MatTableDataSource
} from '@angular/material';
import {AdminService} from '../../../service/admin.service';
import {Router} from '@angular/router';
import {SnackBarAjoutComponent} from '../../../dialogues/snack-bar-ajout/snack-bar-ajout.component';
import {ToastrService} from 'ngx-toastr';
import {LogModel} from "../../../modeles/log.model";
import {LogService} from "../../../service/log.service";

@Component({
  selector: 'app-form-admin',
  templateUrl: './form-admin.component.html',
  styleUrls: ['./form-admin.component.scss']
})
export class FormAdminComponent implements OnInit {
    message: string;
    log: LogModel = {
        action: '',
        admin: localStorage.getItem('username'),
    }
    reference: string;
    referenceVoyage: string;
    public loading = false;
    messageCode: number;
    registerForm: FormGroup;
    submitted = false;
    action: any;
    newAdmin: AdminModel;
    @ViewChild('filter') filter: ElementRef;

    paginator;

    @ViewChild(MatPaginator) set contentPag(content: ElementRef) {
        this.paginator = content;
        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
        }
    }

    sort;

    @ViewChild(MatSort) set content(content: ElementRef) {
        this.sort = content;
        if (this.sort) {
            this.dataSource.sort = this.sort;
        }
    }

    displayedColumns: string[] = ['username', 'email', 'nom', 'prenom', 'isvalid', 'role', 'actions'];
    dataSource: MatTableDataSource<AdminModel>;
  constructor(public dialogRef: MatDialogRef<FormAdminComponent>,
              private adminService: AdminService,
              private formBuilder: FormBuilder,
              private router: Router,
              private logService: LogService,
              private toastr: ToastrService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data) {
      this.newAdmin = new AdminModel();
      this.newAdmin = this.data[0];
      this.dataSource = new MatTableDataSource<AdminModel>();
  }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(8)]],
          email: ['', [Validators.required, Validators.email]],
          nom: ['', Validators.required],
          prenom: ['', Validators.required],
          role: ['', Validators.required]
      });
  }
    refresh() {
        this.getAllAdmins();
    }
    getAllAdmins() {
        return this.adminService.getAll().subscribe(
            (data) => {
                this.dataSource = new MatTableDataSource(data.data);
                setTimeout(() => {
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
                console.log(this.dataSource);
            });
    }
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onClose() {
        this.registerForm.reset();
        this.dialogRef.close();
    }

    onSubmit() {
        if (this.registerForm.valid) {
                this.loading = true;
                this.adminService.addAdmin(this.registerForm.value)
                    .subscribe(resp => {
                            this.loading = false;
                            this.message = resp.message;
                            this.messageCode = resp.code;
                            this.referenceVoyage = this.registerForm.value.username;
                            if (this.messageCode === 0) {
                                this.onClose();
                                this.getAllAdmins();
                                this.toastr.success( ' Ajouté avec succes !', 'Succès');
                                this.log.action = 'Le Compte Adminstrateur  : ' + this.referenceVoyage + ' a été Ajouter';
                                this.logService.enregisterLog(this.log).subscribe();
                                // this.openSnackBar();
                            }
                        });
            }
    }
    // openSnackBar() {
    //   this.snackBar.openFromComponent(SnackBarAjoutComponent, {
    //       duration:  7000,
    //   });
    // }

}
