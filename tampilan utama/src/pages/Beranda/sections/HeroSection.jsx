import { IMAGES } from "../../../constants";

export default function HeroSection({ lang, toggleLang, onReservasiClick, onMenuClick }) {
  const texts = {
    en: {
      subTagline: "Elegance in Every Sip, Comfort in Every Bite",
      menuBtn: "Our Menu",
      reservBtn: "Reservation",
      langLabel: "english"
    },
    id: {
      subTagline: "Keanggunan di Setiap Tegukan, Kenyamanan di Setiap Gigitan",
      menuBtn: "Menu Kami",
      reservBtn: "Reservasi",
      langLabel: "indonesia"
    }
  };

  const t = texts[lang];

  return (
    <section className="hero" id="home">
      <img src={IMAGES.heroBg} alt="Hero Background" className="hero__bg" />
      <div className="hero__overlay" />
      <div className="hero__logo-center">
        <img src={IMAGES.logo} alt="Flinders Cafe" className="hero__logo" />
        <p className="hero__tagline">FLINDERS CAFE</p>
        <p className="hero__sub-tagline">{t.subTagline}</p>
      </div>
      <div className="hero__cta-group">
        <button
          className="hero__btn hero__btn--secondary"
          onClick={onMenuClick}
        >
          <span>☰</span> {t.menuBtn}
        </button>
        <button
          className="hero__btn hero__btn--primary"
          onClick={onReservasiClick}
        >
          <span>📅</span> {t.reservBtn}
        </button>
      </div>
      <div className="hero__lang" onClick={toggleLang} style={{ cursor: "pointer" }}>
        <span className="hero__lang-icon">🌐</span>
        <span className="hero__lang-text">{t.langLabel}</span>
      </div>
    </section>
  );
}
