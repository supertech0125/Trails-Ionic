import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TrailCardComponent } from './trail-card/trail-card.component';
import { TrailLoadingSkeletonComponent } from './trail-loading-skeleton/trail-loading-skeleton.component';

import { ComponentsModule } from './../../../../../shared/components/components.module';
import { PlaceTrailDistanceComponent } from './place-trail-distance/place-trail-distance.component';
import { TrailCardUserItemComponent } from './trail-card-user-item/trail-card-user-item.component';
import { TrailCardDistanceItemComponent } from './trail-card-distance-item/trail-card-distance-item.component';
import { TrailThemeComponent } from './trail-theme/trail-theme.component';

const COMPONENTS = [
  TrailCardComponent,
  TrailLoadingSkeletonComponent,
  PlaceTrailDistanceComponent,
  TrailCardUserItemComponent,
  TrailCardDistanceItemComponent,
  TrailThemeComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ComponentsModule, IonicModule],
  exports: [...COMPONENTS],
})
export class TrailsComponentModule {}
