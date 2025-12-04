import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { CarService } from '../car-service';
import { AuthService } from '../auth-service';
import { DealerService } from '../dealer-service';

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
  userDealerId: number | null = null;

  carData = {
    make: '',
    fuel_type: '',
    type: '',
    capacity: 0,
    price: 0,
    description: '',
    image: '',
    image_file: null as File | null,
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
    this.loadDealers();
    this.loadUserData();
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

  loadUserData() {
    const token = this.authService.getAccessToken();
    if (!token) return;

    this.http
      .get<any>('http://127.0.0.1:8000/api/auth/me/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (user) => {
          if (user.role === 'dealer') {
            this.isDealer = true;
            this.userDealerId = user.dealer;
          }
          this.cdr.markForCheck();
        },
        error: () => console.warn('Could not fetch user data'),
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0] || null;
    this.carData.image_file = file;
  }

  onSubmit() {
    if (!this.userDealerId) {
      alert('You must be a dealer to add cars.');
      return;
    }

    const formData = new FormData();
    formData.append('make', this.carData.make);
    formData.append('fuel_type', this.carData.fuel_type);
    formData.append('type', this.carData.type);
    formData.append('capacity', String(this.carData.capacity));
    formData.append('price', String(this.carData.price));
    formData.append('description', this.carData.description);
    formData.append('dealer', String(this.userDealerId));

    if (this.carData.image_file) {
      formData.append('image_file', this.carData.image_file);
    } else if (this.carData.image) {
      formData.append('image', this.carData.image);
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
      image: '',
      image_file: null,
    };
  }

  navigateToDealer(dealerId: number) {
    if (!dealerId || isNaN(dealerId)) {
      console.warn('navigateToDealer called with invalid id', dealerId);
      return;
    }
    // navigate to route with numeric id
    this.router.navigate(['/service', dealerId]);
  }

  scrollTo(anchor: string): void {
    this.viewportScroller.scrollToAnchor(anchor);
  }
}
