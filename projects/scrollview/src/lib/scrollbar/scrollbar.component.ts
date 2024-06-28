import { Component, Renderer2, booleanAttribute, inject, input, output, viewChild, viewChildren } from '@angular/core';
import { ScrollbarButtonComponent } from '../scrollbar-button/scrollbar-button.component';
import { ScrollbarThumbComponent } from '../scrollbar-thumb/scrollbar-thumb.component';
import { ScrollbarTrackComponent } from '../scrollbar-track/scrollbar-track.component';
import { ButtonIcon } from '../button-icon';
import { ScrollbarProperties } from '../scrollbar-properties';

@Component({
  selector: 'scrollbar',
  standalone: true,
  imports: [ScrollbarTrackComponent, ScrollbarButtonComponent, ScrollbarThumbComponent],
  templateUrl: './scrollbar.component.html',
  styleUrl: './scrollbar.component.scss'
})
export class ScrollbarComponent {
  // Input
  public isVertical = input(false, { transform: booleanAttribute });

  // Output
  public scrolledEvent = output();
  public widthAssignedEvent = output<string>();
  public buttonIconsAssignedEvent = output<ButtonIcon>();
  public trackBorderWidthAssignedEvent = output<string>();
  public thumbBorderWidthAssignedEvent = output<string>();
  public buttonBorderWidthAssignedEvent = output<string>();

  // Private
  private renderer = inject(Renderer2);
  private track = viewChild(ScrollbarTrackComponent);
  private thumb = viewChild(ScrollbarThumbComponent);
  private buttons = viewChildren(ScrollbarButtonComponent);



  private ngOnInit(): void {
    this.setThumbScrollListener();
    this.setButtonsPressListener();
    this.setWindowResizeListener();
    this.buttons()[0].setState(true);
  }



  private setThumbScrollListener(): void {
    this.thumb()?.scrolledEvent.subscribe(() => {
      this.setThumbBoundaries();
      this.setButtonsState();
      this.scrolledEvent.emit();
    });
  }



  private setButtonsPressListener(): void {
    this.buttons().forEach((button) => {
      button.pressedEvent.subscribe((direction: number) => {
        this.scrollThumb(direction);
      })
    })
  }



  private setWindowResizeListener(): void {
    this.renderer.listen('window', 'resize', () => {
      this.setThumbBoundaries()
      this.setButtonsState();
    });
  }



  public update(content: HTMLElement) {
    const trackSize = this.track()?.getEndPos()! - this.track()?.getStartPos()!;
    const buttonSize = this.buttons()[0].getSize()!;
    this.thumb()?.update(content, trackSize, buttonSize);
  }



  public scrollThumb(direction: number) {
    this.thumb()?.setPosition(this.thumb()!.getPosition() + (10 * direction));
  }



  public setProperties(scrollbar: ScrollbarProperties): void {
    this.widthAssignedEvent.emit(scrollbar.width);
    this.buttonIconsAssignedEvent.emit(scrollbar.buttonIcon);
    this.trackBorderWidthAssignedEvent.emit(scrollbar.trackBorderWidth);
    this.thumbBorderWidthAssignedEvent.emit(scrollbar.thumbBorderWidth);
    this.buttonBorderWidthAssignedEvent.emit(scrollbar.buttonBorderWidth);
  }



  private setThumbBoundaries(): void {
    if (this.thumb()?.getPosition()! < this.track()!.getStartPos()) this.thumb()?.setPosition(this.track()!.getStartPos());
    if (this.thumb()?.getEndPosition()! > this.track()!.getEndPos()) this.thumb()?.setPositionFromEnd(this.track()!.getEndPos());
  }



  private setButtonsState(): void {
    this.setButtonState(0, this.thumb()?.getPosition()! <= this.track()!.getStartPos());
    this.setButtonState(1, this.thumb()?.getEndPosition()! >= this.track()!.getEndPos());
  }



  private setButtonState(index: number, condition: boolean): void {
    if (this.buttons()[index].getState() !== condition) {
      this.buttons()[index].setState(condition);
    }
  };
}