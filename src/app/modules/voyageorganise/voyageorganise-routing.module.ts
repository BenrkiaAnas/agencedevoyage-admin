import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {VoyageorganiseComponent} from './voyage/voyageorganise.component';
import {EditVoyageComponent} from './edit-voyage/edit-voyage.component';

const routes: Routes = [
    {path: '', component: VoyageorganiseComponent},

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VoyageorganiseRoutingModule { }
