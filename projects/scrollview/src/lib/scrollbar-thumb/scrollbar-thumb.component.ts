import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, inject, output, viewChild } from '@angular/core';
import { ScrollbarComponent } from '../scrollbar/scrollbar.component';

@Component({
  selector: 'scrollbar-thumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scrollbar-thumb.component.html',
  styleUrl: './scrollbar-thumb.component.scss'
})
export class ScrollbarThumbComponent {
  // Output
  public scrolledEvent = output();

  // Private
  private thumbPos!: number;
  private thumbSize!: number;
  private buttonSize!: number;
  private scrollRatio!: number;
  private content!: HTMLElement;
  protected isVertical!: boolean;
  protected borderWidth!: string;
  private renderer = inject(Renderer2);
  private scrollbar = inject(ScrollbarComponent);
  private removeThumbScrollListener!: () => void;
  private removeThumbMouseUpListener!: () => void;
  private removeThumbMousedownListener!: () => void;
  private thumb = viewChild<ElementRef<HTMLElement>>('thumb');



  private ngOnInit(): void {
    this.setThumbAxis();
    this.setThumbWidth();
    this.setThumbScroll();
    this.setThumbBorderWidth();
  }



  private setThumbAxis(): void {
    this.isVertical = this.scrollbar.isVertical();
  }



  private setThumbWidth(): void {
    this.scrollbar.widthAssignedEvent.subscribe((width: string) => {
      this.thumb()?.nativeElement.style.setProperty('--thumb-width', width);
    })
  }



  private setThumbScroll(): void {
    this.removeThumbMousedownListener = this.renderer.listen(this.thumb()?.nativeElement, 'mousedown', (e: MouseEvent) => {
      const thumbStartPos = this.getPosition();
      const mouseGlobalPos = this.isVertical ? e.clientY : e.clientX;
      const thumbGlobalPos = this.isVertical ? this.thumb()!.nativeElement.getBoundingClientRect().top : this.thumb()!.nativeElement.getBoundingClientRect().left;
      const scrollOffset = mouseGlobalPos - thumbGlobalPos;

      this.removeThumbScrollListener = this.renderer.listen('window', 'mousemove', (e: MouseEvent) => {
        this.setPosition(thumbStartPos + (((this.isVertical ? e.clientY : e.clientX) - thumbGlobalPos) - scrollOffset));
      })

      this.removeThumbMouseUpListener = this.renderer.listen('window', 'mouseup', () => {
        this.removeThumbMouseUpListener();
        this.removeThumbScrollListener();
      })
    })
  }



  private setThumbBorderWidth(): void {
    this.scrollbar.thumbBorderWidthAssignedEvent.subscribe((borderWidth: string) => {
      this.borderWidth = borderWidth;
    })
  }



  public getPosition(): number {
    return this.isVertical ? this.thumb()!.nativeElement.offsetTop : this.thumb()!.nativeElement.offsetLeft;
  }



  public getEndPosition(): number {
    return this.getPosition() + (this.isVertical ? this.thumb()!.nativeElement.offsetHeight : this.thumb()!.nativeElement.offsetWidth);
  }



  public setPositionFromEnd(pos: number): void {
    this.setPosition(this.isVertical ? pos - this.thumb()!.nativeElement.offsetHeight : pos - this.thumb()!.nativeElement.offsetWidth);
  }



  public setPosition(newThumbPos: number): void {
    if (this.isVertical) {
      this.renderer.setStyle(this.thumb()!.nativeElement, 'top', newThumbPos + 'px');
      this.thumbPos = this.thumb()!.nativeElement.offsetTop / this.content.offsetHeight;
      this.renderer.setStyle(this.content, 'top', ((-(this.thumb()?.nativeElement.offsetTop! - this.buttonSize) / this.scrollRatio)) + 'px');

    } else {
      this.thumb()!.nativeElement.style.left = newThumbPos + 'px';
      this.thumbPos = this.thumb()!.nativeElement.offsetLeft / this.content.offsetWidth;
      this.renderer.setStyle(this.content, 'left', ((-(this.thumb()?.nativeElement.offsetLeft! - this.buttonSize) / this.scrollRatio)) + 'px');
    }
    this.scrolledEvent.emit();
  }



  public getSize(): number {
    return this.thumbSize;
  }



  public update(content: HTMLElement, trackSize: number, buttonSize: number): void {
    this.content = content;
    this.buttonSize = buttonSize;
    const thumbRatio = trackSize / (this.isVertical ? content.scrollHeight : content.scrollWidth);
    this.thumbSize = Math.round((this.isVertical ? content.clientHeight : content.clientWidth) * thumbRatio);
    const thumbTravelDistance = trackSize - this.thumbSize;
    this.renderer.setStyle(this.thumb()?.nativeElement, this.isVertical ? 'height' : 'width', this.thumbSize + 'px');
    if (this.isVertical) this.renderer.setStyle(this.thumb()!.nativeElement, 'top', (this.thumbPos * content.offsetHeight) + 'px');
    if (!this.isVertical) this.renderer.setStyle(this.thumb()!.nativeElement, 'left', (this.thumbPos * content.offsetWidth) + 'px');
    this.scrollRatio = thumbTravelDistance / ((this.isVertical ? content.scrollHeight - content.clientHeight : content.scrollWidth - content.clientWidth));
  }



  private ngOnDestroy(): void {
    if (this.removeThumbMousedownListener) this.removeThumbMousedownListener();
  }
}