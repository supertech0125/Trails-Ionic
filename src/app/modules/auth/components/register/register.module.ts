import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { ComponentsModule } from '../../../../shared/components/components.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    RegisterRoutingModule,
  ],
})
export class RegisterModule {}
