import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AdminService} from '../../../service/admin.service';
import {AdminModel} from '../../../modeles/admin.model';
import {FormAdminComponent} from '../form-admin/form-admin.component';
import {EditAdminComponent} from '../edit-admin/edit-admin.component';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {DetailAdminComponent} from '../detail-admin/detail-admin.component';
import {LogModel} from '../../../modeles/log.model';
import {LogService} from '../../../service/log.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  newAdmin: any;
  public loading = false;
  roles = localStorage.getItem('roles');
  role: string;
  log: LogModel = {
    action: '',
    admin: localStorage.getItem('username'),
  };
  reference: string;
  referenceVoyage: string;
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

  displayedColumns: string[] = ['username', 'isvalid', 'details', 'actions'];
  dataSource: MatTableDataSource<AdminModel>;
  dataLength: number;
  searchKey: string;

  constructor(public dialog: MatDialog,
              private toastr: ToastrService,
              private adminService: AdminService,
              private logService: LogService) {
    this.loading = true;
    this.dataSource = new MatTableDataSource<AdminModel>();
  }

  ngOnInit() {
    this.getAllAdmins();
    this.getroles();
  }

  refresh() {
    this.getAllAdmins();
  }

  getroles() {
    if (this.roles === 'Super-Admin') {
      this.role = 'sa';
    } else {
      this.role = 'a';
    }
  }

  getAllAdmins() {
    this.loading = true;
    return this.adminService.getAll().subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data.data);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
  }

  openModal(admin: AdminModel): void {
    const dialogRef = this.dialog.open(FormAdminComponent, {
      width: '60%',
      data: [admin]
    });
  }

  openModalEdit(admin: AdminModel): void {
    const dialogRef = this.dialog.open(EditAdminComponent, {
      width: '60%',
      data: [admin]
    });
  }

  openModalDetails(admin: AdminModel): void {
    const dialogRef = this.dialog.open(DetailAdminComponent, {
      width: '60%',
      data: [admin]
    });
  }

  edit(row) {
    this.openModalEdit(row);
  }

  details(row) {
    this.openModalDetails(row);
  }

  addNew() {
    this.openModal(new AdminModel());
  }

  delete(row) {
    Swal.fire({
      title: 'Voulez vous Vraiment Supprimer ' + row.username,
      text: 'Vous ne Pourrez pas Revenir en Arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Je confirme la suppression!'
    }).then((result) => {
      if (result.value) {
        this.adminService.deleteAdmin(row)
          .subscribe(
            resp => {
              this.getAllAdmins();
              this.referenceVoyage = row.username;
              this.log.action = 'Le Compte Adminstrateur  : ' + this.referenceVoyage + ' a été supprimer';
              this.logService.enregisterLog(this.log).subscribe();
            }, error1 => console.log(error1));
        this.toastr.success(' Supprimé  avec success', 'Succès');
      }
    });

  }

  bloque(row) {
    Swal.fire({
      title: 'Voulez vous Vraiment Bloqué ' + row.username,
      text: 'Vous ne Pourrez pas Revenir en Arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Je confirme!'
    }).then((result) => {
      if (result.value) {
        this.adminService.blockAdmin(row)
          .subscribe(
            resp => {
              this.getAllAdmins();
              this.referenceVoyage = row.username;
              this.log.action = 'Le Compte Adminstrateur  : ' + this.referenceVoyage + ' a été bloquer';
              this.logService.enregisterLog(this.log).subscribe();
            });
        this.toastr.success(' Administrateur Bloqué', 'Succès');
      }
    });
  }

  debloque(row) {
    Swal.fire({
      title: 'Voulez vous Débloquer ' + row.username,
      text: 'Vous ne Pourrez pas Revenir en Arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Je confirme!'
    }).then((result) => {
      if (result.value) {
        this.adminService.deblockAdmin(row)
          .subscribe(
            resp => {
              this.getAllAdmins();
              this.referenceVoyage = row.username;
              this.log.action = 'Le Compte Adminstrateur  : ' + this.referenceVoyage + ' a été débloquer';
              this.logService.enregisterLog(this.log).subscribe();
            });
        this.toastr.success(' Administrateur Débloqué', 'Succès');
      }
    });

  }

}
