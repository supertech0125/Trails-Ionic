import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RatingsProfilePageRoutingModule } from './ratings-profile-routing.module';
import { ComponentsModule } from './../../../../shared/components/components.module';

import { RatingsProfilePage } from './ratings-profile.page';
import { NoReviewsComponent } from './components/no-reviews/no-reviews.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RatingsProfilePageRoutingModule
  ],
  declarations: [RatingsProfilePage, NoReviewsComponent]
})
export class RatingsProfilePageModule {}
