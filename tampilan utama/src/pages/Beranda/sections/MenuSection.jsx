import { useEffect, useState } from "react";
import { IMAGES } from "../../../constants";
import PromoDetailModal from "../../../components/ui/PromoDetailModal";
import { apiRequest } from "../../../lib/api";

export default function MenuSection({ onMenuSelect }) {
  const [activeCategory, setActiveCategory] = useState("all menu");
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [menus, setMenus] = useState([]);
  const [promos, setPromos] = useState([]);
  const [search, setSearch] = useState("");

  const categories = [
    "all menu",
    "recomended",
    "best seller",
    "drink",
    "food",
    "dessert & snack",
  ];

  useEffect(() => {
    const loadContent = async () => {
      const categoryMap = {
        "all menu": "all",
        recomended: "all",
        "best seller": "all",
        "dessert & snack": "dessert",
      };
      const params = new URLSearchParams();
      const category = categoryMap[activeCategory] || activeCategory;

      if (category !== "all") params.set("category", category);
      if (activeCategory === "recomended") params.set("is_recommended", "true");
      if (activeCategory === "best seller") params.set("is_best_seller", "true");
      if (search) params.set("search", search);

      try {
        const [menuResult, promoResult] = await Promise.all([
          apiRequest(`/api/menus?${params.toString()}`),
          apiRequest("/api/promo?active=true"),
        ]);
        setMenus(menuResult);
        setPromos(promoResult);
      } catch (error) {
        setMenus([]);
        setPromos([]);
      }
    };

    loadContent();
  }, [activeCategory, search]);

  const formatPrice = (price) => {
    if (typeof price === "number") return `${Math.round(price / 1000)}k`;
    return price || "";
  };

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
    <section className="menu-section" id="menu">
      <img src={IMAGES.menuBg} alt="Menu Background" className="menu-section__bg" />
      <div className="menu-section__overlay" />
      <div className="menu-section__content">
        <h2 className="menu-section__title">menu</h2>

        <div className="menu-section__search-bar">
          <input
            type="text"
            className="menu-section__search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="menu-section__categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`menu-section__cat-btn${activeCategory === cat ? " menu-section__cat-btn--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="menu-section__promos">
          {promos.map((promo) => (
            <div key={promo.id} className="promo-detail-card" onClick={() => openPromo(promo)}>
              <div className="promo-detail-card__poster">
                <img src={promo.image || IMAGES.promo1} alt={promo.title || "promo"} />
              </div>
              <div className="promo-detail-card__info">
                <div className="promo-detail-card__logo">
                  <img src={IMAGES.logo} alt="Flinders" />
                </div>
                <h3 className="promo-detail-card__title">
                  <span className="promo-detail-card__title-regular">{promo.title || promo.nama || "Promo"}</span>
                </h3>
                <p className="promo-detail-card__subtitle">
                  {promo.description || promo.deskripsi || ""}
                </p>
                <div className="promo-detail-card__total">
                  {promo.discount || promo.price || ""}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="menu-section__scrollbar-track">
          <div className="menu-section__scrollbar-thumb" />
        </div>

        <div className="menu-section__grid">
          {menus.map((item) => (
            <div
              key={item.id}
              className="menu-card"
              onClick={() => onMenuSelect && onMenuSelect(item)}
            >
              <div className="menu-card__img-wrap">
                <img src={item.image || IMAGES.menuFood} alt={item.name} className="menu-card__img" />
              </div>
              <div className="menu-card__info">
                <span className="menu-card__name">
                  <span className="txt-regular-black">{item.name}</span>
                  {item.recommended && <span className="menu-card__star">★</span>}
                </span>
                <span className="menu-card__price">{formatPrice(item.price)}</span>
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
