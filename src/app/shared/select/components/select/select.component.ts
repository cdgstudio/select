import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { ENTER } from '@angular/cdk/keycodes';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, ReplaySubject, filter, map, shareReplay, tap } from 'rxjs';
import { OptionTemplateDirective } from '../../directives/option-template.directive';
import { OptionWrapperDirective } from '../../directives/option-wrapper.directive';
import { SelectDataSource } from '../../services/select.data-source';

/**
 * @todo
 * * Hightlight selected item
 * * Run in next check closing modal
 *
 */

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
  @ViewChildren(OptionWrapperDirective) optionElsQuery!: QueryList<OptionWrapperDirective>;

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
  private keyManager!: ActiveDescendantKeyManager<OptionWrapperDirective>;

  ngAfterViewInit(): void {
    this.keyManager = new ActiveDescendantKeyManager(this.optionElsQuery).withHomeAndEnd().withWrap().withPageUpDown();
  }

  openOverlay(): void {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)

      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 10 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: 10 },
      ]);

    if (this.overlayRef === null) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: '',
        positionStrategy,
        minWidth: this.elementRef.nativeElement.clientWidth,
      });

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
    this.emitValue(option);

    setTimeout(() => {
      this.overlayRef?.detach();
    }, 0);
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

  handleKeydown($event: KeyboardEvent): void {
    const key = $event.keyCode;
    const activeItem = this.keyManager.activeItem;
    if (key === ENTER && activeItem !== null) {
      this.selectOption(activeItem.value);
    } else {
      this.keyManager.onKeydown($event);
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
}
