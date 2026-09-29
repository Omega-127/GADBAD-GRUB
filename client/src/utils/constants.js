// Sanitize environment URLs so users can provide e.g. https://service.onrender.com or https://service.onrender.com/api
const rawApiUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api')
  .trim()
  .replace(/\/+$/, '');

export const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

const rawSocketUrl = (
  import.meta.env.VITE_SOCKET_URL ||
  rawApiUrl.replace(/\/api\/?$/, '') ||
  'http://localhost:5000'
)
  .trim()
  .replace(/\/+$/, '');

export const SOCKET_URL = rawSocketUrl;
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

// Default Demo User
export const DEFAULT_USER = {
  _id: 'usr_gadbad_demo_01',
  displayName: 'SpeedyGourmet',
  email: 'racer@gadbadgrub.io',
  avatar: '🏎️',
  points: 1250,
  xp: 3420,
  level: 7,
  winRate: '68%',
  totalRaces: 28,
  badges: ['FIRST_ORDER', 'PREDICTION_KING', 'LIGHTNING_FAST', 'VIP_RACER']
};

// Demo Racers Config
export const DEMO_RACERS = [
  {
    id: 'racer_1',
    name: 'Pizza Panther',
    vehicle: 'Turbo Scooter 3000',
    color: '#FF3366',
    avatar: '🛵',
    specialty: 'Corner Drift & Shortcut Sprint',
    odds: '2.4x',
    rating: 4.9,
    baseSpeed: 58
  },
  {
    id: 'racer_2',
    name: 'Biryani Bullet',
    vehicle: 'Supersonic Hyperbike',
    color: '#FFB800',
    avatar: '🏍️',
    specialty: 'Straightaway Top Velocity',
    odds: '1.9x',
    rating: 4.8,
    baseSpeed: 64
  },
  {
    id: 'racer_3',
    name: 'Burger Beast',
    vehicle: 'Nitro Muscle Rig',
    color: '#00F0FF',
    avatar: '🏎️',
    specialty: 'Traffic Bulldozer & Raw Acceleration',
    odds: '3.1x',
    rating: 4.7,
    baseSpeed: 52
  },
  {
    id: 'racer_4',
    name: 'Taco Turbo',
    vehicle: 'Cyber Hoverpod',
    color: '#00E676',
    avatar: '🚀',
    specialty: 'Aerodynamic Glide & Quick Recovery',
    odds: '4.5x',
    rating: 4.6,
    baseSpeed: 55
  }
];

// Demo Restaurants
export const DEMO_RESTAURANTS = [
  {
    _id: 'rest_01',
    name: 'Hyper Sonic Pizza & Wings',
    cuisine: 'Italian • Fast Speed • Gourmet',
    rating: 4.9,
    deliveryTime: '15-20 min',
    deliveryFee: 2.99,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    bannerBadge: '🔥 FAST TRACK'
  },
  {
    _id: 'rest_02',
    name: 'Nitro Biryani Express',
    cuisine: 'Hyderabadi • Royal Spice • Dum',
    rating: 4.8,
    deliveryTime: '20-25 min',
    deliveryFee: 1.99,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    bannerBadge: '⚡ TOP RACER'
  },
  {
    _id: 'rest_03',
    name: 'Cyber Smash Burgers',
    cuisine: 'American Burgers • Loaded Fries • Shakes',
    rating: 4.7,
    deliveryTime: '12-18 min',
    deliveryFee: 2.49,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    bannerBadge: '💥 HIGH OCTANE'
  },
  {
    _id: 'rest_04',
    name: 'Turbo Taco & Burrito Bar',
    cuisine: 'Mexican • Street Tacos • Quesadillas',
    rating: 4.6,
    deliveryTime: '15-22 min',
    deliveryFee: 1.49,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    bannerBadge: '🌶️ FLAME BOOST'
  }
];

