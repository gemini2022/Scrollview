import { CommonModule } from '@angular/common';
import { Component, ElementRef, contentChild, inject, viewChild } from '@angular/core';
import { ScrollbarComponent } from '../scrollbar/scrollbar.component';
import { ScrollbarThumbComponent } from '../scrollbar-thumb/scrollbar-thumb.component';

@Component({
  selector: 'scrollbar-track',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scrollbar-track.component.html',
  styleUrl: './scrollbar-track.component.scss'
})
export class ScrollbarTrackComponent {
  protected isVertical!: boolean;
  private scrollbar = inject(ScrollbarComponent);
  private track = viewChild<ElementRef<HTMLElement>>('track');
  private thumb = contentChild(ScrollbarThumbComponent);



  private ngOnInit(): void {
    this.setAxis();
    this.setWidth();
    this.setBorderWidth();
  }



  private setAxis(): void {
    this.isVertical = this.scrollbar.isVertical();
  }



  private setWidth(): void {
    this.scrollbar.widthAssignedEvent.subscribe((width: string) => {
      this.track()?.nativeElement.style.setProperty('--track-width', width);
    })
  }



  private setBorderWidth(): void {
    this.scrollbar.trackBorderWidthAssignedEvent.subscribe((borderWidth: string) => {
      if(borderWidth === '0' || borderWidth.length === 0) borderWidth = '0px';
      this.track()?.nativeElement.style.setProperty('--track-border-width', borderWidth);
    })
  }



  protected onMouseDown(e: MouseEvent): void {
    this.thumb()?.setPosition((this.isVertical ? e.clientY - this.track()?.nativeElement.getBoundingClientRect().top! : e.clientX - this.track()?.nativeElement.getBoundingClientRect().left!) - (this.thumb()!.getSize() / 2));
    this.thumb()?.onMouseDown(e);
  }



  public getStartPos(): number {
    return this.isVertical ? this.track()?.nativeElement.offsetWidth! : this.track()?.nativeElement.offsetHeight!
  }



  public getEndPos(): number {
    return (this.isVertical ? this.track()?.nativeElement.offsetHeight! : this.track()?.nativeElement.offsetWidth!) - this.getStartPos();
  }
}