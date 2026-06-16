import heroBg from "../assets/images/hero-bg.jpg";
import logo from "../assets/images/logo.png";
import aboutBg from "../assets/images/about-bg.jpg";
import galleryBg from "../assets/images/gallery-bg.jpg";
import promoBg from "../assets/images/promo-bg.jpg";
import promo1 from "../assets/images/promo1.jpg";
import promo2 from "../assets/images/promo2.jpg";
import menuFood from "../assets/images/menu-food.png";
import menuFoodGray from "../assets/images/menu-food-gray.png";
import galleryItem from "../assets/images/gallery-item.jpg";
import reservasiBg from "../assets/images/reservasi-bg.jpg";
import reservasiLogo from "../assets/images/reservasi-logo.png";
import reservasiStep2 from "../assets/images/reservasi-step2.png";

export const IMAGES = {
  heroBg,
  logo,
  aboutBg,
  galleryBg,
  promoBg,
  promo1,
  promo2,
  menuFood,
  menuFoodGray,
  galleryItem,
  instagram: "",
  whatsapp: "",
  iconMap: "",
  iconClock: "",
  iconPhone: "",
  reservasiBg,
  reservasiLogo,
  reservasiCalendar: reservasiStep2, // using step2 as fallback
  reservasiStep2,
};

export const MENU_CATEGORIES = [
  "recomended",
  "best seller",
  "drink",
  "food",
  "dessert & snack",
];

export const MENU_ITEMS = [
  {
    id: 1,
    name: "creamy butterscoot latte",
    price: "55k",
    img: IMAGES.menuFood,
    available: true,
  },
  {
    id: 2,
    name: "chicken parmigiana",
    price: "55k",
    img: IMAGES.menuFood,
    available: true,
  },
  {
    id: 3,
    name: "ice latte",
    price: "55k",
    img: IMAGES.menuFood,
    available: true,
  },
  {
    id: 4,
    name: "frozen mint lemonade",
    price: "55k",
    img: IMAGES.menuFood,
    available: true,
  },
  {
    id: 5,
    name: "creamy butterscoot latte",
    price: "55k",
    img: IMAGES.menuFood,
    available: true,
  },
  {
    id: 6,
    name: "Chicken Parmigiana",
    price: "55k",
    img: IMAGES.menuFood,
    available: true,
  },
  {
    id: 7,
    name: "Chicken Parmigiana",
    price: "55k",
    img: IMAGES.menuFood,
    available: true,
  },
  {
    id: 8,
    name: "Chicken Parmigiana",
    price: "55k",
    img: IMAGES.menuFood,
    available: true,
  },
];

export const GALLERY_ITEMS = Array(8).fill(IMAGES.galleryItem);

export const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export const FULL_DATES = [3, 10, 17, 24];

export const AVAILABLE_DATES = [
  1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 25,
  26, 27, 28, 29, 30, 31,
];
