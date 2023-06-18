import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './components/select/select.component';
import { FocusDirective } from './directives/focus.directive';
import { OptionTemplateDirective } from './directives/option-template.directive';
import { OptionWrapperDirective } from './directives/option-wrapper.directive';

@NgModule({
  declarations: [SelectComponent, FocusDirective, OptionTemplateDirective, OptionWrapperDirective],
  imports: [CommonModule],
  exports: [SelectComponent, OptionTemplateDirective],
})
export class SelectModule {}
