import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { AuthService } from '../auth-service';
import { CarService } from '../car-service';
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

  constructor(
    private carService: CarService,
    private viewportScroller: ViewportScroller,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carService.getCars().subscribe({
      next: (cars) => {
        this.featuredCars = cars;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load cars.';
        this.loading = false;
      },
    });
  }

  resolveImage(car: Car): string {
    if (car.image_file) {
      return `http://127.0.0.1:8000${car.image_file}`;
    }

    return car.image || 'assets/no-image.png';
  }

  onRentCar(car: Car): void {
    alert(`You selected: ${car.make}\nBooking functionality will be implemented soon.`);
  }

  scrollTo(anchor: string): void {
    this.viewportScroller.scrollToAnchor(anchor);
  }
}
