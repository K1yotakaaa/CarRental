import { Component, Input, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() enableScrollEffect = false;
  navScrolled = false;

  constructor(public authService: AuthService) {}

  @HostListener('window:scroll')
  onScroll() {
    if (!this.enableScrollEffect) return;
    this.navScrolled = window.scrollY > 50;
  }
}
