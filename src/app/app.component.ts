import { Component } from '@angular/core';
import { ScrollbarButtonComponent, ScrollbarComponent, ScrollbarThumbComponent, ScrollbarTrackComponent, ScrollviewComponent } from 'scrollview';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ScrollbarComponent,
    ScrollviewComponent,
    ScrollbarTrackComponent,
    ScrollbarThumbComponent,
    ScrollbarButtonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Scrollview';
}