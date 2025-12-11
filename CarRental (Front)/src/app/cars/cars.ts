import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { AuthService } from '../services/auth-service';
import { CarService } from '../services/car-service';
import { FavoritesService } from '../services/favorites.service';
import { Car } from '../cars';

@Component({
  selector: 'app-cars',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cars.html',
  styleUrl: './cars.css',
})
export class Cars implements OnInit {
  currentYear = new Date().getFullYear();
  featuredCars: Car[] = [];
  loading = true;
  error: string | null = null;

  favorites: number[] = [];

  searchTerm = '';
  private searchDebounce?: Subscription;

  constructor(
    private carService: CarService,
    private viewportScroller: ViewportScroller,
    public authService: AuthService,
    public favService: FavoritesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCars();
    this.favService.favorites$.subscribe((favs) => {
      this.favorites = favs;
    });
  }

  loadCars(): void {
    this.carService.getCars().subscribe({
      next: (cars) => {
        this.featuredCars = cars;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load cars error:', err);
        this.error = 'Failed to load cars.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.loadCars();
      return;
    }

    this.loading = true;

    this.carService.searchCars(this.searchTerm).subscribe({
      next: (cars) => {
        this.featuredCars = cars;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Search error:', err);
        this.error = 'Search failed.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearchChange(): void {
    if (this.searchDebounce) {
      this.searchDebounce.unsubscribe();
    }

    this.searchDebounce = timer(300).subscribe(() => {
      const value = this.searchTerm.trim();

      if (!value) {
        this.loadCars();
      } else {
        this.onSearch();
      }
    });
  }

  toggleFavorite(car: Car): void {
    this.favService.toggleFavorite(car.id);
  }

  isFavorite(carId: number): boolean {
    return this.favorites.includes(carId);
  }

  resolveImage(car: Car): string {
    if (car.image_file) {
      return `https://carrental.up.railway.app${car.image_file}`;
    }

    return car.image || 'assets/no-image.png';
  }

  onRentCar(car: Car): void {
    alert(`You selected: ${car.make}\nBooking functionality will be implemented soon.`);
  }

  scrollTo(anchor: string): void {
    this.viewportScroller.scrollToAnchor(anchor);
  }

  createHeartParticles(carId: number): void {
    setTimeout(() => {
      const buttons = document.querySelectorAll(`[data-car-id="${carId}"] .favorite-btn`);

      if (buttons.length > 0) {
        const button = buttons[0] as HTMLElement;

        for (let i = 0; i < 3; i++) {
          const particle = document.createElement('span');
          particle.innerHTML = '❤';
          particle.style.position = 'absolute';
          particle.style.color = '#ff4d4d';
          particle.style.fontSize = '10px';
          particle.style.pointerEvents = 'none';
          particle.style.zIndex = '20';
          particle.style.opacity = '0';

          const buttonRect = button.getBoundingClientRect();
          particle.style.left = `${buttonRect.width / 2}px`;
          particle.style.top = `${buttonRect.height / 2}px`;

          const angle = i * 120 * (Math.PI / 180);
          const distance = 15;
          const targetX = Math.cos(angle) * distance;
          const targetY = Math.sin(angle) * distance;

          particle.animate(
            [
              {
                transform: 'translate(0, 0) scale(0)',
                opacity: 1,
              },
              {
                transform: `translate(${targetX}px, ${targetY}px) scale(1)`,
                opacity: 0,
              },
            ],
            {
              duration: 600,
              easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            }
          );

          button.appendChild(particle);

          setTimeout(() => {
            if (particle.parentNode === button) {
              button.removeChild(particle);
            }
          }, 600);
        }
      }
    }, 10);
  }
}
