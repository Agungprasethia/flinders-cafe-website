import { useState, useEffect } from "react";
import "./DetailMenu.css";

import imgMenuItem from "../../assets/images/menu-food-gray.png";

const menuData = [
  {
    id: 1,
    name: "CHICKEN PARMIGIANA",
    info: "dipesan 50x",
    price: "55k",
    category: "food",
    image: imgMenuItem,
  },
  {
    id: 2,
    name: "Chicken Parmigiana Nananana",
    info: "ratings *****",
    price: "55k",
    category: "food",
    image: imgMenuItem,
  },
  {
    id: 3,
    name: "CHICKEN CORDONBLUE",
    info: "ratings *****",
    price: "55k",
    category: "food",
    image: imgMenuItem,
  },
  {
    id: 4,
    name: "Chicken Parmigiana Nananana",
    info: "ratings *****",
    price: "55k",
    category: "drink",
    image: imgMenuItem,
  },
  {
    id: 5,
    name: "NASI GORENG SUNA CEKUH",
    info: "ratings *****",
    price: "55k",
    category: "food",
    image: imgMenuItem,
  },
  {
    id: 6,
    name: "Mie Goreng Spesial",
    info: "best seller",
    price: "Rp.50.000",
    category: "food",
    image: imgMenuItem,
    isBestSeller: true,
  },
];

const categories = ["drink", "food", "desert", "snack", "special"];

export default function DetailMenu({ onClose }) {
  const [activeCategory, setActiveCategory] = useState("drink");
  const [selectedItem, setSelectedItem] = useState(null);
  const [spicyLevel, setSpicyLevel] = useState(2);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.body.classList.add("dm-body-lock");
    return () => document.body.classList.remove("dm-body-lock");
  }, []);

  const filtered = menuData.filter(
    (m) =>
      (activeCategory === "drink" || m.category === activeCategory) &&
      m.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (selectedItem) {
    return (
      <div className="dm-overlay">
        <div className="dm-bg-dim" onClick={onClose} />
        <div className="dm-detail-modal">
          <button className="dm-back-btn" onClick={() => setSelectedItem(null)}>
            &lt;
          </button>

          <div className="dm-detail-image-wrap">
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="dm-detail-image"
            />
          </div>

          <div className="dm-divider" />

          <div className="dm-detail-info">
            <div className="dm-detail-header">
              <div>
                <h2 className="dm-detail-name">{selectedItem.name}</h2>
                {selectedItem.isBestSeller && (
                  <p className="dm-best-seller">best seller</p>
                )}
              </div>
              <span className="dm-detail-price">{selectedItem.price}</span>
            </div>

            <div className="dm-spicy-section">
              <div className="dm-spicy-track">
                <div
                  className="dm-spicy-fill"
                  style={{ width: `${(spicyLevel / 5) * 100}%` }}
                />
              </div>
              <div className="dm-spicy-track" style={{ marginTop: 8 }}>
                <div
                  className="dm-spicy-fill"
                  style={{ width: `${(spicyLevel / 5) * 60}%` }}
                />
              </div>
              <p className="dm-spicy-label">Adjust spicy level</p>
              <div className="dm-spicy-btns">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    className={`dm-spicy-btn ${spicyLevel === lvl ? "dm-spicy-btn--active" : ""}`}
                    onClick={() => setSpicyLevel(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dm-overlay">
      <div className="dm-bg-solid" onClick={onClose} />

      <div className="dm-list-container">
        <div className="dm-list-header">
          <div className="dm-searchbar-wrap">
            <input
              className="dm-searchbar"
              type="text"
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="dm-category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`dm-tab ${activeCategory === cat ? "dm-tab--active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <h1 className="dm-menu-title">MENU</h1>

          {onClose && (
            <button className="dm-close-btn" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <div className="dm-menu-grid">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="dm-menu-card"
              onClick={() => setSelectedItem(item)}
            >
              <div className="dm-card-img-wrap">
                <img src={item.image} alt={item.name} className="dm-card-img" />
              </div>
              <div className="dm-card-info">
                <p className="dm-card-name">{item.name}</p>
                <p className="dm-card-sub">{item.info}</p>
              </div>
              <span className="dm-card-price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
