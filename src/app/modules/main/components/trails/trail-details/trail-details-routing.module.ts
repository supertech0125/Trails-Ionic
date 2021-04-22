import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrailDetailsComponent } from './trail-details.component';

const routes: Routes = [{ path: '', component: TrailDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrailDetailsRoutingModule { }
