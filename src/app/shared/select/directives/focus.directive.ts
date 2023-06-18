import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';

@Directive({
  selector: '[appFocus]',
})
export class FocusDirective implements AfterViewInit, OnDestroy {
  private previousActiveElement: Element | null = null;
  private document = inject(DOCUMENT);

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnDestroy(): void {
    if (this.previousActiveElement instanceof HTMLElement) {
      this.previousActiveElement.focus();
    }
  }

  ngAfterViewInit(): void {
    this.previousActiveElement = this.document.activeElement;
    this.elementRef.nativeElement.focus();
  }
}
