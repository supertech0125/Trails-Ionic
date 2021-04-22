import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

import { PlacesPageRoutingModule } from './places-routing.module';
import { ComponentsModule } from './../../../../shared/components/components.module';

import { PlacesPage } from './places.page';

import { PlacesComponentModule } from './components/places-component.module';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    PlacesPageRoutingModule,
    PlacesComponentModule,
  ],
  declarations: [PlacesPage],
  providers: [PhotoViewer, CallNumber, LaunchNavigator],
})
export class PlacesPageModule {}
