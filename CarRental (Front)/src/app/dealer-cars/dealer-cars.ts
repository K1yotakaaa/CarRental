import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CarService } from '../services/car-service';
import { DealerService } from '../services/dealer-service';
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('dealer');
      const parsed = Number(idParam);

      if (!idParam || isNaN(parsed) || parsed <= 0) {
        this.error = 'Invalid dealer identifier in URL.';
        this.cars = [];
        this.dealerName = '';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.dealerId = parsed;
      this.loading = true;
      this.error = null;
      this.cars = [];

      this.loadDealerAndCars(parsed);
    });
  }

  private loadDealerAndCars(dealerId: number) {
    this.dealerService.getDealer(dealerId).subscribe({
      next: (d) => {
        this.dealerName = d?.name || `Dealer ${dealerId}`;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.dealerName = `Dealer ${dealerId}`;
        this.cdr.detectChanges();
      },
    });

    this.carService.getCarsByDealerId(dealerId).subscribe({
      next: (data) => {
        this.cars = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load dealer cars.';
        this.cars = [];
        this.loading = false;
        this.cdr.detectChanges();
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
