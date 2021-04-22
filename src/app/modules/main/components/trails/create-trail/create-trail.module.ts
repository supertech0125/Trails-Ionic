import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTrailPageRoutingModule } from './create-trail-routing.module';
import { ComponentsModule } from './../../../../../shared/components/components.module';

import { CreateTrailPage } from './create-trail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CreateTrailPageRoutingModule,
  ],
  declarations: [CreateTrailPage],
})
export class CreateTrailPageModule {}
