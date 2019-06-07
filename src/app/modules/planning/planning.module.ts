import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PlanningRoutingModule} from './planning-routing.module';
import {ListPlanningComponent} from './list-planning/list-planning.component';
import {FormPlanningComponent} from './form-planning/form-planning.component';
import {MaterialModule} from '../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxInputStarRatingModule} from '@ngx-lite/input-star-rating';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DetailPlanningComponent} from './detail-planning/detail-planning.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {NgxLoadingModule} from 'ngx-loading';

@NgModule({
  declarations: [
    ListPlanningComponent,
    FormPlanningComponent,
    DetailPlanningComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    NgxInputStarRatingModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    PlanningRoutingModule
  ],
  entryComponents: [FormPlanningComponent, DetailPlanningComponent]
})
export class PlanningModule {
}
