import { useEffect, useState } from "react";
import { IMAGES } from "../../../constants";
import PromoDetailModal from "../../../components/ui/PromoDetailModal";
import { apiRequest } from "../../../lib/api";

export default function PromoSection({ lang = "en" }) {
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promos, setPromos] = useState([]);

  const subtitle = lang === "id"
    ? "Dosis kebahagiaan harian Anda. Temukan paket waktu terbatas dan sajian istimewa."
    : "Your daily dose of happiness. Discover limited time packages and special treats.";

  useEffect(() => {
    const loadPromos = async () => {
      try {
        const result = await apiRequest("/api/promo?active=true");
        setPromos(result);
      } catch (error) {
        setPromos([]);
      }
    };

    loadPromos();
  }, []);

  const openPromo = (promo) => {
    setSelectedPromo({
      title: promo.title || promo.nama || "Promo",
      price: promo.discount || promo.price || "",
      image: promo.image || IMAGES.promo1,
      description: promo.description || promo.deskripsi || "",
      items: (promo.items || []).map((item) => item.name || item),
    });
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
          <p className="promo__subtitle">{subtitle}</p>
        </div>
        <div className="promo__cards">
          {promos.map((promo, index) => (
            <div key={promo.id} className="promo__card" onClick={() => openPromo(promo)}>
              <img
                src={promo.image || (index % 2 === 0 ? IMAGES.promo1 : IMAGES.promo2)}
                alt={promo.title || "Promo"}
                className="promo__card-img"
              />
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
