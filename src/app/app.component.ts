import { Component, ElementRef, Renderer2, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollbarButtonComponent, ScrollbarComponent, ScrollbarThumbComponent, ScrollbarTrackComponent, ScrollviewComponent } from 'scrollview';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ScrollviewComponent,
    ScrollbarComponent,
    ScrollbarTrackComponent,
    ScrollbarButtonComponent,
    ScrollbarThumbComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Scrollview';
  private square = viewChild<ElementRef<HTMLElement>>('square');
  private renderer = inject(Renderer2)

  onChangeColor() {
    document.documentElement.style.setProperty('--scrollbar-track-background-color', 'linear-gradient(white, blue)');
  }

  onVerticalOverflow() {
    this.renderer.setStyle(this.square()?.nativeElement, 'top', '600px');
    this.renderer.setStyle(this.square()?.nativeElement, 'left', '0');
  }


  onHorizontalOverflow() {
    this.renderer.setStyle(this.square()?.nativeElement, 'left', '600px');
    this.renderer.setStyle(this.square()?.nativeElement, 'top', '0');
  }


  onDoubleOverflow() {
    this.renderer.setStyle(this.square()?.nativeElement, 'top', '600px');
    this.renderer.setStyle(this.square()?.nativeElement, 'left', '600px');
  }


  onNoOverflow() {
    this.renderer.setStyle(this.square()?.nativeElement, 'top', '0');
    this.renderer.setStyle(this.square()?.nativeElement, 'left', '0');
  }
}