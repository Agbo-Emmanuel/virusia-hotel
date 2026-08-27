export const ROOM_CATEGORIES = [
  { id: "all", label: "All Rooms & Suites" },
  { id: "standard", label: "Standard Rooms" },
  { id: "deluxe", label: "Deluxe Rooms" },
  { id: "executive", label: "Executive Suites" },
  { id: "family", label: "Family Suites" },
  { id: "presidential", label: "Presidential Suites" },
  { id: "penthouse", label: "Penthouses" },
];

export const AMENITIES_LIST = [
  { id: "wifi", label: "Free High-Speed Wi-Fi", icon: "Wifi" },
  { id: "ocean_view", label: "Ocean View", icon: "Eye" },
  { id: "balcony", label: "Private Balcony", icon: "Sun" },
  { id: "jacuzzi", label: "Private Jacuzzi", icon: "Droplets" },
  { id: "breakfast", label: "Breakfast Included", icon: "Coffee" },
  { id: "air_conditioning", label: "Air Conditioning", icon: "Wind" },
  { id: "king_bed", label: "King Bed", icon: "Bed" },
  { id: "minibar", label: "Complimentary Minibar", icon: "Wine" },
  { id: "tv", label: "65-inch Smart TV", icon: "Tv" },
  { id: "room_service", label: "24/7 Room Service", icon: "Clock" },
  { id: "workspace", label: "Executive Work Desk", icon: "Briefcase" },
  { id: "safe", label: "In-room Digital Safe", icon: "Shield" },
];

export const ADDONS = [
  {
    id: "breakfast_buffet",
    name: "Gourmet Buffet Breakfast",
    description:
      "Daily access to our Michelin-inspired international breakfast buffet.",
    price: 35,
    perNight: true,
  },
  {
    id: "airport_shuttle",
    name: "Luxury Airport Transfer",
    description: "Chauffeur driven Mercedes Benz S-Class pick-up and drop-off.",
    price: 80,
    perNight: false,
  },
  {
    id: "spa_pass",
    name: "Full Day Spa & Wellness Pass",
    description:
      "Unlimited access to thermal baths, sauna, steam room & 60-min massage.",
    price: 120,
    perNight: true,
  },
  {
    id: "champagne_welcome",
    name: "Champagne & Fruit Basket",
    description:
      "Chilled Dom Pérignon bottle with fresh tropical fruit upon arrival.",
    price: 95,
    perNight: false,
  },
];

