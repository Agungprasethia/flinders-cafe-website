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
        <div className="pdm-image-wrap">
          <button className="pdm-close-btn" onClick={onClose}>
            &lt;
          </button>
          <img
            src={promo.image}
            alt={promo.title}
            className="pdm-image"
          />
        </div>

        <div className="pdm-info">
          <h2 className="pdm-title">{promo.title.replace('\n', ' ')}</h2>
          <p className="pdm-desc">{promo.description}</p>
          
          <div className="pdm-footer" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="pdm-action-btn" style={{ background: '#39746c', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '24px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
              keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
