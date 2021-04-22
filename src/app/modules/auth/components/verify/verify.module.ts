import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CodeInputModule } from 'angular-code-input';

import { VerifyRoutingModule } from './verify-routing.module';
import { VerifyComponent } from './verify.component';
import { ComponentsModule } from '../../../../shared/components/components.module';

@NgModule({
  declarations: [VerifyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CodeInputModule,
    ComponentsModule,
    VerifyRoutingModule,
  ],
})
export class VerifyModule {}
