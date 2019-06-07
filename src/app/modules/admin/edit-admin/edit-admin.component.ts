import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminModel} from '../../../modeles/admin.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {AdminService} from '../../../service/admin.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {LogModel} from '../../../modeles/log.model';
import {LogService} from '../../../service/log.service';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.scss']
})
export class EditAdminComponent implements OnInit, OnDestroy {
    message: string;
    log: LogModel = {
        action: '',
        admin: localStorage.getItem('username'),
    }
    reference: string;
    referenceVoyage: string;
    messageCode: number;
    public loading = false;
    registerForm: FormGroup;
    action: any;
    newAdmin: AdminModel;
    dataSource: MatTableDataSource<AdminModel>;
    displayedColumns: string[] = ['username', 'isvalid', 'details', 'actions'];
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

    constructor(public dialogRef: MatDialogRef<EditAdminComponent>,
                private adminService: AdminService,
                private formBuilder: FormBuilder,
                private router: Router,
                private toastr: ToastrService,
                private logService: LogService,
                private snackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public data) {
      this.newAdmin = new AdminModel();
      this.newAdmin = this.data[0];
      this.dataSource = new MatTableDataSource<AdminModel>();
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
      this.adminEdit(this.data[0]);
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

    adminEdit(admin: AdminModel) {
        this.registerForm.setValue({
            id: admin.id,
            username: admin.username,
            email: admin.email,
            nom: admin.nom,
            prenom: admin.prenom,
            role: admin.role
        });
    }
    onSubmit() {
        if (this.registerForm.valid) {
            this.loading = true;
            this.adminService.updateAdmin(this.registerForm.value)
                .subscribe(resp => {
                            this.loading = false;
                            this.message = resp.message;
                            this.messageCode = resp.code;
                            this.referenceVoyage = this.registerForm.value.username;
                            if (this.messageCode === 0) {
                                this.onClose();
                                this.getAllAdmins();
                                this.toastr.success( ' Modification avec succes !', 'Succès');
                                this.log.action = 'Le Compte Adminstrateur  : ' + this.referenceVoyage + ' a été Modifier';
                                this.logService.enregisterLog(this.log).subscribe();
                            }
                    }, error1 => console.log(error1));
        }
        this.router.navigate(['/admin']);
    }

    ngOnDestroy(): void {
    }

}
