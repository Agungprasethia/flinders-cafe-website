import { useState, useEffect } from "react";
import "./CartModal.css";
import { IMAGES } from "../../constants";
import { apiRequest } from "../../lib/api";

export default function CartModal({ lang = "en", isOpen, onClose }) {
  const texts = {
    id: {
      title: "Keranjang Saya",
      confirmTitle: "Konfirmasi Keranjang Saya",
      taxLabel: "tax & service 10%",
      totalLabel: "total",
      checkout: "checkout",
      nameLabel: "nama",
      tableLabel: "meja",
      sendWA: "Kirim via Whatsapp",
      waGreeting: "Halo Flinders Cafe, saya ingin memesan:",
      waName: "Nama",
      waTable: "Meja",
      waOrder: "Pesanan"
    },
    en: {
      title: "My Cart",
      confirmTitle: "Confirm My Cart",
      taxLabel: "tax & service 10%",
      totalLabel: "total",
      checkout: "checkout",
      nameLabel: "name",
      tableLabel: "table",
      sendWA: "Send via Whatsapp",
      waGreeting: "Hello Flinders Cafe, I would like to order:",
      waName: "Name",
      waTable: "Table",
      waOrder: "Order"
    }
  };
  const t = texts[lang] || texts.en;
  const [step, setStep] = useState(1); // 1 = Keranjang, 2 = Konfirmasi
  const [formData, setFormData] = useState({ name: "", table: "" });
  
  // Dummy data matching the Figma design
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setTimeout(() => setStep(1), 300); // reset after close animation
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQ = item.quantity + delta;
          return { ...item, quantity: newQ > 0 ? newQ : 1 };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };


  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const formatPrice = (price) => {
    return `Rp. ${price.toLocaleString("id-ID")}`;
  };

  const handleCheckout = () => {
    setStep(2);
  };

  const handleWA = async () => {
    // Generate text for WhatsApp
    let text = `${t.waGreeting}\n\n`;
    text += `${t.waName}: ${formData.name}\n${t.waTable}: ${formData.table}\n\n${t.waOrder}:\n`;
    items.forEach(item => {
      text += `- ${item.name} (${item.quantity}x) = ${formatPrice(item.price * item.quantity)}\n`;
    });
    text += `\nTax & Service (10%): ${formatPrice(tax)}`;
    text += `\nTotal: ${formatPrice(total)}`;

    await apiRequest("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        nama: formData.name,
        meja: formData.table,
        items,
        subtotal,
        tax,
        total,
      }),
    }).catch(() => null);

    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
    onClose();
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cart-close" onClick={onClose}>✕</button>

        {step === 1 ? (
          <div className="cart-content">
            <h2 className="cart-title">{t.title}</h2>

            <div className="cart-items">
              {items.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#888", fontFamily: "DM Sans, sans-serif" }}>
                  Keranjang belanja Anda kosong
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item__img-wrap">
                      <img src={item.img} alt={item.name} className="cart-item__img" />
                    </div>
                    <div className="cart-item__info">
                      <h3 className="cart-item__name">{item.name}</h3>
                      <p className="cart-item__price">{formatPrice(item.price)}</p>
                    </div>
                    <div className="cart-item__qty-controls">
                      <button onClick={() => updateQuantity(item.id, -1)} className="cart-qty-btn">-</button>
                      <span className="cart-qty-val">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="cart-qty-btn">+</button>
                      <button onClick={() => removeItem(item.id)} className="cart-remove-btn" title="Hapus">✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-footer__totals">
                <div className="cart-footer__row">
                  <span className="cart-footer__label">tax & service 10%</span>
                  <span className="cart-footer__value-small">{formatPrice(tax)}</span>
                </div>
                <div className="cart-footer__row">
                  <span className="cart-footer__label-total">total</span>
                  <span className="cart-footer__value-total">{formatPrice(total)}</span>
                </div>
              </div>
              <button 
                className="cart-btn-checkout" 
                onClick={handleCheckout}
                disabled={items.length === 0}
                style={{ opacity: items.length === 0 ? 0.5 : 1, cursor: items.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                {t.checkout}
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-header-with-back">
              <button className="cart-back-btn" onClick={() => setStep(1)}>&lt;</button>
              <h2 className="cart-title">{t.confirmTitle}</h2>
            </div>

            <div className="cart-form">
              <div className="cart-form__row">
                <label>{t.nameLabel}</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="cart-form__row">
                <label>{t.tableLabel}</label>
                <input 
                  type="text" 
                  value={formData.table} 
                  onChange={(e) => setFormData({...formData, table: e.target.value})} 
                />
              </div>
            </div>

            <div className="cart-items cart-items--readonly">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__img-wrap">
                    <img src={item.img} alt={item.name} className="cart-item__img" />
                  </div>
                  <div className="cart-item__info">
                    <h3 className="cart-item__name">{item.name}</h3>
                    <p className="cart-item__price">{formatPrice(item.price)}</p>
                  </div>
                  <div className="cart-item__qty-readonly">
                    {item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer cart-footer--konfirmasi">
              <div className="cart-footer__totals">
                <div className="cart-footer__row">
                  <span className="cart-footer__label">tax & service 10%</span>
                  <span className="cart-footer__value-small">{formatPrice(tax)}</span>
                </div>
                <div className="cart-footer__row">
                  <span className="cart-footer__label-total">total</span>
                  <span className="cart-footer__value-total">{formatPrice(total)}</span>
                </div>
              </div>
              <button 
                className="cart-btn-wa" 
                onClick={handleWA}
                disabled={!formData.name || !formData.table}
              >
                {t.sendWA}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
