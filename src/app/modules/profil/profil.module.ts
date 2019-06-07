import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfilRoutingModule} from './profil-routing.module';
import {ProfilComponent} from './profil/profil.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxLoadingModule} from 'ngx-loading';



@NgModule({
    declarations: [
        ProfilComponent
    ],
    imports: [
        CommonModule,
        ProfilRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxLoadingModule.forRoot({}),
    ]
})
export class ProfilModule {
}
