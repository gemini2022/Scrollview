import { Component, ElementRef, OutputRefSubscription, Renderer2, effect, inject, input, output, viewChild, viewChildren } from '@angular/core';
import { ScrollbarComponent } from '../scrollbar/scrollbar.component';
import { CommonModule } from '@angular/common';
import { ScrollviewUtility } from '../scrollview-utility';
import { ScrollbarProperties } from '../scrollbar-properties';

@Component({
  selector: 'scrollview',
  standalone: true,
  imports: [CommonModule, ScrollbarComponent],
  templateUrl: './scrollview.component.html',
  styleUrl: './scrollview.component.scss'
})
export class ScrollviewComponent {
  // Inputs
  public width = input<string>();
  public height = input<string>();
  public scrollbarWidth = input<string>();
  public scrollbarButtonIconTop = input<string>();
  public scrollbarButtonIconLeft = input<string>();
  public scrollbarButtonIconRight = input<string>();
  public scrollbarTrackBorderWidth = input<string>();
  public scrollbarButtonIconBottom = input<string>();
  public scrollbarThumbBorderWidth = input<string>();
  public scrollbarButtonBorderWidth = input<string>();
  public scrollbarButtonIconFontSize = input<string>();

  // Outputs
  public scrolledEvent = output();
  public verticalOverflowedEvent = output<boolean>();
  public horizontalOverflowedEvent = output<boolean>();

  // Public
  public scrollTop!: number;
  public scrollLeft!: number;
  public get scrollWidth(): number { return this.contentContainer()?.nativeElement.scrollWidth! };
  public get scrollHeight(): number { return this.contentContainer()?.nativeElement.scrollHeight! };

  // Private
  private shiftKeyDown!: boolean;
  private renderer = inject(Renderer2);
  protected verticalOverflow!: boolean;
  protected horizontalOverflow!: boolean;
  private removeKeyupListener!: () => void;
  protected doubleOverflow: boolean = false;
  private removeKeydownListener!: () => void;
  private scrollbars = viewChildren(ScrollbarComponent);
  private contentContainer = viewChild<ElementRef<HTMLElement>>('content');
  private scrollbarScrollSubscription: OutputRefSubscription[] = new Array(2);
  protected scrollbarProperties: ScrollbarProperties = new ScrollbarProperties();

  constructor() {
    effect(() => {
      this.setScrollbarsScrollSubscription();
    })
  }



  private ngOnInit(): void {
    this.setScrollbarProperties();
    ScrollviewUtility.setVerticalColors();
  }



  private setScrollbarProperties() {
    this.scrollbarProperties.width = this.scrollbarWidth() ? this.scrollbarWidth()! : getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-width');
    this.scrollbarProperties.buttonIcon.top = this.scrollbarButtonIconTop() ? this.scrollbarButtonIconTop()! : getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-button-icon-top');
    this.scrollbarProperties.buttonIcon.left = this.scrollbarButtonIconLeft() ? this.scrollbarButtonIconLeft()! : getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-button-icon-left');
    this.scrollbarProperties.buttonIcon.right = this.scrollbarButtonIconRight() ? this.scrollbarButtonIconRight()! : getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-button-icon-right');
    this.scrollbarProperties.buttonIcon.bottom = this.scrollbarButtonIconBottom() ? this.scrollbarButtonIconBottom()! : getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-button-icon-bottom');
    this.scrollbarProperties.trackBorderWidth = this.scrollbarTrackBorderWidth() ? this.scrollbarTrackBorderWidth()! : getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-track-border-width');
    this.scrollbarProperties.thumbBorderWidth = this.scrollbarThumbBorderWidth() ? this.scrollbarThumbBorderWidth()! : getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-thumb-border-width');
    this.scrollbarProperties.buttonBorderWidth = this.scrollbarButtonBorderWidth() ? this.scrollbarButtonBorderWidth()! : getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-button-border-width');
    this.scrollbarProperties.buttonIcon.fontSize = this.scrollbarButtonIconFontSize() ? this.scrollbarButtonIconFontSize()! : getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-button-icon-font-size');
  }



  protected onOverflow(): void {
    this.setVerticalOverflow();
    this.setHorizontalOverflow();
    this.updateScrollbars();
  }



