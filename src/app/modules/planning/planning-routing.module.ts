import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListPlanningComponent} from './list-planning/list-planning.component';

const routes: Routes = [
  {path: '', component: ListPlanningComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningRoutingModule { }
