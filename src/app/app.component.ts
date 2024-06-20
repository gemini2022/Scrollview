import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollviewComponent } from 'scrollview';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScrollviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Scrollview';
}