import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LongPressDirective } from './long-press.directive';
import { SelectAllWithButtonDirective } from './select-all-with-button-directive';

const DIRECTIVES = [LongPressDirective, SelectAllWithButtonDirective];

@NgModule({
  declarations: [...DIRECTIVES],
  imports: [CommonModule],
  exports: [...DIRECTIVES],
})
export class DirectivesModule {}
