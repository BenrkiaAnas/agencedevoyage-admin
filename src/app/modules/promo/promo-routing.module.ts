import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListPromoComponent} from "./list-promo/list-promo.component";

const routes: Routes = [
  {path: '', component: ListPromoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromoRoutingModule { }
