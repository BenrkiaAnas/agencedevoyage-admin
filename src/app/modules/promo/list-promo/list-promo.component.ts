import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ToastrService} from "ngx-toastr";
import {Promo} from "../../../modeles/promotion/promo";
import {PromoService} from "../../../service/promo.service";
import {FormPromoComponent} from "../form-promo/form-promo.component";
import Swal from "sweetalert2";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {AffectationPromoComponent} from "../affectation-promo/affectation-promo.component";
import {PlanningService} from "../../../service/planning.service";
import {DetailPromoComponent} from "../detail-promo/detail-promo.component";
import {LogModel} from "../../../modeles/log.model";
import {LogService} from "../../../service/log.service";

@Component({
  selector: 'app-list-promo',
  templateUrl: './list-promo.component.html',
  styleUrls: ['./list-promo.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class ListPromoComponent implements OnInit, OnDestroy {

  log: LogModel = {
    action: '',
    admin: localStorage.getItem('username'),
  }
  @ViewChild('filter') filter: ElementRef;
  archivagePromo ;
    dateNow: any = new Date();
    dateParseNow;
    dateParseRow;
  messageCode: number;
  reference: string;
  referencePromo: string;


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

  displayedColumns: string[] = ['label', 'pourcentage','Date Debut','Date Fin','visible','actions'];
  dataSource: MatTableDataSource<Promo>;
  dataLength: number;
  searchKey: string;


  constructor(public dialog: MatDialog,
              private promoService: PromoService,
              private planningService: PlanningService,
              private toastr: ToastrService,
              private logService: LogService) {
    this.dataSource = new MatTableDataSource<Promo>();
  }

  ngOnInit() {
    this.getAllPromo();
    this.setDateExpirationPromo();
  }
  refresh() {
    this.getAllPromo();
    this.setDateExpirationPromo();
  }
  ngOnDestroy(): void {
  }
  getAllPromo()
  {
    return this.promoService.getAllPromo().subscribe(
        (data)=> {
          this.dataSource = new MatTableDataSource<Promo>(data.data);
          setTimeout(()=>{
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openModal(action: string, promo: Promo): void {
    const dialogRef = this.dialog.open(FormPromoComponent, {
      width: '50%',
      data: [promo, {'action': action === 'Ajouter' ? 'Ajouter' : 'Modifier'}]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllPromo();
    });
  }
  openModelPromo(action: string,promo: Promo): void {
    const dialogRef = this.dialog.open(AffectationPromoComponent, {
      width: '50%',
      data: [promo, {'action': action === 'Ajouter' ? 'Ajouter' : 'Modifier'}]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllPromo();
    });
  }

  editClick(row) {
    this.openModal('Modifier', row);
  }

  addNew() {
    this.openModal('Ajouter', new Promo());
  }
  detailClick(row) {
    this.detailModal('Modifier', row);
  }
  affectPromo(row)
  {
    this.openModelPromo('Modifier',row);
  }
  deleteClick(row) {
    Swal.fire({
      title: 'Voulez vous vraiment Supprimé la promotion ' + row.pourcentage + ' ?',
      text: 'Vous ne Pourrez pas Revenir en Arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Je confirme!'
    }).then((result) => {
      if (result.value) {
        this.promoService.deletePromo(row).subscribe(
            data => {
              this.getAllPromo();
              this.referencePromo = row.label + " du promotion : "+row.pourcentage+" %";
              this.log.action = 'Suppression du Promotion : ' + this.referencePromo;
              this.logService.enregisterLog(this.log).subscribe();
              this.toastr.success(row.pourcentage +' supprimer avec succes ! !', 'suppression', {positionClass: 'toast-top-center'});
            },
            error1 => console.log(error1)
        );
        this.toastr.success(row.pourcentage +' supprimer avec succes ! !', 'suppression', {positionClass: 'toast-top-center'});

      }
    });
  }

  archivage(row) {
    if(row.visible == true)
    {
      this.archivagePromo = 'Archiver';
    }else{
      this.archivagePromo = 'Desarchiver';
    }
    Swal.fire({
      title: 'Voulez vous Vraiment '+ this.archivagePromo +' '+ row.pourcentage,
      text: 'Vous ne Pourrez pas Revenir en Arrière!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Je confirme!'
    }).then((result) => {
      if (result.value) {
        this.promoService.visibilityPromo(row)
            .subscribe(
                resp => {
                  this.getAllPromo();
                    this.referencePromo = row.label + " du promotion : "+row.pourcentage+" %";
                    this.log.action = this.archivagePromo+' du Promotion : ' + this.referencePromo;
                    this.logService.enregisterLog(this.log).subscribe();
                });
        this.toastr.success(' Promotion '+this.archivagePromo, 'Archivage/Desarchivage', {positionClass: 'toast-top-center'});

      }
    });
  }
  checkUsingPromoToPlanning(row)
  {
      return this.promoService.checkUsingPromoForPlanning(row).subscribe(data =>{
        this.getAllPromo();
      });
  }

  setDateExpirationPromo()
  {
    return this.promoService.setDateExpirationPromo().subscribe(data=>{
      this.getAllPromo();
    });
  }
    showDateNow(row)
    {
        this.dateParseNow = Date.parse(this.dateNow.toString());
        this.dateParseRow = Date.parse(row.dateEnd);
    }

  detailModal(action: string, promo: Promo): void {
    const dialogRef = this.dialog.open(DetailPromoComponent, {
      width: '60%',
      data: [promo, {'action': action === 'Ajouter' ? 'Ajouter' : 'Modifier'}]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllPromo();
    });
  }
}
