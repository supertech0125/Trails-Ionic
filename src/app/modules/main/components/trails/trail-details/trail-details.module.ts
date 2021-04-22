import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TrailDetailsRoutingModule } from './trail-details-routing.module';
import { TrailDetailsComponent } from './trail-details.component';
import { TrailsComponentModule } from '../components/trails-component.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { TrailDetailLoadingSkeletonComponent } from './trail-detail-loading-skeleton/trail-detail-loading-skeleton.component';

@NgModule({
  declarations: [TrailDetailsComponent, TrailDetailLoadingSkeletonComponent],
  imports: [
    CommonModule,
    TrailDetailsRoutingModule,
    IonicModule,
    TrailsComponentModule,
    ComponentsModule,
  ],
})
export class TrailDetailsModule {}
