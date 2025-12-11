import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { CarService } from '../services/car-service';
import { AuthService } from '../services/auth-service';
import { DealerService } from '../services/dealer-service';

@Component({
  selector: 'app-service',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './service.html',
  styleUrl: './service.css',
})
export class Service implements OnInit {
  currentYear = new Date().getFullYear();

  dealers: any[] = [];
  isDealer = false;

  carData = {
    make: '',
    fuel_type: '',
    type: '',
    capacity: 0,
    price: 0,
    description: '',
    dealer: null as number | null,
    image_file: null as File | null,
    image: '',
  };

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private carService: CarService,
    private authService: AuthService,
    private dealerService: DealerService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserRole();
    this.loadDealers();
  }

  loadUserRole() {
    this.http.get<any>('https://carrental.up.railway.app/api/auth/me/').subscribe({
      next: (user) => {
        console.log('USER FROM /me/:', user);

        this.isDealer = user.role === 'dealer';
        console.log('isDealer =', this.isDealer);

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('ERROR calling /me/:', err);
      },
    });
  }

  loadDealers() {
    this.dealerService.getDealers().subscribe({
      next: (data) => {
        this.dealers = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load dealers:', err),
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0] || null;
    this.carData.image_file = file;
  }

  onSubmit() {
    if (!this.isDealer) {
      alert('Only DEALER users can create cars.');
      return;
    }

    if (!this.carData.dealer) {
      alert('Please select a dealer/company.');
      return;
    }

    const formData = new FormData();
    formData.append('make', this.carData.make);
    formData.append('fuel_type', this.carData.fuel_type);
    formData.append('type', this.carData.type);
    formData.append('capacity', String(this.carData.capacity));
    formData.append('price', String(this.carData.price));
    formData.append('description', this.carData.description);
    formData.append('dealer', String(this.carData.dealer));

    if (this.carData.image_file) {
      formData.append('image_file', this.carData.image_file);
    } else if (this.carData.image.trim() !== '') {
      formData.append('image', this.carData.image.trim());
    }

    this.carService.addCar(formData).subscribe({
      next: () => {
        alert('Car added successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding car:', err);
        alert('Failed to add car.');
      },
    });
  }

  resetForm() {
    this.carData = {
      make: '',
      fuel_type: '',
      type: '',
      capacity: 0,
      price: 0,
      description: '',
      dealer: null,
      image_file: null,
      image: '',
    };
  }

  navigateToDealer(dealerId: number) {
    if (!dealerId) return;
    this.router.navigate(['/service', dealerId]);
  }

  scrollTo(anchor: string): void {
    this.viewportScroller.scrollToAnchor(anchor);
  }
}