// Demo Menu Items mapped by restaurant
export const DEMO_MENU_ITEMS = {
  rest_01: [
    {
      _id: 'm_01',
      name: 'Nitro Pepperoni Inferno',
      description: 'Double pepperoni, charred jalapenos, mozzarella explosion & ghost pepper hot honey drizzle.',
      price: 15.99,
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80',
      badge: 'Bestseller'
    },
    {
      _id: 'm_02',
      name: 'Formula Truffle Mushroom Pizza',
      description: 'Wild forest portobello, white truffle oil, shaved parmesan & fresh rosemary crust.',
      price: 18.50,
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80',
      badge: 'Chef Special'
    },
    {
      _id: 'm_03',
      name: 'Supersonic Buffalo Wings (8pcs)',
      description: 'Crisp fried jumbo wings tossed in high-heat tangy cayenne butter with blue cheese dip.',
      price: 11.99,
      category: 'Sides',
      imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=80'
    },
    {
      _id: 'm_04',
      name: 'Turbo Cheesy Garlic Breadsticks',
      description: 'Artisan sourdough pull-apart bread smothered in garlic herb butter & molten fontina.',
      price: 7.99,
      category: 'Sides',
      imageUrl: 'https://images.unsplash.com/photo-1619895092538-128341789043?w=500&auto=format&fit=crop&q=80'
    }
  ],
  rest_02: [
    {
      _id: 'm_05',
      name: 'Grand Prix Mutton Dum Biryani',
      description: 'Slow-cooked tender goat meat marinated in saffron spices, caramelized onions & fragrant basmati.',
      price: 17.99,
      category: 'Biryani',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
      badge: 'King Size'
    },
    {
      _id: 'm_06',
      name: 'Rocket Chicken Biryani',
      description: 'Juicy spiced chicken leg quarter layered with ghee-infused long grain rice & boiled egg.',
      price: 14.50,
      category: 'Biryani',
      imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80',
      badge: 'Top Rated'
    },
    {
      _id: 'm_07',
      name: 'Mirchi Ka Salan & Cucumber Raita',
      description: 'Spiced nutty chili curry and cooling whipped herb yogurt dip.',
      price: 4.50,
      category: 'Sides',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80'
    }
  ],
  rest_03: [
    {
      _id: 'm_08',
      name: 'Quad-Turbo Double Smash Burger',
      description: 'Two crispy-edged Angus beef patties, aged cheddar, grilled shallots, house secret nitro sauce.',
      price: 13.99,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
      badge: 'Signature'
    },
    {
      _id: 'm_09',
      name: 'Nitro Bacon BBQ Stack',
      description: 'Applewood smoked thick bacon, smoky bourbon BBQ sauce, beer battered onion rings & brioche.',
      price: 15.49,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80'
    },
    {
      _id: 'm_10',
      name: 'High-Octane Loaded Crinkle Fries',
      description: 'Golden crinkle fries drenched in liquid queso, chopped jalapeños, scallions & brisket bits.',
      price: 6.99,
      category: 'Sides',
      imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=80'
    }
  ],
  rest_04: [
    {
      _id: 'm_11',
      name: 'Speedster Birria Quesatacos (3pcs)',
      description: 'Braised beef flank crisped on flat-top in chili fat, stuffed with oaxaca cheese & rich consommé dip.',
      price: 14.99,
      category: 'Tacos',
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80',
      badge: 'Hyped'
    },
    {
      _id: 'm_12',
      name: 'Mach 5 Carne Asada Burrito',
      description: 'Marinated flank steak, charred guacamole, cilantro lime rice, pinto beans & salsa verde.',
      price: 13.50,
      category: 'Burritos',
      imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=80'
    }
  ]
};

// Available Badges
export const ALL_BADGES = [
  {
    code: 'FIRST_ORDER',
    title: 'Rookie Racer',
    description: 'Placed your very first race delivery order',
    icon: '🏁',
    color: '#00F0FF',
    xpValue: 100
  },
  {
    code: 'PREDICTION_KING',
    title: 'Track Oracle',
    description: 'Successfully predicted 3 race winners in a row',
    icon: '🔮',
    color: '#FFB800',
    xpValue: 350
  },
  {
    code: 'LIGHTNING_FAST',
    title: 'Mach 1 Eater',
    description: 'Received delivery under 15 minutes record time',
    icon: '⚡',
    color: '#FF3366',
    xpValue: 250
  },
  {
    code: 'VIP_RACER',
    title: 'Pit Stop Legend',
    description: 'Earned more than 1000 Victory Points',
    icon: '👑',
    color: '#9D4EDD',
    xpValue: 500
  },
  {
    code: 'DRIFT_MASTER',
    title: 'Drift Connoisseur',
    description: 'Ordered during extreme peak delivery rush hour',
    icon: '🌪️',
    color: '#00E676',
    xpValue: 200
  }
];
