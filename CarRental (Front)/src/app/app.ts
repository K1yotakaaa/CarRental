import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('CarRental');

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      console.log('Router event:', event.constructor.name, 'URL:', this.router.url);
    });
  }
}