  private setScrollbarsScrollSubscription(): void {
    this.removeScrollbarScrollSubscription();
    this.doubleOverflow = this.scrollbars().length === 2;

    if (this.scrollbars().length > 0) {
      this.scrollbars().forEach((scrollbar, index) => {
        const isVertical = index === 0 && (!this.horizontalOverflow || this.doubleOverflow);

        scrollbar.setProperties(this.scrollbarProperties);
        this.scrollbarScrollSubscription[index] = scrollbar.scrolledEvent.subscribe(() => {
          const offset = isVertical ? 'offsetTop' : 'offsetLeft';
          this[isVertical ? 'scrollTop' : 'scrollLeft'] = Math.abs(this.contentContainer()?.nativeElement[offset]!);
          this.scrolledEvent.emit();
        });
      })
    }
  }



  private setVerticalOverflow(): void {
    if (!this.verticalOverflow && this.contentContainer()?.nativeElement.scrollHeight! > this.contentContainer()?.nativeElement.clientHeight!) {
      this.verticalOverflow = true;
      this.verticalOverflowedEvent.emit(true);
    }
    if (this.verticalOverflow && this.contentContainer()?.nativeElement.scrollHeight! <= this.contentContainer()?.nativeElement.clientHeight!) {
      this.verticalOverflow = false;
      this.verticalOverflowedEvent.emit(false);
      this.renderer.setStyle(this.contentContainer()!.nativeElement, 'top', '0');
    }
  }



  private setHorizontalOverflow() {
    if (!this.horizontalOverflow && this.contentContainer()?.nativeElement.scrollWidth! > this.contentContainer()?.nativeElement.offsetWidth!) {
      this.addKeyListeners();
      this.horizontalOverflow = true;
      this.horizontalOverflowedEvent.emit(true);
    }
    if (this.horizontalOverflow && this.contentContainer()?.nativeElement.scrollWidth! <= this.contentContainer()?.nativeElement.offsetWidth!) {
      this.removeKeyListeners();
      this.horizontalOverflow = false;
      this.horizontalOverflowedEvent.emit(false);
      this.renderer.setStyle(this.contentContainer()!.nativeElement, 'left', '0');
    }
  }



  private updateScrollbars(): void {
    if (this.scrollbars().length > 0) {
      if (!this.doubleOverflow) {
        this.scrollbars()[0]?.update(this.contentContainer()?.nativeElement!);

      } else {
        this.scrollbars()[0]?.update(this.contentContainer()?.nativeElement!);
        this.scrollbars()[1]?.update(this.contentContainer()?.nativeElement!);
      }
    }
  }



  private addKeyListeners(): void {
    this.removeKeyupListener = this.renderer.listen('window', 'keyup', (e: KeyboardEvent) => { if (e.key === 'Shift') this.shiftKeyDown = false; });
    this.removeKeydownListener = this.renderer.listen('window', 'keydown', (e: KeyboardEvent) => { if (e.key === 'Shift') this.shiftKeyDown = true; });
  }



  private removeKeyListeners(): void {
    if (this.removeKeyupListener) this.removeKeyupListener();
    if (this.removeKeydownListener) this.removeKeydownListener();
  }



  protected onMouseWheel(e: WheelEvent): void {
    e.preventDefault();
    const scrollbarIndex = this.doubleOverflow && this.shiftKeyDown ? 1 : 0;

    if ((!this.doubleOverflow && this.verticalOverflow) ||
      (!this.doubleOverflow && this.horizontalOverflow && this.shiftKeyDown) ||
      (this.doubleOverflow && this.shiftKeyDown) ||
      (this.doubleOverflow && !this.shiftKeyDown)) {
      const direction = e.deltaY > 0 ? 1 : -1;
      this.scrollbars()[scrollbarIndex].scrollThumb(direction);
    }
  }



  public getScrollbarWidth(): string {
    return this.scrollbarProperties.width;
  }



  private removeScrollbarScrollSubscription(): void {
    if (this.scrollbarScrollSubscription[0]) this.scrollbarScrollSubscription[0].unsubscribe();
    if (this.scrollbarScrollSubscription[1]) this.scrollbarScrollSubscription[1].unsubscribe();
  }



  private ngOnDestroy(): void {
    this.removeKeyListeners();
    this.removeScrollbarScrollSubscription();
  }
}