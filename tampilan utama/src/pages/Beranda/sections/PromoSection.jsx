import { useState } from "react";
import { IMAGES } from "../../../constants";
import PromoDetailModal from "../../../components/ui/PromoDetailModal";

export default function PromoSection({ lang = "en" }) {
  const [selectedPromo, setSelectedPromo] = useState(null);

  const texts = {
    en: {
      subtitle: "Your daily dose of happiness. Discover limited time packages and special treats.",
      promo1: {
        title: "Asian Flavours",
        description: "Explore authentic Asian flavors with a blend of our chef's selected spices.",
        items: ["Tom Yum Soup", "Special Fried Rice", "Dim Sum Basket", "Thai Iced Tea"]
      },
      promo2: {
        title: "Lunch Package",
        description: "Affordable and filling lunch package, perfect for a midday break.",
        items: ["Choice of Main Course", "Vegetable Soup", "Sweet Iced Tea", "Dessert of the Day"]
      }
    },
    id: {
      subtitle: "Dosis kebahagiaan harian Anda. Temukan paket waktu terbatas dan sajian istimewa.",
      promo1: {
        title: "Asian Flavours",
        description: "Jelajahi cita rasa Asia yang otentik dengan paduan bumbu pilihan chef kami.",
        items: ["Tom Yum Soup", "Nasi Goreng Spesial", "Dim Sum Basket", "Thai Iced Tea"]
      },
      promo2: {
        title: "Paket Makan Siang",
        description: "Paket makan siang hemat dan mengenyangkan, cocok untuk break di tengah hari.",
        items: ["Main Course pilihan", "Sup Sayuran", "Es Teh Manis", "Dessert of the Day"]
      }
    }
  };

  const t = texts[lang];

  const promoAsian = {
    title: t.promo1.title,
    price: "120K++",
    image: IMAGES.promo1,
    description: t.promo1.description,
    items: t.promo1.items
  };

  const promoLunch = {
    title: t.promo2.title,
    price: "85K++",
    image: IMAGES.promo2,
    description: t.promo2.description,
    items: t.promo2.items
  };

  return (
    <section className="promo" id="promo">
      <img src={IMAGES.promoBg} alt="Promo Background" className="promo__bg" />
      <div className="promo__overlay" />
      <div className="promo__content">
        <div className="promo__header">
          <h2 className="promo__title">
            <span className="promo__title--regular">flinders</span>{" "}
            <em className="promo__title--italic">sweet deals</em>
          </h2>
          <p className="promo__subtitle">{t.subtitle}</p>
        </div>
        <div className="promo__cards">
          <div className="promo__card" onClick={() => setSelectedPromo(promoAsian)}>
            <img
              src={IMAGES.promo1}
              alt={t.promo1.title}
              className="promo__card-img"
            />
          </div>
          <div className="promo__card" onClick={() => setSelectedPromo(promoLunch)}>
            <img
              src={IMAGES.promo2}
              alt={t.promo2.title}
              className="promo__card-img"
            />
          </div>
        </div>
      </div>
      
      {selectedPromo && (
        <PromoDetailModal 
          promo={selectedPromo} 
          onClose={() => setSelectedPromo(null)} 
        />
      )}
    </section>
  );
}
