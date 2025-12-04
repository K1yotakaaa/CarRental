export interface Dealer {
  id?: number;
  name: string;
  logo?: string | null;
  description?: string | null;
  created_at?: string;
}

export const dealer = [
  {
    name: 'Mercedes',
    logo: 'https://i.pinimg.com/736x/3a/05/bf/3a05bf1444b4d648889f5146eab96e13.jpg',
  },
  {
    name: 'Tesla',
    logo: 'https://i.pinimg.com/736x/58/2a/39/582a396f47810628608d12058bb1fea0.jpg',
  },
  {
    name: 'Ford',
    logo: 'https://i.pinimg.com/736x/cd/bd/02/cdbd02b51fb5306e916e07dcdd171054.jpg',
  },
  {
    name: 'BMW',
    logo: 'https://i.pinimg.com/236x/8b/b1/84/8bb184b137c8858d430b5e8555795f31.jpg',
  },
  {
    name: 'Chevrolet',
    logo: 'https://i.pinimg.com/736x/fd/d7/b9/fdd7b95188e6579f215ce4cff2ae4cac.jpg',
  },
  {
    name: 'Lamborghini',
    logo: 'https://i.pinimg.com/736x/f1/db/da/f1dbda9c25f75cf9cf07b287e717c33e.jpg',
  },
  {
    name: 'Audi',
    logo: 'https://i.pinimg.com/236x/83/f6/32/83f632c19a6f430e632a116beec4b3bd.jpg',
  },
  {
    name: 'Toyota',
    logo: 'https://i.pinimg.com/236x/31/ef/75/31ef75ba7da2e2c2c8f6488fb528ecce.jpg',
  },
];
