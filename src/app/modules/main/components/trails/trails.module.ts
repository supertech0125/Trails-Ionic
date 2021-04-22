import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TrailsPage } from './trails.page';
import { AddStepsComponent } from './add-steps/add-steps.component';

import { TrailsPageRoutingModule } from './trails-routing.module';
import { ComponentsModule } from './../../../../shared/components/components.module';
import { TrailsComponentModule } from './components/trails-component.module';

import { CreateTrailAlertComponent } from './create-trail-alert/create-trail-alert.component';
import { CreateTrailSuccessComponent } from './create-trail-success/create-trail-success.component';
import { ViewAllTrailsComponent } from './view-all-trails/view-all-trails.component';
import { TrailPlaceInfoModalComponent } from './trail-place-info-modal/trail-place-info-modal.component';
import { PlacesComponentModule } from '../places/components/places-component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TrailsPageRoutingModule,
    TrailsComponentModule,
    PlacesComponentModule,
    ComponentsModule,
  ],
  declarations: [
    TrailsPage,
    AddStepsComponent,
    CreateTrailAlertComponent,
    CreateTrailSuccessComponent,
    ViewAllTrailsComponent,
    TrailPlaceInfoModalComponent,
  ],
  exports: [
    AddStepsComponent,
    CreateTrailAlertComponent,
    CreateTrailSuccessComponent,
    TrailPlaceInfoModalComponent,
  ],
})
export class TrailsPageModule {}
