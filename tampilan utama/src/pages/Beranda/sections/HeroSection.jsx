import { IMAGES } from "../../../constants";

export default function HeroSection({ lang, toggleLang, onReservasiClick, onMenuClick, onCartClick }) {
  const texts = {
    en: {
      menuBtn: "Our Menu",
      reservBtn: "Reservation",
      langLabel: "english"
    },
    id: {
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
        <div className="hero__title">
          <span className="hero__tagline-main">FLINDERS</span>
          <span className="hero__tagline-sub">CAFE</span>
        </div>
      </div>
      <div className="hero__cta-group">
        <button
          className="hero__btn hero__btn--secondary"
          onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "8px"}}>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          {t.menuBtn}
        </button>
        <button
          className="hero__btn hero__btn--primary"
          onClick={onReservasiClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "8px"}}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {texts[lang].reservBtn}
        </button>
      </div>
      <div className="hero__lang" onClick={toggleLang} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hero__lang-icon">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span className="hero__lang-text">{t.langLabel}</span>
      </div>
    </section>
  );
}
