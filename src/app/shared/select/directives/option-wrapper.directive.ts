import { Highlightable } from '@angular/cdk/a11y';
import { Directive, ElementRef, HostBinding, Input, inject } from '@angular/core';

@Directive({
  selector: '[optionWrapper]',
})
export class OptionWrapperDirective implements Highlightable {
  @Input({ required: true, alias: 'optionWrapper' }) value: unknown;
  private elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  @HostBinding('class.highlight') highlight = false;

  setActiveStyles(): void {
    this.highlight = true;
  }

  setInactiveStyles(): void {
    this.highlight = false;
  }

  disabled?: boolean | undefined;
}
