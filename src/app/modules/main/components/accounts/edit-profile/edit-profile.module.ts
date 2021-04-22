import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';
import { ComponentsModule } from './../../../../../shared/components/components.module';

import { EditProfilePage } from './edit-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    EditProfilePageRoutingModule,
  ],
  declarations: [EditProfilePage],
})
export class EditProfilePageModule {}
