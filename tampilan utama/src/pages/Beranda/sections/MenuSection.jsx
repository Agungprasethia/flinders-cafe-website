import { useState } from "react";
import { IMAGES, MENU_CATEGORIES, MENU_ITEMS } from "../../../constants";

export default function MenuSection({ lang = "en", onMenuSelect }) {
  const [activeCategory, setActiveCategory] = useState("food");

  const texts = {
    en: {
      title: "menu",
      searchPlaceholder: "Search menu..."
    },
    id: {
      title: "menu",
      searchPlaceholder: "Cari menu..."
    }
  };

  const t = texts[lang];

  return (
    <section className="menu-section" id="menu">
      <img
        src={IMAGES.promoBg}
        alt="Menu Background"
        className="menu-section__bg"
      />
      <div className="menu-section__overlay" />
      <div className="menu-section__content">
        <h2 className="menu-section__title">{t.title}</h2>
        <div className="menu-section__search-bar">
          <span className="menu-section__search-icon">🔍</span>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="menu-section__search-input"
          />
        </div>
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
        <div className="menu-section__grid">
          {MENU_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`menu-card${!item.available ? " menu-card--unavailable" : ""}`}
              onClick={() => onMenuSelect(item)}
            >
              <img src={item.img} alt={item.name} className="menu-card__img" />
              <div className="menu-card__info">
                <span className="menu-card__name">{item.name}</span>
                <span className="menu-card__price">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
