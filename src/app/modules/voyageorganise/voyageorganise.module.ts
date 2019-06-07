import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VoyageorganiseComponent} from './voyage/voyageorganise.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material/material.module';
import {NgxLoadingModule} from 'ngx-loading';
import {VoyageorganiseRoutingModule} from './voyageorganise-routing.module';
import {AjoutVoyageComponent} from './ajout-voyage/ajout-voyage.component';
import {MatFileUploadModule} from '@webacad/ng-mat-file-upload';
import {DetailVoyageComponent} from './detail-voyage/detail-voyage.component';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';
import {EditVoyageComponent} from './edit-voyage/edit-voyage.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerModule} from 'ngx-spinner';
import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';




@NgModule({
  declarations: [VoyageorganiseComponent,
                 AjoutVoyageComponent,
                 DetailVoyageComponent,
                 EditVoyageComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatFileUploadModule,
    ReactiveFormsModule,
    VoyageorganiseRoutingModule,
    NgxLoadingModule.forRoot({}),
    NgxHmCarouselModule,
    NgbModule,
    NgbModule.forRoot(),
      NgxSpinnerModule,
      Ng4LoadingSpinnerModule.forRoot(),
  ],
    // schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
    entryComponents: [AjoutVoyageComponent, DetailVoyageComponent, EditVoyageComponent]
})
export class VoyageorganiseModule {
}
