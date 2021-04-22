import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';


@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, IonicModule, LandingRoutingModule],
})
export class LandingModule {}
