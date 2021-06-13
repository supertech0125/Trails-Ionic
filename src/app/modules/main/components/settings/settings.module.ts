import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';
import { ComponentsModule } from './../../../../shared/components/components.module';

import { SettingsPage } from './settings.page';
import { UnitComponent } from './unit/unit.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SettingsPageRoutingModule,
  ],
  declarations: [SettingsPage, UnitComponent, TermsComponent, PrivacyPolicyComponent],
})
export class SettingsPageModule {}
