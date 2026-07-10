import { useState } from "react";
import "./DetailPromo.css";

const imgBackground =
  "https://www.figma.com/api/mcp/asset/bde86bed-fa6e-4451-8150-bd96983e8c8a";
const imgCoupleCombo =
  "https://www.figma.com/api/mcp/asset/6cf25a08-8d7e-458d-bd40-6199783d7bcb";
const imgAsianFlavours =
  "https://www.figma.com/api/mcp/asset/33ad0d6e-bfba-4cb2-88b5-5d6e14997577";
const imgLunchPackage =
  "https://www.figma.com/api/mcp/asset/783e665c-cec5-4acf-ab07-6579f2ee3555";
const imgPadels =
  "https://www.figma.com/api/mcp/asset/0741847d-d0e1-4402-b63d-713c0fb237ae";

const promoList = [
  {
    id: "promo-1",
    title: "Couple Combo",
    description: "Paket spesial untuk berdua. Nikmati momen bersama dengan menu pilihan terbaik dari dapur kami.",
    discount: "25%",
    image: imgCoupleCombo,
    items: JSON.stringify([
      { id: 1, name: "Spaghetti Bolognese", price: "Rp.55,000" },
      { id: 2, name: "Mushroom Stuffed Chicken", price: "Rp.75,000" },
      { id: 3, name: "Lava Cake", price: "Rp.35,000" },
      { id: 4, name: "Iced Tea", price: "Rp.15,000" },
    ]),
  },
  {
    id: "promo-cd042624-6041-4688-a2a0-6085395eeabd",
    title: "Sunday Promo",
    description: "Promo makanan hari minggu",
    discount: "10%",
    image: null,
    valid_until: "10/08/2026",
    active: true,
    items: "[{\"id\": 4, \"name\": \"mie goreng spesial\", \"price\": \"55k\", \"category\": \"food\"}, {\"id\": 3, \"name\": \"ice latte\", \"price\": \"55k\", \"category\": \"drink\"}]",
  },
];

export default function DetailPromo({ onClose, promos = promoList }) {
  const [selectedPromo, setSelectedPromo] = useState(null);

  if (selectedPromo) {
    let parsedItems = [];
    try {
      parsedItems = typeof selectedPromo.items === 'string' 
        ? JSON.parse(selectedPromo.items) 
        : (selectedPromo.items || []);
    } catch(e) {
      console.error("Error parsing items JSON", e);
    }

    return (
      <div className="dp-overlay">
        <div className="dp-bg-blur">
          <img src={imgBackground} alt="" className="dp-bg-img" />
          <div className="dp-bg-dim" />
        </div>

        <div className="dp-detail-modal">
          <div className="dp-modal-content">
            <button
              className="dp-back-btn"
              onClick={() => setSelectedPromo(null)}
            >
              &lt;
            </button>

            <div className="dp-detail-top">
              <div className="dp-detail-image-wrap">
                <img
                  src={selectedPromo.image || imgBackground}
                  alt={selectedPromo.title}
                  className="dp-detail-image"
                />
              </div>
              <div className="dp-scrollbar-track">
                <div className="dp-scrollbar-thumb" />
              </div>
            </div>

            <div className="dp-detail-info">
              <h2 className="dp-detail-title">{selectedPromo.title.toLowerCase()}</h2>
              <p className="dp-detail-desc">
                {selectedPromo.description}
                {selectedPromo.discount && <span style={{display: 'block', marginTop: '8px', fontWeight: 'bold', color: '#3f7466'}}>Diskon: {selectedPromo.discount}</span>}
              </p>

              <div className="dp-detail-items-list">
                {parsedItems.map((item, i) => {
                  const words = (item.name || '').split(' ');
                  const italicPart = words.length > 1 ? words.slice(0, -1).join(' ') : words[0];
                  const boldPart = words.length > 1 ? words.slice(-1) : '';

                  return (
                    <div className="dp-item-row" key={item.id || i}>
                      <div className="dp-item-info">
                        <div className="dp-item-name">
                          <span className="dp-item-name-italic">{italicPart}</span>
                          {boldPart && <span className="dp-item-name-bold"> {boldPart}</span>}
                        </div>
                        <div className="dp-item-price">{item.price}</div>
                      </div>
                      <div className="dp-item-quantity">
                        <button className="dp-qty-btn">-</button>
                        <span className="dp-qty-val">2</span>
                        <button className="dp-qty-btn">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="dp-detail-footer">
                <button className="dp-cart-btn">+ keranjang</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dp-overlay">
      <div className="dp-bg-blur">
        <img src={imgBackground} alt="" className="dp-bg-img" />
        <div className="dp-bg-dim" />
      </div>

      <div className="dp-promo-container">
        <div className="dp-promo-header">
          <h1 className="dp-promo-title">
            <span>PROMO</span>
            <span className="dp-promo-month">APRIL</span>
          </h1>
          {onClose && (
            <button className="dp-close-btn" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <div className="dp-promo-grid">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="dp-promo-card"
              onClick={() => setSelectedPromo(promo)}
            >
              <img
                src={promo.image || imgBackground}
                alt={promo.title}
                className="dp-card-img"
              />
              <div className="dp-card-overlay">
                <span className="dp-card-title">{promo.title}</span>
                {promo.discount && <span className="dp-card-price">Diskon {promo.discount}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
