import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ComponentsModule } from './../../../../shared/components/components.module';

import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    ResetPasswordRoutingModule,
  ],
})
export class ResetPasswordModule {}
