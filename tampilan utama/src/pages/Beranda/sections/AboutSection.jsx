import { IMAGES } from "../../../constants";

export default function AboutSection({ lang = "en" }) {
  const texts = {
    en: {
      title: "about flinders",
      tagline: "a sophisticated space crafted for your cozy and luxurious moments",
      location: "Location",
      hours: "Open Hours",
      everyday: "Everyday",
      contact: "Contact Us",
      maps: "check on maps →"
    },
    id: {
      title: "tentang flinders",
      tagline: "ruang canggih yang dirancang untuk momen nyaman dan mewah Anda",
      location: "Lokasi",
      hours: "Jam Buka",
      everyday: "Setiap Hari",
      contact: "Hubungi Kami",
      maps: "lihat di peta →"
    }
  };

  const t = texts[lang];

  return (
    <section className="about" id="about">
      <img src={IMAGES.aboutBg} alt="About Background" className="about__bg" />
      <div className="about__overlay" />
      <div className="about__content">
        <div className="about__logo-wrap">
          <img src={IMAGES.logo} alt="Flinders Cafe" className="about__logo" />
        </div>

        {/* MAP SECTION */}
        <div id="map" className="about__map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.260461680812!2d115.23515957330707!3d-8.666761388204078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd241c71ec06c59%3A0x5009ad1a6e2b40ca!2sFlinders%20Cafe!5e0!3m2!1sen!2sid!4v1780663467331!5m2!1sen!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <h2 className="about__title">{t.title}</h2>
        <p className="about__tagline">{t.tagline}</p>

        <div className="about__info-grid">
          <div className="about__info-card">
            <img
              src={IMAGES.iconMap}
              alt="Location"
              className="about__info-icon"
            />
            <h3 className="about__info-label">{t.location}</h3>
            <p className="about__info-text">
              Jl. Merdeka IX No.9, Panjer,<br />
              Denpasar Selatan, Bali<br />
              80235
            </p>
          </div>
          <div className="about__info-card">
            <img
              src={IMAGES.iconClock}
              alt="Open Hours"
              className="about__info-icon"
            />
            <h3 className="about__info-label">{t.hours}</h3>
            <div className="about__hours-row">
              <span className="about__info-text">{t.everyday}</span>
              <span className="about__info-text">11am - 10pm</span>
            </div>
          </div>
          <div className="about__info-card">
            <img
              src={IMAGES.iconPhone}
              alt="Contact"
              className="about__info-icon"
            />
            <h3 className="about__info-label">{t.contact}</h3>
            <p className="about__info-text">08512345678953</p>
            <p className="about__info-text">flinderscaffe@gmail..com</p>
            
            <div className="about__social">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="about__social-link"
              >
                <img
                  src={IMAGES.instagram}
                  alt="Instagram"
                  className="about__social-img"
                />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="about__social-link"
              >
                <img
                  src={IMAGES.whatsapp}
                  alt="WhatsApp"
                  className="about__social-img"
                />
              </a>
              <a
                href="mailto:flinderscaffe@gmail.com"
                className="about__social-link"
              >
                <img
                  src={IMAGES.email}
                  alt="Email"
                  className="about__social-img"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
