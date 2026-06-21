import { IMAGES } from "../../constants";

export default function Navbar({ lang = "en", onReservasiClick, onMenuClick, onCartClick }) {
  const texts = {
    en: {
      menu: "Menu",
      promo: "Promo",
      reservasi: "Reservation",
      gallery: "Gallery",
      about: "About",
      cart: "Cart"
    },
    id: {
      menu: "Menu",
      promo: "Promo",
      reservasi: "Reservasi",
      gallery: "Galeri",
      about: "Tentang",
      cart: "Keranjang"
    }
  };

  const t = texts[lang];

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo-box">
          <img
            src={IMAGES.logo}
            alt="Flinders Logo"
            className="navbar__logo-img"
          />
        </div>
        <div className="navbar__brand-text">
          <span className="navbar__brand-name">FLINDERS</span>
          <span className="navbar__brand-sub">CAFE</span>
        </div>
      </div>
      <ul className="navbar__links">
        <li>
          <a href="#menu">{t.menu}</a>
        </li>
        <li>
          <a href="#promo">{t.promo}</a>
        </li>
        <li>
          <a href="#reservasi" onClick={(e) => { e.preventDefault(); onReservasiClick?.(); }}>{t.reservasi}</a>
        </li>
        <li>
          <a href="#gallery">{t.gallery}</a>
        </li>
        <li>
          <a href="#about">{t.about}</a>
        </li>
      </ul>
      <button className="navbar__cta" onClick={onCartClick} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {t.cart}
      </button>
    </nav>
  );
}
