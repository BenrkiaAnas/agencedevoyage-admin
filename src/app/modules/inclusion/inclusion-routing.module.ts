import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListInclusionComponent} from './list-inclusion/list-inclusion.component';

const routes: Routes = [
  {path: '', component: ListInclusionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InclusionRoutingModule { }
