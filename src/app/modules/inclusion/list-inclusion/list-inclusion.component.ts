import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Inclusion} from '../../../modeles/inclusion/inclusion';
import {InclusionService} from '../../../service/inclusion.service';
import {FormInclusionComponent} from '../form-inclusion/form-inclusion.component';
import {LogModel} from '../../../modeles/log.model';
import {LogService} from '../../../service/log.service';

@Component({
  selector: 'app-list-inclusion',
  templateUrl: './list-inclusion.component.html',
  styleUrls: ['./list-inclusion.component.scss']
})
export class ListInclusionComponent implements OnInit, OnDestroy {
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

  displayedColumns: string[] = ['id', 'label', 'icon', 'actions'];
  dataSource: MatTableDataSource<Inclusion>;
  dataLength: number;
  searchKey: string;
  loading = false;


  constructor(public dialog: MatDialog,
              private inclusionService: InclusionService,
              private toastr: ToastrService,
              private logService: LogService,
              config: NgbRatingConfig) {
    this.loading = true;
    this.dataSource = new MatTableDataSource<Inclusion>();
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
    this.getAllInclusions();

  }

  refresh() {
    this.getAllInclusions();
  }

  getAllInclusions() {
    this.loading = true;
    return this.inclusionService.getAllInclusions().subscribe(
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

  openModal(action: string, inclusion: Inclusion): void {
    const dialogRef = this.dialog.open(FormInclusionComponent, {
      width: '50%',
      data: [inclusion, {'action': action === 'Ajouter' ? 'Ajouter' : 'Modifier'}]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllInclusions();
    });
  }

  editClick(row) {
    this.openModal('Modifier', row);
  }

  addNew() {
    this.openModal('Ajouter', new Inclusion());
  }

  deleteClick(row) {
    let text = 'SUPPRESSION';
    Swal.fire({
      title: text,
      text: 'Voulez vous Vraiment Supprimer ' + row.label,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui'
    }).then((result) => {
      if (result.value) {
        this.inclusionService.deleteInclusion(row).subscribe(
          data => {
            this.getAllInclusions();

            if (data['code'] === -2) {
              Swal.fire({
                type: 'error',
                title: 'Erreur',
                text: data['message'],
              });
            } else if (data['code'] !== -2) {
              if (data['code'] === 1) {
                this.log.action = 'Suppression Inclusion : ' + row.label;
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

  toastsNotification(code, titre, message) {
    if (code === 1) {
      this.toastr.success(message, titre, {positionClass: 'toast-top-center'});
    } else if (code === 2) {
      this.toastr.warning(message, titre, {positionClass: 'toast-top-center'});
    } else if (code === -1) {
      this.toastr.error(message, titre, {positionClass: 'toast-top-center'});
    }
  }
}
