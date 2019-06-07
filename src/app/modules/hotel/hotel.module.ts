import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelRoutingModule } from './hotel-routing.module';
import {ListHotelComponent} from './list-hotel/list-hotel.component';
import {FormHotelComponent} from './form-hotel/form-hotel.component';
import {MaterialModule} from '../../material/material.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxInputStarRatingModule} from '@ngx-lite/input-star-rating';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxLoadingModule} from 'ngx-loading';

@NgModule({
  declarations: [
    ListHotelComponent,
    FormHotelComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxInputStarRatingModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    HotelRoutingModule,
  ],
  entryComponents: [FormHotelComponent]
})
export class HotelModule { }
