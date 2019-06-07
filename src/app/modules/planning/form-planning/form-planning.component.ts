import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatDialogRef, MatSelect,
} from '@angular/material';
import {Router} from '@angular/router';
import {PlanningService} from '../../../service/planning.service';
import {HotelService} from '../../../service/hotel.service';
import {Hotel} from '../../../modeles/hotel/hotel';
import {VoyageOrganiseService} from '../../../service/voyage-organise.service';
import {VoyageOrganise} from '../../../modeles/voyage/voyage-organise';
import {Promo} from '../../../modeles/promotion/promo';
import {ToastrService} from 'ngx-toastr';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {map, startWith, take, takeUntil} from 'rxjs/operators';
import {Inclusion} from '../../../modeles/inclusion/inclusion';
import {InclusionService} from '../../../service/inclusion.service';
import {Planning} from '../../../modeles/planning/planning';
import {PromoService} from '../../../service/promo.service';

@Component({
  selector: 'app-form-planning',
  templateUrl: './form-planning.component.html',
  styleUrls: ['./form-planning.component.scss']
})
export class FormPlanningComponent implements OnInit, AfterViewInit, OnDestroy {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  incluionFormCtrl = new FormControl();
  filteredInclusions: Observable<any>;
  _inclusionsToAdd: Inclusion[] = [];

  _onDestroy = new Subject<void>();
  filteredVoyages: ReplaySubject<VoyageOrganise[]> = new ReplaySubject<VoyageOrganise[]>(1);
  voyageFilterCtrl: FormControl = new FormControl();

  filteredHotels: ReplaySubject<Hotel[]> = new ReplaySubject<Hotel[]>(1);
  hotelFilterCtrl: FormControl = new FormControl();

  filteredPromos: ReplaySubject<Promo[]> = new ReplaySubject<Promo[]>(1);
  promoFilterCtrl: FormControl = new FormControl();

  @ViewChild('singleSelect') singleSelect: MatSelect;

  @ViewChild('inclusionInput') inclusionInput: ElementRef;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  registerForm: FormGroup;
  registerFormPromo: FormGroup;
  registerFormVoyage: FormGroup;

  hotels: Hotel[] = [];
  inclusions: Inclusion[] = [];
  voyages: VoyageOrganise[] = [];
  planningCreated: Planning;
  planningUpdate: Planning;
  promos: Promo[];
  action: any;
  minDate = new Date();

  constructor(public dialogRef: MatDialogRef<FormPlanningComponent>,
              private service: PlanningService,
              private hotelService: HotelService,
              private inclusionService: InclusionService,
              private voyageService: VoyageOrganiseService,
              private promoSevice: PromoService,
              private toastr: ToastrService,
              private router: Router,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.planningCreated = new Planning();
    this.planningUpdate = this.data[0];
    this.action = this.data[1].action;
    this.getAllInclusions();
    this.onChangeFilteredInclusions();
  }

