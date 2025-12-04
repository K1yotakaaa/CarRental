import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CarService } from '../car-service';
import { DealerService } from '../dealer-service';
import { Car } from '../cars';

@Component({
  selector: 'app-dealer-cars',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './dealer-cars.html',
  styleUrl: './dealer-cars.css',
})
export class DealerCars implements OnInit {
  currentYear = new Date().getFullYear();

  dealerId!: number;
  dealerName: string = '';
  cars: Car[] = [];

  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private carService: CarService,
    private dealerService: DealerService,
  ) {}

  ngOnInit(): void {
    console.log('🔵 DealerCars INIT');

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('dealer');
      const parsed = Number(idParam);

      console.log('📌 Param received:', idParam, 'Parsed:', parsed);

      if (!idParam || isNaN(parsed) || parsed <= 0) {
        console.warn('❌ Invalid dealer param!');
        this.error = 'Invalid dealer identifier in URL.';
        this.cars = [];
        this.dealerName = '';
        this.loading = false;
        return;
      }

      this.dealerId = parsed;
      this.loading = true;
      this.error = null;

      console.log('🚀 Loading dealer + cars for dealerId =', parsed);

      this.loadDealerAndCars(parsed);
    });
  }

  private loadDealerAndCars(dealerId: number) {
    console.log('🔍 Calling dealerService.getDealer…');

    this.dealerService.getDealer(dealerId).subscribe({
      next: (d) => {
        console.log('✔ Dealer loaded:', d);
        this.dealerName = d?.name || `Dealer ${dealerId}`;
      },
      error: (err) => {
        console.warn('⚠ Failed to load dealer:', err);
        this.dealerName = `Dealer ${dealerId}`;
      },
    });

    console.log('🚗 Calling carService.getCarsByDealerId…');

    this.carService.getCarsByDealerId(dealerId).subscribe({
      next: (data) => {
        console.log('🎯 Cars received:', data);
        console.log('Count:', data?.length);

        this.cars = data || [];
        this.loading = false;

        console.log('📌 cars assigned. Template should update now.');
      },
      error: (err) => {
        console.error('Failed to load cars', err);
        this.error = 'Failed to load dealer cars.';
        this.cars = [];
        this.loading = false;
      },
    });
  }

  resolveImage(car: Car): string {
    if ((car as any).image_file) {
      const img = (car as any).image_file;
      return img.startsWith('http') ? img : `http://127.0.0.1:8000${img}`;
    }
    return car.image || 'assets/no-image.png';
  }

  scrollTo(anchor: string): void {
    this.viewportScroller.scrollToAnchor(anchor);
  }
}
