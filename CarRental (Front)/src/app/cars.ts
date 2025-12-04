export interface DealerDetail {
  id: number;
  name: string;
  logo?: string | null;
  description?: string | null;
  created_at?: string;
}

export interface Car {
  id: number;
  image?: string | null;
  image_file?: string | null;
  make: string;
  fuel_type: string;
  type: string;
  capacity: number;
  price: number;
  description?: string | null;
  dealer: number;
  dealer_detail?: DealerDetail | null;
  created_by?: number | null;
  created_at?: string;
  is_available?: boolean;
}

export const cars = [
  {
    image: 'https://i.pinimg.com/736x/64/d4/da/64d4daec943260c734023be29a7027f1.jpg',
    make: 'Tesla Model S',
    fuelType: 'Electric',
    type: 'Sedan',
    capacity: 5,
    price: 129,
    dealer: 'Tesla',
  },
  {
    image: 'https://i.pinimg.com/236x/da/de/ff/dadeffa6c113e136a130ed1467e7bd2c.jpg',
    make: 'Ford Mustang',
    fuelType: 'Premium',
    type: 'Sports',
    capacity: 4,
    price: 99,
    dealer: 'Ford',
  },
  {
    image: 'https://i.pinimg.com/236x/f8/7b/c3/f87bc305efffdbc05cd3af0467171084.jpg',
    make: 'Jeep Wrangler',
    fuelType: 'Regular',
    type: 'SUV',
    capacity: 5,
    price: 89,
    dealer: 'Jeep',
  },
  {
    image: 'https://i.pinimg.com/736x/f3/78/6d/f3786d6e52d006ab37102e1a8f59a71e.jpg',
    make: 'BMW 3 Series',
    fuelType: 'Premium',
    type: 'Sedan',
    capacity: 5,
    price: 109,
    dealer: 'BMW',
  },
  {
    image: 'https://i.pinimg.com/236x/c4/96/af/c496af8a90917a4b0c44040ab8a22929.jpg',
    make: 'Chevrolet Camaro',
    fuelType: 'Premium',
    type: 'Coupe',
    capacity: 4,
    price: 95,
    dealer: 'Chevrolet',
  },
  {
    image: 'https://i.pinimg.com/236x/db/d7/c9/dbd7c943870f252d063a8f1ecbd884b1.jpg',
    make: 'Toyota RAV4',
    fuelType: 'Hybrid',
    type: 'SUV',
    capacity: 5,
    price: 85,
    dealer: 'Toyota',
  },
  {
    image: 'https://i.pinimg.com/474x/8a/bb/48/8abb48e646af1641a9070fefdcef5681.jpg',
    make: 'Audi R8',
    fuelType: 'Diesel',
    type: 'Sedan',
    capacity: 5,
    price: 115,
    dealer: 'Audi',
  },
  {
    image: 'https://i.pinimg.com/474x/a2/1e/57/a21e57ff2cc47a840a70cfa27218a846.jpg',
    make: 'Lamborghini Huracán',
    fuelType: 'Premium',
    type: 'Supercar',
    capacity: 2,
    price: 299,
    dealer: 'Lamborghini',
  },
  {
    image: 'https://i.pinimg.com/236x/88/47/3d/88473dbe27c059da8f33d1a03ec654c3.jpg',
    make: 'Honda Civic',
    fuelType: 'Regular',
    type: 'Compact',
    capacity: 5,
    price: 69,
    dealer: 'Honda',
  },
  {
    image: 'https://i.pinimg.com/474x/57/f5/b1/57f5b17b7fb7abbd9b9ebea2ece41f01.jpg',
    make: 'Mercedes-Benz GLC',
    fuelType: 'Diesel',
    type: 'SUV',
    capacity: 5,
    price: 125,
    dealer: 'Mercedes',
  },
];
