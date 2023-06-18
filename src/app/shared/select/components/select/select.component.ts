import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { DOWN_ARROW, ENTER, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, ReplaySubject, filter, map, shareReplay, tap, timer } from 'rxjs';
import { OptionTemplateDirective } from '../../directives/option-template.directive';
import { HightlightableOptionDirective } from '../../directives/hightlightable-option.directive';
import { SelectDataSource } from '../../services/select.data-source';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: SelectComponent }],
})
export class SelectComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input() placeholder?: string;

  @ViewChild('overlayContainer', { static: true }) overlayTemplate!: TemplateRef<void>;
  @ContentChild(OptionTemplateDirective, { static: true }) optionTemplateDirective!: OptionTemplateDirective;
  @ViewChildren(HightlightableOptionDirective) optionElsQuery!: QueryList<HightlightableOptionDirective>;

  private selectDataSource = inject(SelectDataSource);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected showSpinner$ = new BehaviorSubject(true);
  protected selectedValue$ = new ReplaySubject<unknown>(1);
  protected disabled$ = new BehaviorSubject(false);
  protected searchedValue$ = new BehaviorSubject<string>('');
  protected options$ = this.selectDataSource.getOptions(this.searchedValue$).pipe(
    tap(() => this.showSpinner$.next(false)),
    shareReplay(1),
  );
  private overlayRef: OverlayRef | null = null;
  private emitValue = Function.prototype;
  private markAsTouched = Function.prototype;
  private keyManager!: ActiveDescendantKeyManager<HightlightableOptionDirective>;

  ngAfterViewInit(): void {
    this.keyManager = new ActiveDescendantKeyManager(this.optionElsQuery).withHomeAndEnd().withWrap().withPageUpDown();
  }

  handleButtonKeydown($event: KeyboardEvent): void {
    const keyCode = $event.keyCode;
    const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;

    if (isArrowKey) {
      this.openOverlay();
    }
  }

  openOverlay(): void {
    if (this.overlayRef === null) {
      this.overlayRef = this.createOverlay();

      this.overlayRef.outsidePointerEvents().subscribe(() => {
        this.overlayRef?.detach();
        this.markAsTouched();
      });

      this.overlayRef
        .keydownEvents()
        .pipe(
          map((e) => e.key),
          filter((key) => key === 'Escape'),
        )
        .subscribe((e) => {
          this.overlayRef?.detach();
          this.markAsTouched();
        });
    }

    const portal = new TemplatePortal(this.overlayTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  selectOption(option: unknown): void {
    this.selectedValue$.next(option);

    const bindedValue = this.selectDataSource.getBindedValue(option);
    this.emitValue(bindedValue);

    // detach on a next tick
    // otherwise on ENTER overlay is still enter
    timer(1).subscribe({
      next: () => {
        this.overlayRef?.detach();
        this.keyManager.setActiveItem(-1);
      },
    });
  }

  handleInput($event: Event): void {
    const target = $event.target as HTMLInputElement;
    const value = target.value;

    if (value === this.searchedValue$.value) {
      return;
    }

    this.keyManager.setActiveItem(-1);
    this.searchedValue$.next(value);
    this.showSpinner$.next(true);
  }

  handleInputKeydown($event: KeyboardEvent): void {
    const key = $event.keyCode;
    const activeItem = this.keyManager.activeItem;
    if (key === ENTER && activeItem !== null) {
      this.selectOption(activeItem.value);
    } else {
      this.keyManager.onKeydown($event);
      this.keyManager.activeItem?.scrollIntoElement();
    }
  }

  writeValue(obj: any): void {
    this.selectedValue$.next(obj);
  }

  registerOnChange(fn: any): void {
    this.emitValue = fn;
  }

  registerOnTouched(fn: any): void {
    this.markAsTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled$.next(isDisabled);
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.showSpinner$.complete();
    this.selectedValue$.complete();
    this.disabled$.complete();
    this.searchedValue$.complete();
    this.keyManager.destroy();
  }

  private createOverlay(): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' }]);

    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: '',
      positionStrategy,
      minWidth: this.elementRef.nativeElement.clientWidth,
    });
  }
}