  ngOnInit() {

    this.getAllHotels();
    this.getAllInclusions();
    this.getAllVoyages();
    this.onChangeFilteredInclusions();

    this.initialAllForms();

    if (this.action === 'Modifier') {
      this.planningUpdate = this.data[0];
      this.setEditForms();
      this.getAllVisiblePromos();
    }

    this.voyageFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterVoyages();

      });

    this.promoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPromos();

      });

    this.hotelFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterHotels();

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

    this.filteredVoyages
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: VoyageOrganise, b: VoyageOrganise) => a && b && a.id === b.id;
      });
    this.filteredHotels
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Hotel, b: Hotel) => a && b && a.id === b.id;
      });
    this.filteredPromos
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Promo, b: Promo) => a && b && a.id === b.id;
      });
  }

  filterVoyages() {
    if (!this.voyages) {
      return;
    }
    let search = this.voyageFilterCtrl.value;
    if (!search) {
      this.filteredVoyages.next(this.voyages.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredVoyages.next(
      this.voyages.filter(voyage => voyage.title.toLowerCase().indexOf(search) > -1)
    );
  }

  filterHotels() {
    if (!this.hotels) {
      return;
    }
    let search = this.hotelFilterCtrl.value;
    if (!search) {
      this.filteredHotels.next(this.hotels.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredHotels.next(
      this.hotels.filter(hotel => hotel.name.toLowerCase().indexOf(search) > -1)
    );
  }

  filterPromos() {
    if (!this.promos) {
      return;
    }
    let search = this.promoFilterCtrl.value;
    if (!search) {
      this.filteredPromos.next(this.promos.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPromos.next(
      this.promos.filter(promo => (promo.pourcentage.toString().toLowerCase().indexOf(search) > -1) ||
        (promo.dateBegin.toString().toLowerCase().indexOf(search) > -1) ||
        (promo.dateEnd.toString().toLowerCase().indexOf(search) > -1))
    );
  }

  onChangeFilteredInclusions() {
    this.filteredInclusions = this.incluionFormCtrl.valueChanges.pipe(
      startWith(''),
      map((inclusion: string | null) => inclusion ? this._filter(inclusion) : this.inclusions.slice()));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClose() {
    this.registerForm.reset();
    this.dialogRef.close();
  }

  onSubmitInclusion() {
    if (this._inclusionsToAdd.length !== 0) {
      if (this.action === 'Ajouter') {
        this.service.addInclusionToPlanning(this.planningCreated, this._inclusionsToAdd).subscribe(
          res => {
            this.toastsNotification(res['code'], this.action, res['message']);
          }
        );
      }
      if (this.action === 'Modifier') {
        this.service.addInclusionToPlanning(this.planningUpdate, this._inclusionsToAdd).subscribe(
          res => {
            this.toastsNotification(res['code'], this.action, res['message']);
          }
        );
      }
    }
  }

  onSubmitPromo() {
    if (this.registerFormPromo.valid) {
      if (this.action === 'Ajouter') {
        this.service.setPromoPlanning(this.planningCreated, this.registerFormPromo.value).subscribe(res => {
          this.toastsNotification(res['code'], this.action, res['message']);
        });
      }
      if (this.action === 'Modifier') {
        this.service.setPromoPlanning(this.planningUpdate, this.registerFormPromo.value).subscribe(res => {
          this.toastsNotification(res['code'], this.action, res['message']);
        });
      }
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      if (this.action === 'Ajouter') {
        this.service.addPlanning(this.registerForm.value).subscribe(
          res => {
            this.planningCreated.set(res.result);
            this.getAllVisiblePromos();
            this.toastsNotification(res['code'], this.action, res['message']);
          });
      }

      if (this.action === 'Modifier') {
        this.service.updatePlanning(this.registerForm.value).subscribe(res => {
          this.toastsNotification(res['code'], this.action, res['message']);
        });
      }
    }
  }

  getAllInclusions() {
    return this.inclusionService.getAllInclusions().subscribe(
      (data) => {
        this.inclusions = data.data;
      });
  }

  getAllHotels() {
    return this.hotelService.getAllHotels().subscribe((data) => {
      this.hotels = data.data;
      this.filteredHotels.next(this.hotels.slice());
    });
  }

  getAllVisiblePromos() {
    let dtBegin = this.planningCreated.dateBegin;
    let dtEnd = this.planningCreated.dateEnd;
    if (this.action === 'Modifier') {
      dtBegin = this.planningUpdate.dateBegin;
      dtEnd = this.planningUpdate.dateEnd;
    }

    return this.promoSevice.getAllVisiblePromos(dtBegin, dtEnd, 1).subscribe(
      (data) => {
        if (data.data !== []) {
          this.promos = data.data;
          this.filteredPromos.next(this.promos.slice());
        }

      });
  }

  getAllVoyages() {
    return this.voyageService.getVoyageNonArchive().subscribe(
      (data) => {
        this.voyages = data.data;
        this.filteredVoyages.next(this.voyages.slice());
      });
  }

  initialAllForms() {
    this.registerForm = this.formBuilder.group({
      id: ['', []],
      nbrDays: ['', [Validators.required, Validators.pattern('[0-9]+([\\.,][0-9]+)*'), Validators.min(1)]],
      nbrNight: ['', [Validators.pattern('[0-9]+([\\.,][0-9]+)*')]],
      nbrPlace: ['', [Validators.required, Validators.pattern('[0-9]+([\\.,][0-9]+)*'), Validators.min(10)]],
      priceAdult: ['', [Validators.required, Validators.pattern('[0-9]+([\\.,][0-9]+)*'), Validators.min(100)]],
      priceChild: ['', [Validators.required, Validators.pattern('[0-9]+([\\.,][0-9]+)*'), Validators.min(100)]],
      dateBegin: ['', [Validators.required]],
      description: ['', [Validators.required]],
      hotel: ['', [Validators.required]],
      voyageOrganise: ['', [Validators.required]],
    });
    this.registerFormVoyage = this.formBuilder.group({
      voyageOrganise: ['', [Validators.required]],
    });
    this.registerFormPromo = this.formBuilder.group({
      promo: ['', [Validators.required]],
    });
  }

  setEditForms() {
    this.registerFormVoyage.setValue({voyageOrganise: this.planningUpdate.voyageOrganise});
    this.registerForm.setValue({
      id: this.planningUpdate.id,
      nbrDays: this.planningUpdate.nbrDays,
      nbrNight: this.planningUpdate.nbrNight,
      nbrPlace: this.planningUpdate.nbrPlace,
      priceAdult: this.planningUpdate.priceAdult,
      priceChild: this.planningUpdate.priceChild,
      dateBegin: this.planningUpdate.dateBegin,
      hotel: this.planningUpdate.hotel,
      description: this.planningUpdate.description,
      voyageOrganise: this.planningUpdate.voyageOrganise
    });

    for (let elem of this.planningUpdate.inclusion) {
      this._inclusionsToAdd.push(elem);
    }

    this.registerFormPromo.setValue({promo: this.planningUpdate.promo});
  }

  initFormPlanning() {
    if (this.action === 'Ajouter') {
      this.registerForm.setValue({
        id: 0,
        nbrDays: '',
        nbrNight: '',
        nbrPlace: '',
        priceAdult: '',
        priceChild: '',
        dateBegin: '',
        hotel: '',
        description: '',
        voyageOrganise: this.registerFormVoyage.controls.voyageOrganise.value,
      });
    } else {
      this.registerForm.setValue({
        id: this.planningUpdate.id,
        nbrDays: this.planningUpdate.nbrDays,
        nbrNight: this.planningUpdate.nbrNight,
        nbrPlace: this.planningUpdate.nbrPlace,
        priceAdult: this.planningUpdate.priceAdult,
        priceChild: this.planningUpdate.priceChild,
        dateBegin: this.planningUpdate.dateBegin,
        description: this.planningUpdate.description,
        hotel: this.planningUpdate.hotel,
        voyageOrganise: this.registerFormVoyage.controls.voyageOrganise.value
      });
    }
  }

  redirectToVoyage() {
    this.router.navigate(['/voyage']);
    this.onClose();
  }

  checkExistInList(value: string) {
    for (let elem of this._inclusionsToAdd) {
      if (value.trim() === elem.label) {
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

        for (let elem of this.inclusions) {
          if (value.trim() === elem.label) {
            if (this.checkExistInList(elem.label) === false) {
              this._inclusionsToAdd.push(elem);
            }
          }
        }
      }

      if (input) {
        input.value = null;
      }

      this.incluionFormCtrl.setValue(null);
    }
  }

  remove(inclusion: Inclusion): void {
    const index = this._inclusionsToAdd.indexOf(inclusion);

    if (index >= 0) {
      this._inclusionsToAdd.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    for (let elem of this.inclusions) {
      if (event.option.viewValue === elem.label) {
        if (this.checkExistInList(elem.label) === false) {
          this._inclusionsToAdd.push(event.option.value);
        }
      }
    }
    this.inclusionInput.nativeElement.value = null;
    this.incluionFormCtrl.setValue(null);
  }

  private _filter(value: string): Inclusion[] {
    return this.inclusions.filter(inclusion => inclusion.label.toLowerCase().indexOf(value) === 0);
  }

  typeVoyageCompare(voyage1: VoyageOrganise, voyage2: VoyageOrganise): boolean {
    if (voyage1 && voyage2) {
      return voyage1.id === voyage2.id;
    }
    return false;

  }

  typeHotelCompare(hotel1: Hotel, hotel2: Hotel): boolean {
    if (hotel1 && hotel2) {
      return hotel1.id === hotel2.id;
    }
    return false;
  }

  typePromoCompare(promo1: Promo, promo2: Promo): boolean {
    if (promo1 && promo2) {
      return promo1.id === promo2.id;
    }
    return false;
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
}
