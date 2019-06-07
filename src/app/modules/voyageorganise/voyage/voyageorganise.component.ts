import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import {VoyageOrganiseService} from '../../../service/voyage-organise.service';
import {VoyageOrganise} from '../../../modeles/voyage/voyage-organise';
import Swal from 'sweetalert2';
import {AjoutVoyageComponent} from '../ajout-voyage/ajout-voyage.component';
import {DetailVoyageComponent} from '../detail-voyage/detail-voyage.component';
import {Router} from '@angular/router';
import {EditVoyageComponent} from '../edit-voyage/edit-voyage.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgxLoadingService} from 'ngx-loading';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {LogModel} from '../../../modeles/log.model';
import {LogService} from '../../../service/log.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-voyageorganise',
  templateUrl: './voyageorganise.component.html',
  styleUrls: ['./voyageorganise.component.scss']
})
export class VoyageorganiseComponent implements OnInit {
  show: false;
  filterForm: FormGroup;
  messageCode: number;
  selected = '';
  public loading = false;
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

  displayedColumns: string[] = ['reference', 'destination', 'activer', 'actions'];
  dataSource: MatTableDataSource<VoyageOrganise>;
  dataLength: number;
  searchKey: string;

  constructor(public dialog: MatDialog,
              private voyageService: VoyageOrganiseService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private formBuilder: FormBuilder,
              private spinnerService: Ng4LoadingSpinnerService,
              private logService: LogService,
              private router: Router) {
    this.loading = true;
    this.dataSource = new MatTableDataSource<VoyageOrganise>();
  }

  ngOnInit() {
    this.getAllVoyages();
    this.filterForm = this.formBuilder.group({
      typeVoyage: [''],
    });
  }

  showSpinner() {
    this.spinnerService.show();
    this.spinnerService.hide();
    // setTimeout(() => {
    //     this.spinnerService.hide();
    // }, 3000);
  }

  selectChangeHandle(event) {
    this.loading = true;
    this.selected = event.value;
    if (this.selected === 'tous') {
      return this.voyageService.getAllVoyages().subscribe(
        (data) => {
          this.dataSource = new MatTableDataSource(data.data);
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          this.loading = false;
        });
    }
    if (this.selected === 'a') {
      return this.voyageService.getVoyageArchive()
        .subscribe(
          (data) => {
            this.dataSource = new MatTableDataSource(data.data);
            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });
            this.loading = false;
          });
    }
    if (this.selected === 'na') {
      return this.voyageService.getVoyageNonArchive()
        .subscribe(
          (data) => {
            this.dataSource = new MatTableDataSource(data.data);
            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });
            this.loading = false;
          });
    }
  }

  getAllVoyages() {
    this.loading = true;
    return this.voyageService.getAllVoyages().subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data.data);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      });
  }


  refresh() {
    this.getAllVoyages();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModalAjout(voyage: VoyageOrganise): void {
    const dialogRef = this.dialog.open(AjoutVoyageComponent, {
      width: '60%',
      data: [voyage]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllVoyages();
    });
  }

  openModalDetails(voyage: VoyageOrganise): void {
    const dialogRef = this.dialog.open(DetailVoyageComponent, {
      width: '60%',
      data: [voyage]
    });
  }

  openModalEdit(voyage: VoyageOrganise): void {
    const dialogRef = this.dialog.open(EditVoyageComponent, {
      width: '60%',
      data: [voyage]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllVoyages();
    });
  }

  addNew() {
    this.openModalAjout(new VoyageOrganise());
  }

  details(row) {
    this.openModalDetails(row);
  }

  editClick(row) {
    this.openModalEdit(row);
  }

  deleteClick(row) {
    Swal.fire({
      title: 'Voulez vous Vraiment Supprimer le Voyage  ' + row.reference,
      text: 'Vous ne Pourrez pas Revenir en Arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Je confirme la suppression!'
    }).then((result) => {
      if (result.value) {
        this.voyageService.deleteVoyage(row.id)
          .subscribe(
            resp => {
              this.messageCode = resp.code;
              if (this.messageCode === 2) {
                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Vous ne pouvez pas supprimer définitivement ce voyage, ' +
                    'car il est affecter a un planning non supprimer!',
                });
              } else if (this.messageCode !== 2) {
                this.referenceVoyage = row.reference;
                this.log.action = 'Le voyage qui a comme réference : ' + this.referenceVoyage + ' a été Supprimer ';
                this.logService.enregisterLog(this.log).subscribe();
                this.getAllVoyages();
                this.toastr.success(' Supprimé  avec success', 'Succès', {positionClass: 'toast-top-center'});
              }
            }, error1 => console.log(error1));
      }
    });
  }

  archiveClick(row) {
    Swal.fire({
      title: 'Voulez vous Vraiment Archiver le Voyage  ' + row.reference,
      text: 'Vous ne Pourrez pas Revenir en Arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Je confirme l archivage!'
    }).then((result) => {
      if (result.value) {
        this.voyageService.archiverVoyage(row.id, row)
          .subscribe(
            resp => {
              this.messageCode = resp.code;
              if (this.messageCode === 2) {
                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Vous ne Pouvez pas archiver ce voyage, car il est affecter a un planning non Archiver!',
                });
              } else if (this.messageCode === 0) {
                this.getAllVoyages();
                this.referenceVoyage = row.reference;
                this.log.action = 'Le voyage qui a comme réference : ' + this.referenceVoyage + ' a été Archiver ';
                this.logService.enregisterLog(this.log).subscribe();
                this.toastr.success(' Archivé  avec success', 'Succès', {positionClass: 'toast-top-center'});
              }
            }, error1 => console.log(error1));
      }
    });
  }

  invisile(row) {
    Swal.fire({
      title: 'Voulez vous Vraiment Désactiver la vision de ce Voyage   ',
      text: 'Vous ne Pourrez pas Revenir en Arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Je confirme'
    }).then((result) => {
      if (result.value) {
        this.voyageService.invisibleVoyage(row.id, row)
          .subscribe(
            resp => {
              this.getAllVoyages();
              this.referenceVoyage = row.reference;
              this.log.action = 'Le voyage qui a comme réference : ' + this.referenceVoyage + ' est Invisible ';
              this.logService.enregisterLog(this.log).subscribe();
              this.toastr.success(' Voyage Invisible', 'Succès', {positionClass: 'toast-top-center'});
            }, error1 => console.log(error1));
      }
    });
  }

  visile(row) {
    Swal.fire({
      title: 'Voulez vous Vraiment Activer la vision de ce Voyage   ',
      text: 'Vous ne Pourrez pas Revenir en Arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Je confirme'
    }).then((result) => {
      if (result.value) {
        this.voyageService.visibleVoyage(row.id, row)
          .subscribe(
            resp => {
              this.getAllVoyages();
              this.referenceVoyage = row.reference;
              this.log.action = 'Le voyage qui a comme réference : ' + this.referenceVoyage + ' est Visible ';
              this.logService.enregisterLog(this.log).subscribe();
              this.toastr.success(' Voyage Visible', 'Succès', {positionClass: 'toast-top-center'});
            }, error1 => console.log(error1));
      }
    });
  }
}
