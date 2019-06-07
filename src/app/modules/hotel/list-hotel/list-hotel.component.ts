import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Hotel} from '../../../modeles/hotel/hotel';
import {HotelService} from '../../../service/hotel.service';
import {MatDialog, MatSort, MatPaginator, MatTableDataSource} from '@angular/material';
import {FormHotelComponent} from '../form-hotel/form-hotel.component';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {LogModel} from '../../../modeles/log.model';
import {LogService} from '../../../service/log.service';
import {Spinner} from 'ngx-spinner/lib/ngx-spinner.enum';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-list-hotel',
  templateUrl: './list-hotel.component.html',
  styleUrls: ['./list-hotel.component.scss'],
  providers: [NgbRatingConfig]
})
export class ListHotelComponent implements OnInit, OnDestroy {
    log: LogModel = {
        action: '',
        admin: localStorage.getItem('username'),
    }
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

  displayedColumns: string[] = ['id', 'name', 'rating', 'actions'];
  dataSource: MatTableDataSource<Hotel>;
  dataLength: number;
  searchKey: string;
  loading = false;

  constructor(public dialog: MatDialog,
              private hotelService: HotelService,
              private logService: LogService,
              private toastr: ToastrService,
              config: NgbRatingConfig) {
    this.loading = true;
    this.dataSource = new MatTableDataSource<Hotel>();
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
    this.getAllHotels();

  }

  refresh() {
    this.getAllHotels();
  }

  getAllHotels() {
    this.loading = true;
    return this.hotelService.getAllHotels().subscribe(
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

  openModal(action: string, hotel: Hotel): void {
    const dialogRef = this.dialog.open(FormHotelComponent, {
      width: '50%',
      data: [hotel, {'action': action === 'add' ? 'Ajouter' : 'Modifier'}]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllHotels();
    });
  }

  editClick(row) {
    this.openModal('edit', row);
  }

  addNew() {
    this.openModal('add', new Hotel());
  }

  deleteClick(row) {
    let text = 'SUPPRESSION';
    Swal.fire({
      title: text,
      text: 'Voulez vous Vraiment Supprimer ' + row.name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'oui'
    }).then((result) => {
      if (result.value) {
        this.hotelService.deleteHotel(row).subscribe(
          data => {
            this.getAllHotels();
            if (data['code'] === -2) {
              Swal.fire({
                type: 'error',
                title: 'Erreur',
                text: data['message'],
              });
            } else if (data['code'] !== -2) {
              if (data['code'] === 1) {
                this.log.action = 'Suppression Hôtel : ' + row.name;
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