export const ROOMS_DATA = [
  {
    id: "room-101",
    title: "Room 001",
    category: "standard",
    tagline: "Breathtaking sea views with private sun deck",
    price: 320,
    originalPrice: 380,
    capacity: {
      adults: 2,
      children: 1,
      maxGuests: 3,
    },
    specs: {
      size: "55 m² / 592 sq ft",
      bed: "1 King Size Bed",
      view: "Panoramic Ocean & Sunset View",
      floor: "4th - 8th Floor",
    },
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    ],
    description: `Indulge in unmatched elegance with our Deluxe Oceanfront Suite. Featuring floor-to-ceiling glass windows opening directly to your private teak balconies, this suite offers soothing ocean breezes and unobstructed sunset vistas. Furnished with hand-crafted Italian leather furniture and plush Egyptian cotton linens.`,
  },
  {
    id: "room-102",
    title: "Room 002",
    category: "standard",
    tagline: "The pinnacle of hospitality with dedicated private butler",
    price: 850,
    originalPrice: 990,
    capacity: {
      adults: 4,
      children: 2,
      maxGuests: 6,
    },
    specs: {
      size: "180 m² / 1,937 sq ft",
      bed: "2 Grand Emperor Beds",
      view: "360° Ocean & City Skyline",
      floor: "Top Floor Penthouse Level",
    },
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    ],
    description: `Designed for royalty and discerning travelers, the Presidential Royal Suite encompasses the entire top wing of Virusia Hotel. Boasting a private heated infinity splash pool, marble jacuzzi, dining area for 8 guests, and 24/7 personal butler service.`,
  },
  {
    id: "room-103",
    title: "Room 003",
    category: "standard",
    tagline: "Sophisticated sanctuary equipped with ergonomic workspace",
    price: 240,
    originalPrice: 290,
    capacity: {
      adults: 2,
      children: 0,
      maxGuests: 2,
    },
    specs: {
      size: "48 m² / 516 sq ft",
      bed: "1 Executive King Bed",
      view: "Botanical Garden & Lagoon View",
      floor: "2nd - 6th Floor",
    },
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    ],

    description: `Tailored specifically for modern executives and remote professionals, this suite blends serene comfort with high productivity. Features high-speed fiber internet, multi-plug charging hubs, Herman Miller ergonomic chair, and access to the Executive Lounge.`,
  },
  {
    id: "room-104",
    title: "Room 004",
    category: "standard",
    tagline: "Spacious multi-bedroom layout perfect for family retreats",
    price: 450,
    originalPrice: 520,
    capacity: {
      adults: 4,
      children: 3,
      maxGuests: 7,
    },
    specs: {
      size: "110 m² / 1,184 sq ft",
      bed: "1 King + 2 Twin Beds",
      view: "Poolside & Garden View",
      floor: "1st & 2nd Floor",
    },
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    ],
    description: `Designed with families in mind, the Grand Family Haven features interconnecting bedrooms, a separate living room, board games for kids, and direct ground-level access to our heated family swimming pool.`,
  },
  {
    id: "room-105",
    title: "Room 005",
    category: "standard",
    tagline: "Warm contemporary comfort with premium essential amenities",
    price: 150,
    originalPrice: 180,
    capacity: {
      adults: 2,
      children: 0,
      maxGuests: 2,
    },
    specs: {
      size: "35 m² / 376 sq ft",
      bed: "1 Queen Size Bed",
      view: "City Lights View",
      floor: "2nd - 5th Floor",
    },
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80",
    ],
    description: `A perfectly appointed haven featuring warm timber accents, plush Queen bed with premium feather pillows, rainfall shower, and HD smart TV. Ideal for solo travelers or couples seeking luxury at a moderate price point.`,
  },
  {
    id: "room-106",
    title: "Room 006",
    category: "standard",
    tagline: "Exclusive private roof terrace with heated jacuzzi pool",
    price: 1100,
    originalPrice: 1350,
    capacity: {
      adults: 4,
      children: 2,
      maxGuests: 6,
    },
    specs: {
      size: "220 m² / 2,368 sq ft",
      bed: "2 Emperor Beds",
      view: "360° Ocean & City Skyline",
      floor: "Penthouse Level 12",
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    ],
    description: `The crowning glory of Virusia Hotel. The Skyline Penthouse boasts a private open-air rooftop garden, heated Jacuzzi spa, private cocktail bar, soundproof cinema room, and private elevator entrance.`,
  },
];

export const HOTEL_AMENITIES_SHOWCASE = [
  {
    id: "pool",
    title: "Infinity Oceanfront Pool",
    subtitle: "Sun-drenched pool deck with poolside bar and cabanas",
    description:
      "Relax alongside panoramic ocean views in our temperature-controlled infinity pool.",
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    hours: "06:00 AM - 10:00 PM Daily",
  },
  {
    id: "dining",
    title: "Aura Gourmet Restaurant",
    subtitle: "Michelin-starred fine dining featuring organic local produce",
    description:
      "Savor exquisite coastal seafood dishes paired with fine wines hand-selected by master sommelier.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    hours: "07:00 AM - 11:00 PM Daily",
  },
  {
    id: "spa",
    title: "Serenity Wellness Spa",
    subtitle: "Holistic massages, hot stone treatments & thermal hydrotherapy",
    description:
      "Rejuvenate mind and body with traditional Asian bodywork and organic botanical facial therapies.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    hours: "08:00 AM - 09:00 PM Daily",
  },
  {
    id: "gym",
    title: "Fitness & Pilates Lounge",
    subtitle: "State-of-the-art Technogym equipment with certified trainers",
    description:
      "Maintain your regimen with personal training sessions, yoga classes, and sea-view cardio decks.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    hours: "24 Hours Accessible",
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Victoria & Ethan Ross",
    role: "Honeymooners from London",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    text: "Virusia Hotel defined modern luxury for us. The oceanfront views from our balcony were surreal, and the booking process was seamless!",
    rating: 5,
  },
  {
    id: 2,
    name: "Dr. Aris Thorne",
    role: "Frequent Business Traveler",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    text: "As someone who travels 100+ days a year, the attention to detail, fast internet, and executive lounge service at Virusia is world-class.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amara Kalu",
    role: "Family Vacationer",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    text: "The Grand Family Suite had plenty of room for our 3 kids. Kids loved the heated pool and breakfast buffet spread every morning!",
    rating: 5,
  },
];
