import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LogComponent} from './modules/log/log.component';

const routes: Routes = [
  {path: 'login', loadChildren: './modules/login/login.module#LoginModule'},
  {path: 'hotels', loadChildren: './modules/hotel/hotel.module#HotelModule'},
  {path: 'profil', loadChildren: './modules/profil/profil.module#ProfilModule'},
  {path: 'admin', loadChildren: './modules/admin/admin.module#AdminModule'},
  {path: 'inclusion', loadChildren: './modules/inclusion/inclusion.module#InclusionModule'},
  {path: 'categorie', loadChildren: './modules/categorie/categorie.module#CategorieModule'},
  {path : 'promotion' , loadChildren: './modules/promo/promo.module#PromoModule'},
  {path: 'planning', loadChildren: './modules/planning/planning.module#PlanningModule'},
  {path: 'voyage', loadChildren: './modules/voyageorganise/voyageorganise.module#VoyageorganiseModule'},
  {path: 'log', component: LogComponent},
  {path: 'home', redirectTo: 'planning'},
  {path: '', redirectTo: 'planning', pathMatch: 'full'},
  // otherwise redirect to home
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
