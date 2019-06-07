import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromoRoutingModule } from './promo-routing.module';
import { ListPromoComponent } from './list-promo/list-promo.component';
import {MaterialModule} from "../../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxInputStarRatingModule} from "@ngx-lite/input-star-rating";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormPromoComponent} from "./form-promo/form-promo.component";
import { AffectationPromoComponent } from './affectation-promo/affectation-promo.component';
import { DetailPromoComponent } from './detail-promo/detail-promo.component';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";

@NgModule({
  declarations: [
      ListPromoComponent,
    FormPromoComponent,
    AffectationPromoComponent,
    DetailPromoComponent],
  imports: [
    CommonModule,
    PromoRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxInputStarRatingModule,
    NgbModule,
    NgxMatSelectSearchModule
  ],
  entryComponents: [FormPromoComponent,AffectationPromoComponent,DetailPromoComponent]
})
export class PromoModule { }
