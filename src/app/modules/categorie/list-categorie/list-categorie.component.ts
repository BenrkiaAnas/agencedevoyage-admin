import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Inclusion} from '../../../modeles/inclusion/inclusion';
import {InclusionService} from '../../../service/inclusion.service';
import {ToastrService} from 'ngx-toastr';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormInclusionComponent} from '../../inclusion/form-inclusion/form-inclusion.component';
import Swal from 'sweetalert2';
import {Categorie} from '../../../modeles/categorie/categorie';
import {CategorieService} from '../../../service/categorie.service';
import {FormCategorieComponent} from '../form-categorie/form-categorie.component';
import {LogModel} from '../../../modeles/log.model';
import {LogService} from '../../../service/log.service';

@Component({
  selector: 'app-list-categorie',
  templateUrl: './list-categorie.component.html',
  styleUrls: ['./list-categorie.component.scss']
})
export class ListCategorieComponent implements OnInit, OnDestroy {
    log: LogModel = {
        action: '',
        admin: localStorage.getItem('username'),
    }
    reference: string;
    referenceVoyage: string;
    messageCode: number;
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

  displayedColumns: string[] = ['id', 'label', 'actions'];
  dataSource: MatTableDataSource<Categorie>;
  dataLength: number;
  searchKey: string;
  loading = false;

  constructor(public dialog: MatDialog,
              private categorieService: CategorieService,
              private toastr: ToastrService,
              private logService: LogService) {
    this.loading = true;
    this.dataSource = new MatTableDataSource<Categorie>();
  }

  ngOnInit() {
    this.getAllCategories();

  }

  refresh() {
    this.getAllCategories();
  }

  getAllCategories() {
    this.loading = true;
    return this.categorieService.getAllCategories().subscribe(
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

  openModal(action: string, categorie: Categorie): void {
    const dialogRef = this.dialog.open(FormCategorieComponent, {
      width: '50%',
      data: [categorie, {'action': action === 'add' ? 'Add' : 'Edit'}]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllCategories();
    });
  }

  editClick(row) {
    this.openModal('edit', row);
  }

  addNew() {
    this.openModal('add', new Categorie());
  }

  deleteClick(row) {

    Swal.fire({
      title: 'Voulez vous vraiment Supprimé la categorie ' + row.label + ' ?',
      text: 'Vous ne Pourrez pas Revenir en Arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Je confirme!'
    }).then((result) => {
      if (result.value) {
        this.categorieService.deleteCategorie(row).subscribe(
          data => {
            this.messageCode = data.code;
            if (this.messageCode === 1)  {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Vous ne Pouvez pas supprimer cette categorie, car il est affecter a un voyage!',
                });
            }
            else if (this.messageCode !== 1) {
                this.getAllCategories();
                this.referenceVoyage = row.label;
                this.log.action = 'Suppression du catégorie : ' + this.referenceVoyage;
                this.logService.enregisterLog(this.log).subscribe();
                this.toastr.success(row.label + ' deleted success', 'Deleted');
            }
          },
          error1 => console.log(error1)
        );
      }
    });

  }


}
