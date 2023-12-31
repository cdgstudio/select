import { Highlightable } from '@angular/cdk/a11y';
import { Directive, ElementRef, HostBinding, Input, inject } from '@angular/core';

@Directive({
  selector: '[hightlightableOption]',
})
export class HightlightableOptionDirective implements Highlightable {
  @Input({ required: true, alias: 'hightlightableOption' }) value!: unknown;

  @HostBinding('class.highlight') highlight = false;

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  setActiveStyles(): void {
    this.highlight = true;
  }

  setInactiveStyles(): void {
    this.highlight = false;
  }

  disabled?: boolean | undefined;

  scrollIntoElement(): void {
    this.elementRef.nativeElement.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }
}
