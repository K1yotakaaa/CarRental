import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { CarService } from '../services/car-service';
import { Car } from '../cars';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  text: string;
  author: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-home-page',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  navScrolled = false;
  currentYear = new Date().getFullYear();

  featuredCars: Car[] = [];
  loading = true;

  benefits: Benefit[] = [
    {
      icon: 'fa-solid fa-tag',
      title: 'Best Prices',
      description: 'We guarantee the best prices for your rental.',
    },
    {
      icon: 'fa-solid fa-car',
      title: 'Wide Selection',
      description: 'Choose from hundreds of vehicles.',
    },
    {
      icon: 'fa-solid fa-headset',
      title: '24/7 Support',
      description: 'We are available anytime you need help.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Fully Insured',
      description: 'All rentals include complete insurance.',
    },
  ];

  testimonials: Testimonial[] = [
    {
      text: "I've rented from Velocity multiple times—always excellent.",
      author: 'Michael Johnson',
      role: 'Frequent Traveler',
      avatar: 'https://i.pinimg.com/236x/40/95/3a/40953a1d68f161ab171afff4ef9bea92.jpg',
    },
    {
      text: 'Easy booking and helpful staff. Highly recommend!',
      author: 'Sarah Williams',
      role: 'Business Traveler',
      avatar: 'https://i.pinimg.com/236x/a6/99/a9/a699a9ebb76ad60a4a164c7c4c715933.jpg',
    },
    {
      text: 'Luxury car made our weekend unforgettable.',
      author: 'David Chen',
      role: 'Local Customer',
      avatar: 'https://i.pinimg.com/736x/e1/9e/b1/e19eb12d5bf236c2543cb38b297adc59.jpg',
    },
  ];

  constructor(public authService: AuthService, private carService: CarService) {}

  ngOnInit(): void {
    this.carService.getCars().subscribe({
      next: (cars) => {
        this.featuredCars = cars.slice(0, 3);
        this.loading = false;
      },
      error: () => {
        this.featuredCars = [
          {
            make: 'Tesla Model S',
            fuel_type: 'Electric',
            type: 'Sedan',
            capacity: 5,
            price: 129,
            image: 'https://i.pinimg.com/736x/64/d4/da/64d4daec943260c734023be29a7027f1.jpg',
          } as Car,
          {
            make: 'Ford Mustang',
            fuel_type: 'Premium',
            type: 'Sports',
            capacity: 4,
            price: 99,
            image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
          } as Car,
          {
            make: 'Jeep Wrangler',
            fuel_type: 'Regular',
            type: 'SUV',
            capacity: 5,
            price: 89,
            image: 'https://i.pinimg.com/236x/f8/7b/c3/f87bc305efffdbc05cd3af0467171084.jpg',
          } as Car,
        ];
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

  @HostListener('window:scroll')
  onWindowScroll() {
    this.navScrolled = window.scrollY > 50;
  }

  onSearchSubmit() {
    alert('Search functionality would be implemented here!');
  }

  onRentCar(car: Car) {
    alert(`You selected: ${car.make}\nBooking functionality coming soon!`);
  }
}
