import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListCategorieComponent} from './list-categorie/list-categorie.component';

const routes: Routes = [
  {path: '', component: ListCategorieComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategorieRoutingModule { }
