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
    id: 1,
    title: "Couple Combo",
    price: "150K++",
    image: imgCoupleCombo,
    description:
      "Paket spesial untuk berdua. Nikmati momen bersama dengan menu pilihan terbaik dari dapur kami.",
    items: [
      { name: "Spaghetti Bolognese", price: "Rp.55,000" },
      { name: "Mushroom Stuffed Chicken", price: "Rp.75,000" },
      { name: "Lava Cake", price: "Rp.35,000" },
      { name: "Iced Tea", price: "Rp.15,000" },
    ],
  },
  {
    id: 2,
    title: "Asian Flavours",
    price: "120K++",
    image: imgAsianFlavours,
    description:
      "Jelajahi cita rasa Asia yang otentik dengan paduan bumbu pilihan chef kami.",
    items: [
      { name: "Tom Yum Soup", price: "Rp.45,000" },
      { name: "Nasi Goreng Spesial", price: "Rp.40,000" },
      { name: "Dim Sum Basket", price: "Rp.35,000" },
      { name: "Thai Iced Tea", price: "Rp.20,000" },
    ],
  },
  {
    id: 3,
    title: "Lunch Package",
    price: "85K++",
    image: imgLunchPackage,
    description:
      "Paket makan siang hemat dan mengenyangkan, cocok untuk break di tengah hari.",
    items: [
      { name: "Main Course pilihan", price: "Rp.50,000" },
      { name: "Sup Sayuran", price: "Rp.20,000" },
      { name: "Es Teh Manis", price: "Rp.10,000" },
      { name: "Dessert of the Day", price: "Rp.25,000" },
    ],
  },
  {
    id: 4,
    title: "Padels & Pilates",
    price: "200K++",
    image: imgPadels,
    description:
      "Paket kolaborasi spesial untuk kamu yang aktif. Makan sehat setelah sesi olahraga.",
    items: [
      { name: "Salad Bowl", price: "Rp.65,000" },
      { name: "Grilled Chicken", price: "Rp.75,000" },
      { name: "Smoothie Bowl", price: "Rp.55,000" },
      { name: "Mineral Water", price: "Rp.15,000" },
    ],
  },
];

export default function DetailPromo({ onClose }) {
  const [selectedPromo, setSelectedPromo] = useState(null);

  if (selectedPromo) {
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
                  src={selectedPromo.image}
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
                Bikin momen kumpul atau me-time kamu makin sempurna tanpa bikin kantong bolong. Sekarang kamu bisa nikmatin kombinasi lengkap dengan minuman segarnya cuma seharga {selectedPromo.price} Hemat hingga 25%
              </p>
              
              <div className="dp-detail-items-list">
                {selectedPromo.items.map((item, i) => (
                  <div className="dp-item-row" key={i}>
                    <div className="dp-item-info">
                      <div className="dp-item-name">
                        <span className="dp-item-name-italic">{item.name.split(' ').slice(0, -1).join(' ')}</span>
                        <span className="dp-item-name-bold"> {item.name.split(' ').slice(-1)}</span>
                      </div>
                      <div className="dp-item-price">{item.price}</div>
                    </div>
                    <div className="dp-item-quantity">
                      <button className="dp-qty-btn">-</button>
                      <span className="dp-qty-val">2</span>
                      <button className="dp-qty-btn">+</button>
                    </div>
                  </div>
                ))}
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
          {promoList.map((promo) => (
            <div
              key={promo.id}
              className="dp-promo-card"
              onClick={() => setSelectedPromo(promo)}
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="dp-card-img"
              />
              <div className="dp-card-overlay">
                <span className="dp-card-title">{promo.title}</span>
                <span className="dp-card-price">{promo.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
