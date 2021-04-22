import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RatingsProfilePage } from './ratings-profile.page';

const routes: Routes = [
  {
    path: '',
    component: RatingsProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RatingsProfilePageRoutingModule {}
