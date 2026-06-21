import { useEffect, useState } from "react";
import "./MenuDetailModal.css";

export default function MenuDetailModal({ menu, lang = "en", onClose, onCartClick }) {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  if (!menu) return null;

  // Build description based on menu item
  const descriptions = {
    "creamy butterscoot latte":
      "Espresso murni yang dipadukan dengan susu gurih dan sirup karamel butterscoot khas Flinders Cafe. Pilihan tepat untuk penikmat kopi dengan sensasi manis yang lembut. Penggunaan gula bisa di sesuaikan",
    "chicken parmigiana":
      "Ayam goreng renyah yang dipanggang dengan saus tomat khas dan keju mozzarella meleleh. Disajikan dengan salad segar dan kentang goreng.",
    "ice latte":
      "Perpaduan espresso premium dengan susu segar dan es batu. Minuman dingin yang menyegarkan untuk menemani harimu.",
    "frozen mint lemonade":
      "Lemonade segar yang dipadukan dengan mint alami dan es serut. Sensasi dingin yang menyegarkan di setiap tegukan.",
  };

  const subtitles = {
    "creamy butterscoot latte": "adjustable sweetness level",
    "chicken parmigiana": "chef's recommendation",
    "ice latte": "adjustable sweetness level",
    "frozen mint lemonade": "refreshing choice",
  };

  const menuName = menu.name?.toLowerCase() || "";
  const description =
    descriptions[menuName] ||
    `Nikmati kelezatan ${menu.name} dengan resep spesial dari Flinders Cafe. Cocok untuk menemani waktu bersantai Anda.`;
  const subtitle = subtitles[menuName] || "flinders cafe special";

  // Format price to Rp format
  const formatPrice = (price) => {
    if (!price) return "";
    const numStr = price.replace(/[^0-9]/g, "");
    if (numStr) {
      const num = parseInt(numStr, 10) * 1000;
      return `Rp.${num.toLocaleString("id-ID")}`;
    }
    return price;
  };

  return (
    <div className="mdm-overlay">
      {/* Backdrop */}
      <div className="mdm-backdrop" onClick={onClose} />

      {/* Modal Content */}
      <div className="mdm-content">
        <button className="mdm-back-btn" onClick={onClose} aria-label="Back">
          &lt;
        </button>

        <div className="mdm-image-wrap">
          <img
            src={menu.img || menu.image}
            alt={menu.name}
            className="mdm-image"
          />
        </div>

        <div className="mdm-info">
          <div className="mdm-header">
            <div>
              <h2 className="mdm-name">{menu.name}</h2>
              <p className="mdm-subtitle">{subtitle}</p>
            </div>
            <span className="mdm-price">{formatPrice(menu.price)}</span>
          </div>

          <p className="mdm-desc">{description}</p>

          <div className="mdm-actions">
            <div className="mdm-quantity">
              <button className="mdm-qty-btn" onClick={decrement}>
                -
              </button>
              <span className="mdm-qty-value">{quantity}</span>
              <button className="mdm-qty-btn" onClick={increment}>
                +
              </button>
            </div>
            <button className="mdm-cart-btn" onClick={onCartClick}>
              + Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
