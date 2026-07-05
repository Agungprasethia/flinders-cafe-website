const initialData = {
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin1',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
  menu: [
    {
      id: 'menu-1',
      name: 'Creamy Butterscoot Latte',
      category: 'drink',
      price: 55000,
      description: 'Latte creamy dengan rasa butterscotch yang kaya dan lembut.',
      image: null,
      available: true,
      recommended: true,
      bestSeller: true,
    },
    {
      id: 'menu-2',
      name: 'Chicken Parmigiana',
      category: 'food',
      price: 65000,
      description: 'Ayam crispy dengan saus tomat dan keju mozzarella leleh di atasnya.',
      image: null,
      available: true,
      recommended: true,
      bestSeller: true,
    },
    {
      id: 'menu-3',
      name: 'Ice Latte',
      category: 'drink',
      price: 45000,
      description: 'Espresso segar dipadukan dengan susu fresh dan es batu.',
      image: null,
      available: true,
      recommended: false,
      bestSeller: false,
    },
  ],
  promo: [
    {
      id: 'promo-1',
      title: 'Happy Hour',
      description: 'Diskon 20% untuk semua minuman setiap hari pukul 14.00 - 16.00.',
      discount: '20%',
      image: null,
      validUntil: '2026-12-31',
      active: true,
    },
    {
      id: 'promo-2',
      title: 'Buy 1 Get 1',
      description: 'Beli 1 Creamy Butterscoot Latte gratis 1 Ice Latte setiap Senin.',
      discount: 'Buy 1 Get 1',
      image: null,
      validUntil: '2026-12-31',
      active: true,
    },
  ],
  reservasi: [],
  orders: [],
  halaman: {
    about: {
      title: 'Tentang Flinders Cafe',
      description:
        'Flinders adalah tempat di mana kopi berkualitas bertemu dengan suasana yang hangat dan nyaman.',
      address: 'Jl. Contoh No. 123, Kota, Indonesia',
      phone: '+62 812-3456-7890',
      openHours: 'Setiap Hari: 10:00 - 21:00',
      instagram: 'https://www.instagram.com/flinderscafebali',
      whatsapp: 'https://wa.me/6281234567890',
    },
    gallery: [],
    hero: {
      tagline: 'A Place to Relax & Enjoy',
      subtitle: 'Kopi berkualitas, suasana hangat, dan pengalaman terbaik setiap hari.',
    },
  },
};

let data = structuredClone(initialData);

function readDB() {
  return structuredClone(data);
}

function writeDB(nextData) {
  data = structuredClone(nextData);
}

module.exports = {
  readDB,
  writeDB,
};
