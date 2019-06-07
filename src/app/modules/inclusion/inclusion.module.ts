import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InclusionRoutingModule } from './inclusion-routing.module';
import {ListInclusionComponent} from './list-inclusion/list-inclusion.component';
import {FormInclusionComponent} from './form-inclusion/form-inclusion.component';
import {MaterialModule} from '../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxInputStarRatingModule} from '@ngx-lite/input-star-rating';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxLoadingModule} from 'ngx-loading';

@NgModule({
  declarations: [
    ListInclusionComponent,
    FormInclusionComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxInputStarRatingModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    InclusionRoutingModule
  ],
  entryComponents: [FormInclusionComponent],
})
export class InclusionModule { }
