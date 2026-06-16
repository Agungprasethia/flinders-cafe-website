import { useEffect } from "react";
import "./PromoDetailModal.css";

export default function PromoDetailModal({ promo, onClose }) {
  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  if (!promo) return null;

  return (
    <div className="pdm-overlay">
      <div className="pdm-backdrop" onClick={onClose} />
      
      <div className="pdm-content">
        <button className="pdm-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="pdm-image-wrap">
          <img
            src={promo.image}
            alt={promo.title}
            className="pdm-image"
          />
        </div>

        <div className="pdm-info">
          <h2 className="pdm-title">{promo.title}</h2>
          <p className="pdm-price">{promo.price}</p>
          <p className="pdm-desc">{promo.description}</p>
          
          <ul className="pdm-items">
            {promo.items && promo.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
