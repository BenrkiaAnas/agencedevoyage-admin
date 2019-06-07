import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategorieRoutingModule } from './categorie-routing.module';
import {MaterialModule} from '../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxInputStarRatingModule} from '@ngx-lite/input-star-rating';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ListCategorieComponent} from './list-categorie/list-categorie.component';
import {FormCategorieComponent} from './form-categorie/form-categorie.component';
import {NgxLoadingModule} from 'ngx-loading';

@NgModule({
  declarations: [
    ListCategorieComponent,
    FormCategorieComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxInputStarRatingModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    CategorieRoutingModule
  ],
  entryComponents: [FormCategorieComponent]
})
export class CategorieModule { }
