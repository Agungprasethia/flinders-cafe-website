import { useState, useRef } from "react";
import { IMAGES, MENU_CATEGORIES, MENU_ITEMS } from "../../../constants";
import PromoDetailModal from "../../../components/ui/PromoDetailModal";

export default function MenuSection({ lang = "en", onMenuSelect }) {
  const [activeCategory, setActiveCategory] = useState("food");
  const [selectedPromo, setSelectedPromo] = useState(null);
  const promosRef = useRef(null);

  const promoData = [
    {
      id: 1,
      title: "lunch package\ndeals",
      poster: IMAGES.promo2,
      items: [
        { name: "salted egg chicken", price: "59k" },
        { name: "nasi goreng suna cekuh", price: "69k" },
        { name: "pasta chilli oil", price: "55k" },
        { name: "enoki beef roll", price: "65k" },
        { name: "fried wonton with chilli oil", price: "55k" },
      ],
      include: "Ice Tea / Mineral Water",
      validity: "Valid: Weekdays, 11 AM – 5 PM",
      totalPrice: "65k",
      description: lang === "id"
        ? "Paket makan siang hemat dan mengenyangkan."
        : "Affordable and filling lunch package.",
    },
    {
      id: 2,
      title: "asian flavours",
      subtitle: lang === "id"
        ? "nikmati cita rasa khas asian versi dari flinders cafe yang sangat nikmat."
        : "enjoy authentic asian flavors from flinders cafe that are truly delicious.",
      poster: IMAGES.promo1,
      items: [
        { name: "salted egg chicken", price: "59k" },
        { name: "nasi goreng suna cekuh", price: "55k" },
        { name: "pasta chilli oil", price: "55k" },
        { name: "enoki beef roll", price: "65k" },
        { name: "fried wonton with chilli oil", price: "55k" },
      ],
      totalPrice: "35k-65k",
      description: lang === "id"
        ? "Jelajahi cita rasa Asia yang otentik."
        : "Explore authentic Asian flavors.",
    },
  ];

  const texts = {
    en: { title: "menu", searchPlaceholder: "Search menu..." },
    id: { title: "menu", searchPlaceholder: "Cari menu..." },
  };
  const t = texts[lang];

  return (
    <section className="menu-section" id="menu">
      <img src={IMAGES.promoBg} alt="Menu Background" className="menu-section__bg" />
      <div className="menu-section__overlay" />
      <div className="menu-section__content">
        <h2 className="menu-section__title">{t.title}</h2>

        {/* Search Bar */}
        <div className="menu-section__search-bar">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="menu-section__search-input"
          />
        </div>

        {/* Category Filters */}
        <div className="menu-section__categories">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`menu-section__cat-btn${activeCategory === cat ? " menu-section__cat-btn--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Promo Cards - Horizontal Scroll */}
        <div className="menu-section__promos" ref={promosRef} style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '40px' }}>
          {promoData.map((promo) => (
            <div
              key={promo.id}
              className="promo-detail-card"
              style={{ display: 'flex', background: 'white', borderRadius: '24px', overflow: 'hidden', minWidth: '580px', cursor: 'pointer' }}
              onClick={() => setSelectedPromo({
                title: promo.title,
                price: promo.totalPrice,
                image: promo.poster,
                description: promo.description,
                items: promo.items.map(i => i.name),
              })}
            >
              {/* Left: Poster */}
              <div className="promo-detail-card__poster" style={{ width: '40%', flexShrink: 0 }}>
                <img src={promo.poster} alt={promo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Right: Info */}
              <div className="promo-detail-card__info" style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', background: 'white' }}>
                <h3 className="promo-detail-card__title" style={{ color: '#2E6A67', fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.2' }}>
                  {promo.title.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                </h3>
                
                {promo.subtitle && (
                  <p className="promo-detail-card__subtitle" style={{ color: '#333', fontSize: '14px', marginBottom: '16px', lineHeight: '1.4' }}>{promo.subtitle}</p>
                )}

                <div className="promo-detail-card__items" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {promo.items.map((item, idx) => (
                    <div key={idx} className="promo-detail-card__item" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #2E6A67', borderRadius: '24px', padding: '6px 16px', alignItems: 'center' }}>
                      <span className="promo-detail-card__item-name" style={{ color: '#2E6A67', fontSize: '14px', fontWeight: '600' }}>{item.name}</span>
                      <span className="promo-detail-card__item-price" style={{ color: '#A97C50', fontSize: '14px', fontWeight: 'bold' }}>{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="promo-detail-card__total" style={{ color: '#2E6A67', fontSize: '32px', fontWeight: 'bold', textAlign: 'right', marginTop: 'auto', paddingTop: '20px' }}>
                  {promo.totalPrice}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="menu-section__grid">
          {MENU_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`menu-card${!item.available ? " menu-card--unavailable" : ""}`}
              onClick={() => onMenuSelect(item)}
            >
              <img src={item.img} alt={item.name} className="menu-card__img" />
              <div className="menu-card__info" style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="menu-card__name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.name === "creamy butterscoot latte" ? (
                    <>
                      <span style={{ color: '#2E6A67', fontStyle: 'italic', fontWeight: '500' }}>creamy butterscoot</span>
                      <span style={{ color: '#A97C50', fontWeight: 'bold' }}>latte</span>
                    </>
                  ) : item.name === "ice latte" ? (
                    <>
                      <span style={{ color: '#2E6A67', fontStyle: 'italic', fontWeight: '500' }}>ice</span>
                      <span style={{ color: '#A97C50', fontWeight: 'bold' }}>latte</span>
                    </>
                  ) : (
                    <span style={{ color: '#333', fontWeight: 'normal', fontStyle: 'normal' }}>{item.name}</span>
                  )}
                  {item.isBestSeller && <span className="menu-card__star" style={{ color: '#A97C50', fontSize: '18px', marginLeft: '2px' }}>★</span>}
                </span>
                <span className="menu-card__price" style={{ 
                  color: (item.name === "creamy butterscoot latte" || item.name === "ice latte") ? '#A97C50' : '#2E6A67', 
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  {item.price}
                </span>
              </div>
            </div>
          ))}
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

