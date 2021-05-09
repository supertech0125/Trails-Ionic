import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from './../../../../../shared/components/components.module';

import { PlaceContactInfoComponent } from './place-contact-info/place-contact-info.component';
import { PlaceCardComponent } from './place-card/place-card.component';
import { PlaceTrailCardComponent } from './place-trail-card/place-trail-card.component';
import { PlaceServicesComponent } from './place-services/place-services.component';
import { PlacesAmbianceComponent } from './places-ambiance/places-ambiance.component';
import { PlacesMentionedComponent } from './places-mentioned/places-mentioned.component';
import { PlacesLoadingSkeletonComponent } from './places-loading-skeleton/places-loading-skeleton.component';
import { PlaceContactInfoAltComponent } from './place-contact-info-alt/place-contact-info-alt.component';
import { PlaceCardPhotoComponent } from './place-card-photo/place-card-photo.component';
import { StarRatingModule } from 'ionic5-star-rating';

@NgModule({
  declarations: [
    PlaceContactInfoComponent,
    PlaceCardComponent,
    PlaceTrailCardComponent,
    PlaceServicesComponent,
    PlacesAmbianceComponent,
    PlacesMentionedComponent,
    PlacesLoadingSkeletonComponent,
    PlaceContactInfoAltComponent,
    PlaceCardPhotoComponent,
  ],
  imports: [CommonModule, IonicModule, ComponentsModule, StarRatingModule],
  exports: [
    PlaceContactInfoComponent,
    PlaceCardComponent,
    PlaceTrailCardComponent,
    PlaceServicesComponent,
    PlacesAmbianceComponent,
    PlacesMentionedComponent,
    PlacesLoadingSkeletonComponent,
  ],
})
export class PlacesComponentModule {}
