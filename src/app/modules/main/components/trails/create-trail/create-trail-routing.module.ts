import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTrailPage } from './create-trail.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTrailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTrailPageRoutingModule {}
