import { IMAGES } from "../../constants";

export default function Navbar({ lang = "en", onReservasiClick, onMenuClick }) {
  const texts = {
    en: {
      menu: "Menu",
      promo: "Promo",
      gallery: "Gallery",
      about: "About",
      reservasi: "Reservation"
    },
    id: {
      menu: "Menu",
      promo: "Promo",
      gallery: "Galeri",
      about: "Tentang",
      reservasi: "Reservasi"
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
          <a href="#gallery">{t.gallery}</a>
        </li>
        <li>
          <a href="#about">{t.about}</a>
        </li>
      </ul>
      <button className="navbar__cta" onClick={onReservasiClick}>
        {t.reservasi}
      </button>
    </nav>
  );
}
