import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { AccountsPage } from './accounts.page';
import { SavedTrailsPlacesComponent } from './saved-trails-places/saved-trails-places.component';

import { AccountsPageRoutingModule } from './accounts-routing.module';
import { ComponentsModule } from './../../../../shared/components/components.module';

import { PlacesComponentModule } from '../places/components/places-component.module';
import { TrailsComponentModule } from '../trails/components/trails-component.module';
import { AccountInfoItemComponent } from './account-info-item/account-info-item.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    PlacesComponentModule,
    AccountsPageRoutingModule,
    TrailsComponentModule,
  ],
  declarations: [AccountsPage, SavedTrailsPlacesComponent, AccountInfoItemComponent],
  exports: [SavedTrailsPlacesComponent],
  providers: [PhotoViewer],
})
export class AccountsPageModule {}
