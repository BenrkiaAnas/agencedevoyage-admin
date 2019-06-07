import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {Planning} from '../../../modeles/planning/planning';
import {PlanningService} from '../../../service/planning.service';
import {FormPlanningComponent} from '../form-planning/form-planning.component';
import {HotelService} from '../../../service/hotel.service';
import {VoyageOrganiseService} from '../../../service/voyage-organise.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {DetailPlanningComponent} from '../detail-planning/detail-planning.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LogService} from '../../../service/log.service';
import {LogModel} from '../../../modeles/log.model';
import {ModalManager} from 'ngb-modal';

@Component({
  selector: 'app-list-planning',
  templateUrl: './list-planning.component.html',
  styleUrls: ['./list-planning.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class ListPlanningComponent implements OnInit, OnDestroy {

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

  displayedColumns: string[] = ['voyageOrganise', 'dateBegin', 'isActiver', 'actions'];
  dataSource: MatTableDataSource<Planning>;
  plannings: Planning[];
  filterForm: FormGroup;
  loading = false;
  log: LogModel = {
    action: '',
    admin: localStorage.getItem('username'),
  };

  constructor(public dialog: MatDialog,
              private modal: ModalManager,
              private planningService: PlanningService,
              private hotelService: HotelService,
              private voyageService: VoyageOrganiseService,
              private logService: LogService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService) {
    this.loading = true;
    this.dataSource = new MatTableDataSource<Planning>();
  }

  ngOnInit() {
    this.getAllPlannings();
    this.filterForm = this.formBuilder.group({
      dateBegin: [''],
      dateEnd: [''],
      typePlanning: [''],
    });

  }

  refresh() {
    this.getAllPlannings();
  }

  getAllPlanningsByDateInterval(dateBegin, dateEnd) {
    this.loading = true;
    return this.planningService.getAllPlanningsByDateInterval(dateBegin, dateEnd).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data['data-planning']);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      });
  }

  getAllPlanningsByVisible(visible) {
    this.loading = true;
    return this.planningService.getAllPlanningsByVisible(visible).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data['data-planning']);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      });
  }

  getAllPlannings() {
    this.loading = true;
    return this.planningService.getAllPlannings().subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data['data']);
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

  detailModal(action: string, planning: Planning): void {
    const dialogRef = this.dialog.open(DetailPlanningComponent, {
      height: '80%',
      maxWidth: '50%',
      data: [planning, {'action': action === 'add' ? 'Ajouter' : 'Modifier'}]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllPlannings();
    });
  }

  openModal(action: string, planning: Planning): void {
    const dialogRef = this.dialog.open(FormPlanningComponent, {
      width: '60%',
      data: [planning, {'action': action === 'add' ? 'Ajouter' : 'Modifier'}]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllPlannings();
    });
  }

  detailClick(row) {
    this.detailModal('edit', row);
  }

  editClick(row) {
    this.openModal('edit', row);
  }

  addNew() {
    this.openModal('add', new Planning());
  }

  deleteClick(row) {
    let text = 'SUPPRESSION';
    Swal.fire({
      title: text,
      text: 'Voulez vous Vraiment Supprimer ' + row.reference,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui'
    }).then((result) => {
      if (result.value) {
        this.planningService.deletePlanning(row).subscribe(
          data => {
            this.getAllPlannings();
            if (data['code'] === -2) {
              Swal.fire({
                type: 'error',
                title: 'Erreur',
                text: data['message'],
              });
            } else if (data['code'] !== -2) {
              if (data['code'] === 1) {
                this.log.action = 'Le Planning qui a comme réference : ' + row.reference + ' a été Supprimer ';
                this.logService.enregisterLog(this.log).subscribe();
              }
              this.toastsNotification(data['code'], text, data['message']);
            }
          },
          error1 => console.log(error1)
        );
      }
    });
  }

  activerClick(row) {
    let text = 'Activer';
    if (row.isActiver === true) {
      text = 'Désactiver';
    }
    Swal.fire({
      title: text,
      text: 'Voulez vous ' + text + '  : ' + row.reference,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui'
    }).then((result) => {
      if (result.value) {
        this.planningService.setIsActiverPlanning(row).subscribe(
          data => {
            this.getAllPlannings();
            this.log.action = 'Le Planning qui a comme réference : ' + row.reference + ' est ' + text;
            this.logService.enregisterLog(this.log).subscribe();
            this.toastsNotification(data['code'], text, data['message']);
          },
          error1 => console.log(error1)
        );


      }
    });
  }

  visibleClick(row) {
    let text = 'Archiver';
    if (row.visible === false) {
      text = 'Désarchiver';
    }
    Swal.fire({
      title: text,
      text: 'Voulez vous ' + text + ' : ' + row.reference,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui'
    }).then((result) => {
      if (result.value) {
        this.planningService.setVisiblePlanning(row).subscribe(
          data => {
            this.getAllPlannings();
            this.log.action = 'Le Planning qui a comme réference : ' + row.reference + ' est ' + text;
            this.logService.enregisterLog(this.log).subscribe();
            this.toastsNotification(data['code'], text, data['message']);
          },
          error1 => console.log(error1)
        );
      }
    });
  }

  toastsNotification(code, titre, message) {
    if (code === 1) {
      this.toastr.success(message, titre, {positionClass: 'toast-top-center'});
    } else if (code === -2) {
      this.toastr.warning(message, titre, {positionClass: 'toast-top-center'});
    } else if (code === -1) {
      this.toastr.error(message, titre, {positionClass: 'toast-top-center'});
    }
  }

  selectTypePlanning(event) {
    if (event.value === 'tous') {
      this.getAllPlannings();
    }
    if (event.value === 'archiver') {
      this.getAllPlanningsByVisible(0);
    }
    if (event.value === 'no-archiver') {
      this.getAllPlanningsByVisible(1);
    }
  }

  selectfilterDate() {
    if (this.filterForm.controls.dateBegin.value !== '' && this.filterForm.controls.dateEnd.value !== '') {
      this.getAllPlanningsByDateInterval(this.filterForm.controls.dateBegin.value, this.filterForm.controls.dateEnd.value);
    } else {
      this.getAllPlannings();
    }
  }

}
