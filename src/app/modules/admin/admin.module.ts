import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxLoadingModule} from 'ngx-loading';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminComponent} from './admin/admin.component';
import {MaterialModule} from '../../material/material.module';
import {FormAdminComponent} from './form-admin/form-admin.component';
import {EditAdminComponent} from './edit-admin/edit-admin.component';
import {DetailAdminComponent} from './detail-admin/detail-admin.component';




@NgModule({
    declarations: [
        AdminComponent,
        FormAdminComponent,
        EditAdminComponent,
        DetailAdminComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        NgxLoadingModule.forRoot({}),
    ],
    entryComponents: [FormAdminComponent, EditAdminComponent, DetailAdminComponent]
})
export class AdminModule {
}
