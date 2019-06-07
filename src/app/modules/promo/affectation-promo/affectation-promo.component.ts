import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {Planning} from '../../../modeles/planning/planning';
import {
  MAT_DIALOG_DATA,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatDialogRef, MatSelect
} from '@angular/material';
import {Promo} from '../../../modeles/promotion/promo';
import {PlanningService} from '../../../service/planning.service';
import {HotelService} from '../../../service/hotel.service';
import {InclusionService} from '../../../service/inclusion.service';
import {VoyageOrganiseService} from '../../../service/voyage-organise.service';
import {PromoService} from '../../../service/promo.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {map, startWith, take, takeUntil} from 'rxjs/operators';
import {Inclusion} from '../../../modeles/inclusion/inclusion';
import {VoyageOrganise} from '../../../modeles/voyage/voyage-organise';
import {LogModel} from "../../../modeles/log.model";
import {LogService} from "../../../service/log.service";

@Component({
  selector: 'app-affectation-promo',
  templateUrl: './affectation-promo.component.html',
  styleUrls: ['./affectation-promo.component.scss']
})
export class AffectationPromoComponent implements OnInit {
  log: LogModel = {
    action: '',
    admin: localStorage.getItem('username'),
  }
  reference: string;
  referencePromo: string;
  referencePlanning: string;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  planningFormCtrl = new FormControl();
  filtredPlanning: Observable<any>;
  _planningsToAdd: Planning[] = [];
  @ViewChild('planningInput') planningInput: ElementRef;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  registerFormPlanning: FormGroup;
  registerFormPromo: FormGroup;
  _onDestroy = new Subject<void>();
  promoFilterCtrl: FormControl = new FormControl();
  filteredPromo: ReplaySubject<Promo[]> = new ReplaySubject<Promo[]>(1);

  @ViewChild('singleSelect') singleSelect: MatSelect;



  planning: Planning[] = [];
  promo: Promo[] = [];
  promoSelected: Promo;
  submitted = false;
  action: any;
  minDate = new Date(2019, 5, 20);

  constructor(public dialogRef: MatDialogRef<AffectationPromoComponent>,
              private servicePromo: PromoService,
              private planningService: PlanningService,
              private toastr: ToastrService,
              private router: Router,
              private formBuilder: FormBuilder,
              private logService: LogService,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.action = this.data[0];
    this.promoSelected = new Promo();

  }

  ngOnInit() {

    //this.getAllPlanning();
    this.getAllPromo();
    //this.onChangeFilteredPlanning();
    this.registerFormPromo = this.formBuilder.group({
      promo: ['', [Validators.required]],
    });
    this.registerFormPlanning = this.formBuilder.group({
      planning: ['', [Validators.required]],
    });
    this.promoFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterPromos();

        });
  }
  ngAfterViewInit() {
    this.setInitialValue();
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }



  setInitialValue() {

    this.filteredPromo
        .pipe(take(1), takeUntil(this._onDestroy))
        .subscribe(() => {
          this.singleSelect.compareWith = (a: Promo, b: Promo) => a && b && a.id === b.id;
        });
  }
  onChangeFilteredPlanning() {
    this.filtredPlanning = this.planningFormCtrl.valueChanges.pipe(
      startWith(''),
      map((pln: string | null) => pln ? this._filter(pln) : this.planning.slice()));
  }


  private _filter(value: string): Planning[] {
    // value = value.toLowerCase();
    return this.planning.filter(pln => pln.reference.toLowerCase().indexOf(value) === 0);
  }

  getAllPlanning() {
    return this.planningService.getAllPlannningByPromo(this.promoSelected.dateBegin, this.promoSelected.dateEnd, this.promoSelected.visible).subscribe((data) => {
      this.planning = data.data;
    });
  }

  getAllPromo() {
    return this.servicePromo.getAllVisiblePromoForPlanning().subscribe((data) => {
      this.promo = data.data;
      this.filteredPromo.next(this.promo.slice());
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmitPlanning() {
    if (this._planningsToAdd.length !== 0) {
      this.servicePromo.affectPromoToPlannings(this.promoSelected, this._planningsToAdd).subscribe(
        res => {
          this.referencePromo = this.registerFormPromo.value.promo.pourcentage;
          this.referencePlanning = this.registerFormPlanning.value.planning.reference;
          this.log.action = 'Affectation du promotion '+this.referencePromo + ' au plannings ';
          this.logService.enregisterLog(this.log).subscribe();
          this.toastr.success(' Affectation avec succee  !', 'Succès', {positionClass: 'toast-top-center'});

          this.servicePromo.getAllPromo();
        }
      );
    }
  }

  redirectToPlanning() {
    this.router.navigate(['/planning']);
    this.onClose();
  }

  checkExistInList(value: string) {
    for (let elem of this._planningsToAdd) {
      if (value.trim() === elem.reference) {
        return true;
      }
    }
    return false;
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {

        for (let elem of this.planning) {
          if (value.trim() === elem.reference) {
            if (this.checkExistInList(elem.reference) === false) {
              this._planningsToAdd.push(elem);
            }
          }
        }
      }

      if (input) {
        input.value = null;
      }

      this.planningFormCtrl.setValue(null);
    }
  }

  remove(planning: Planning): void {
    const index = this._planningsToAdd.indexOf(planning);

    if (index >= 0) {
      this._planningsToAdd.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    for (let elem of this.planning) {
      if (event.option.viewValue === elem.reference) {
        if (this.checkExistInList(elem.reference) === false) {
          this._planningsToAdd.push(event.option.value);
        }
      }
    }
    this.planningInput.nativeElement.value = null;
    this.planningFormCtrl.setValue(null);
  }

  typePromoCompare(prm1: Promo, prm2: Promo): boolean {
    if (prm1 && prm2) {
      return prm1.id === prm2.id;
    }
    return false;

  }

  initFormPromoSelected() {
    this.promoSelected = this.registerFormPromo.controls.promo.value;
    this.getAllPlanning();
    this.onChangeFilteredPlanning();
  }

  filterPromos() {
    if (!this.promo) {
      return;
    }
    let search = this.promoFilterCtrl.value;
    if (!search) {
      this.filteredPromo.next(this.promo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPromo.next(
        this.promo.filter(promo => (promo.label.toLowerCase().indexOf(search) > -1) ||
        (promo.pourcentage.toString().toLowerCase().indexOf(search) > -1))
    );
  }


}
