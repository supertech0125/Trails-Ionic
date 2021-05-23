import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { GoogleMapsModule } from '@angular/google-maps';
import { MomentModule } from 'ngx-moment';
import { LongPressModule } from 'ionic-long-press';

import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { FilteringModalComponent } from './filtering-modal/filtering-modal.component';
import { SortModalComponent } from './sort-modal/sort-modal.component';
import { MentionedModalComponent } from './mentioned-modal/mentioned-modal.component';
import { SearchLocationComponent } from './search-location/search-location.component';
import { ExperienceModalComponent } from './experience-modal/experience-modal.component';
import { ContentHeaderViewComponent } from './content-header-view/content-header-view.component';
import { TrailInputComponent } from './trail-input/trail-input.component';
import { TrailButtonComponent } from './trail-button/trail-button.component';
import { TrailTextareaComponent } from './trail-textarea/trail-textarea.component';
import { TrailBadgeComponent } from './trail-badge/trail-badge.component';
import { TrailRatingBadgeComponent } from './trail-rating-badge/trail-rating-badge.component';
import { TrailDistanceComponent } from './trail-distance/trail-distance.component';
import { SavedPlacesDistanceComponent } from './saved-places-distance/saved-places-distance.component';
import { TrailSaveBookmarkComponent } from './trail-save-bookmark/trail-save-bookmark.component';
import { TrailSearchbarComponent } from './trail-searchbar/trail-searchbar.component';
import { TrailSelectComponent } from './trail-select/trail-select.component';
import { TrailSelectingComponent } from './trail-selecting/trail-selecting.component';
import { CardMapComponent } from './card-map/card-map.component';
import { LocationPermissionComponent } from './location-permission/location-permission.component';
import { TrailPlacesItemComponent } from './trail-places-item/trail-places-item.component';
import { CardMapMarkerComponent } from './card-map-marker/card-map-marker.component';
import { TrailShareButtonComponent } from './trail-share-button/trail-share-button.component';
import { SearchLocationModalComponent } from './search-location-modal/search-location-modal.component';
import { TrailPlacesRatingItemComponent } from './trail-places-rating-item/trail-places-rating-item.component';
import { TrailRatingCommentsComponent } from './trail-rating-comments/trail-rating-comments.component';
import { CardNewMapComponent } from './card-new-map/card-new-map.component';
import { SearchLocationOlComponent } from './search-location-ol/search-location-ol.component';
import { OlMapComponent } from './ol-map/ol-map.component';
import { DirectivesModule } from '../directives/directives.module';
import { TrailPlacesNoResultFoundComponent } from './trail-places-no-result-found/trail-places-no-result-found.component';
import { MobileToolbarHeaderComponent } from './mobile-toolbar-header/mobile-toolbar-header.component';
import { DesktopToolbarHeaderComponent } from './desktop-toolbar-header/desktop-toolbar-header.component';
import { TrailSelectAllNoneComponent } from './trail-select-all-none/trail-select-all-none.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

const COMPONENTS = [
  FilterModalComponent,
  FilteringModalComponent,
  SortModalComponent,
  MentionedModalComponent,
  SearchLocationComponent,
  ExperienceModalComponent,
  ContentHeaderViewComponent,
  TrailInputComponent,
  TrailButtonComponent,
  TrailTextareaComponent,
  TrailBadgeComponent,
  TrailRatingBadgeComponent,
  TrailDistanceComponent,
  SavedPlacesDistanceComponent,
  TrailSaveBookmarkComponent,
  TrailSearchbarComponent,
  TrailSelectComponent,
  TrailSelectingComponent,
  CardMapComponent,
  LocationPermissionComponent,
  TrailPlacesItemComponent,
  CardMapMarkerComponent,
  TrailShareButtonComponent,
  SearchLocationModalComponent,
  TrailPlacesRatingItemComponent,
  TrailRatingCommentsComponent,
  CardNewMapComponent,
  SearchLocationOlComponent,
  OlMapComponent,
  TrailPlacesNoResultFoundComponent,
  MobileToolbarHeaderComponent,
  DesktopToolbarHeaderComponent,
  TrailSelectAllNoneComponent,
  LoadingSpinnerComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    // GoogleMapsModule,
    MomentModule,
    DirectivesModule,
    LongPressModule,
  ],
  exports: [...COMPONENTS],
})
export class ComponentsModule {}
