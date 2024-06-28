import { Component, ElementRef, booleanAttribute, inject, input, output, viewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { ScrollbarButtonType } from '../scrollbar-button-type';
import { CommonModule } from '@angular/common';
import { ScrollbarComponent } from '../scrollbar/scrollbar.component';
import { ButtonIcon } from '../button-icon';

@Component({
  selector: 'scrollbar-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scrollbar-button.component.html',
  styleUrls: ['./scrollbar-button.component.scss', './scrollbar-button-top.scss', './scrollbar-button-right.scss', './scrollbar-button-bottom.scss', './scrollbar-button-left.scss']
})
export class ScrollbarButtonComponent {
  // Input
  public firstButton = input(false, { transform: booleanAttribute });

  // Output
  public pressedEvent = output<number>();

  // Private
  protected icon!: string;
  private isVertical!: boolean;
  private borderRadius!: number;
  protected borderWidth!: string;
  protected isDisabled!: boolean;
  protected iconFontSize!: string;
  protected buttonType!: ScrollbarButtonType;
  protected buttonPressListener!: Subscription;
  private scrollbar = inject(ScrollbarComponent);
  protected ScrollbarButtonType = ScrollbarButtonType;
  private button = viewChild<ElementRef<HTMLElement>>('button');



  ngOnInit() {
    this.setAxis();
    this.setType();
    this.setIcon();
    this.setWidth();
    this.setBorderWidth();
  }



  private setAxis(): void {
    this.isVertical = this.scrollbar.isVertical();
  }



  private setType(): void {
    if (this.isVertical) {
      this.buttonType = this.firstButton() ? ScrollbarButtonType.Top : ScrollbarButtonType.Bottom;
    } else {
      this.buttonType = this.firstButton() ? ScrollbarButtonType.Left : ScrollbarButtonType.Right;
    }
  }



  private setIcon() {
    this.scrollbar.buttonIconsAssignedEvent.subscribe((icon: ButtonIcon) => {
      this.iconFontSize = icon.fontSize;
      switch (this.buttonType) {
        case ScrollbarButtonType.Top:
          this.icon = icon.top;
          break;

        case ScrollbarButtonType.Left:
          this.icon = icon.left;
          break;

        case ScrollbarButtonType.Right:
          this.icon = icon.right;
          break;

        case ScrollbarButtonType.Bottom:
          this.icon = icon.bottom;
          break;
      }
    })
  }



  private setWidth(): void {
    this.scrollbar.widthAssignedEvent.subscribe((width: string) => {
      this.button()?.nativeElement.style.setProperty('--button-width', width);
      const buttonWidth = this.isVertical ? parseInt(getComputedStyle(this.button()?.nativeElement!).width) : parseInt(getComputedStyle(this.button()?.nativeElement!).height);
      this.borderRadius = Math.ceil((buttonWidth - 1 - 1) / 2);
    })
  }



  private setBorderWidth(): void {
    this.scrollbar.buttonBorderWidthAssignedEvent.subscribe((borderWidth: string) => {
      if(borderWidth === '0' || borderWidth.length === 0) borderWidth = '0px';
      this.button()?.nativeElement.style.setProperty('--border-width', borderWidth);
    })
  }



  protected onMouseDown(): void {
    // if (!this.isDisabled) {
    //   this.pressedEvent.emit(this.buttonType === ScrollbarButtonType.Top || this.buttonType === ScrollbarButtonType.Left ? -1 : 1);

    //   this.buttonPressListener = timer(500, 40).subscribe(() => {
    //     this.pressedEvent.emit(this.buttonType === ScrollbarButtonType.Top || this.buttonType === ScrollbarButtonType.Left ? -1 : 1);
    //   });
    // }

    console.log('hello')
  }



  public getSize() {
    return (this.isVertical ? this.button()?.nativeElement.offsetHeight : this.button()?.nativeElement.offsetWidth)! - this.borderRadius;
  }



  public setState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }



  public getState(): Boolean {
    return this.isDisabled;
  }
}