import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StarRatingModule } from 'ionic5-star-rating';

import { RateProfilePageRoutingModule } from './rate-profile-routing.module';
import { ComponentsModule } from './../../../../shared/components/components.module';

import { RateProfilePage } from './rate-profile.page';
import { RateProfileSuccessComponent } from './rate-profile-success/rate-profile-success.component';
import { RateProfileLoadingSkeletonComponent } from './rate-profile-loading-skeleton/rate-profile-loading-skeleton.component';
import { RateProfileUploaderComponent } from './rate-profile-uploader/rate-profile-uploader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    StarRatingModule,
    RateProfilePageRoutingModule,
  ],
  declarations: [
    RateProfilePage,
    RateProfileSuccessComponent,
    RateProfileLoadingSkeletonComponent,
    RateProfileUploaderComponent,
  ],
  exports: [RateProfileSuccessComponent],
})
export class RateProfilePageModule {}
