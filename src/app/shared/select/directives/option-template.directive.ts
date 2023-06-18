import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appOptionTemplate]',
})
export class OptionTemplateDirective<T = unknown> {
  constructor(public template: TemplateRef<{ $implicit: T }>) {}
}
