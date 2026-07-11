import { useEffect, useState, useMemo } from "react";
import "./DetailPromo.css";

import { IMAGES } from "../../constants";

const imgBackground = IMAGES.promo1;

export default function PromoDetailModal({ promo, onClose, onAddToCart, onCartClick }) {
  const [quantities, setQuantities] = useState({});
  const [activeBundleId, setActiveBundleId] = useState(null);

  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  if (!promo) return null;

  let parsedItems = [];
  try {
    parsedItems = typeof promo.items === 'string' 
      ? JSON.parse(promo.items) 
      : (promo.items || []);
  } catch(e) {
    console.error("Error parsing items JSON", e);
  }

  // Fallback to mock data if items are empty so the UI still looks like the mockup
  if (!parsedItems || parsedItems.length === 0) {
    parsedItems = [
      { id: "mock-1", name: "creamy butterscoot latte", price: "Rp.55,000" },
      { id: "mock-2", name: "creamy butterscoot latte", price: "Rp.55,000" },
      { id: "mock-3", name: "creamy butterscoot latte", price: "Rp.55,000" },
    ];
  }

  const isBundlePromo = Array.isArray(parsedItems) && parsedItems.length > 0 && parsedItems[0].isBundle === true;

  // Set default active bundle
  useEffect(() => {
    if (isBundlePromo) {
      setActiveBundleId(parsedItems[0].id);
    } else {
      setActiveBundleId(null);
    }
  }, [promo, isBundlePromo]);

  const activeBundle = isBundlePromo 
    ? parsedItems.find(b => b.id === activeBundleId) || parsedItems[0] 
    : null;

  const displayedItems = isBundlePromo 
    ? (activeBundle?.items || []) 
    : parsedItems;

  // --- Mathematical Logic ---
  const parsePrice = (priceStr) => {
    if (priceStr === undefined || priceStr === null) return 0;
    if (typeof priceStr === "number") return priceStr;
    const str = String(priceStr).toLowerCase();
    const numStr = str.replace(/[^0-9]/g, "");
    if (!numStr) return 0;
    let num = parseInt(numStr, 10);
    if (str.endsWith("k")) {
      num *= 1000;
    }
    return num;
  };

  const getQty = (id) => quantities[id] !== undefined ? quantities[id] : 1;

  const handleIncrement = (id) => {
    setQuantities(prev => ({ ...prev, [id]: getQty(id) + 1 }));
  };

  const handleDecrement = (id) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, getQty(id) - 1) }));
  };

  const calculateTotal = () => {
    let total = 0;
    displayedItems.forEach((item, i) => {
      total += parsePrice(item.price) * getQty(item.id || i);
    });
    return total;
  };

  const applyDiscount = (total) => {
    if (!promo.discount) return total;
    const discStr = String(promo.discount).toLowerCase();
    if (discStr.includes('%')) {
      const pct = parseInt(discStr.replace(/[^0-9]/g, '')) || 0;
      return total - (total * pct / 100);
    } else {
      let amt = parseInt(discStr.replace(/[^0-9]/g, '')) || 0;
      if (discStr.endsWith("k")) amt *= 1000;
      return Math.max(0, total - amt);
    }
  };

  const rawTotal = isBundlePromo ? parsePrice(activeBundle?.price || 0) : calculateTotal();
  const finalTotal = applyDiscount(rawTotal);

  const formatPrice = (num) => `Rp.${num.toLocaleString("id-ID")}`;
  
  const formatItemPrice = (priceStr) => {
    const num = parsePrice(priceStr);
    if (num === 0 && priceStr) return priceStr; // fallback if parsing fails
    return formatPrice(num);
  };
  // --------------------------

  return (
    <div className="dp-overlay" style={{ zIndex: 1000 }}>
      <div className="dp-bg-blur" onClick={onClose}>
        <div className="dp-bg-dim" />
      </div>

      <div className="dp-detail-modal">
        <div className="dp-modal-content">
          <button
            className="dp-back-btn"
            onClick={onClose}
          >
            &lt;
          </button>

          <div className="dp-detail-top">
            <div className="dp-detail-image-wrap">
              <img
                src={promo.image || imgBackground}
                alt={promo.title}
                className="dp-detail-image"
              />
            </div>
            <div className="dp-scrollbar-track">
              <div className="dp-scrollbar-thumb" />
            </div>
          </div>

          <div className="dp-detail-info">
            <h2 className="dp-detail-title">{promo.title || "Promo"}</h2>
            <p className="dp-detail-desc">
              {promo.description}
              {promo.discount && <span style={{display: 'block', marginTop: '8px', fontWeight: 'bold', color: '#3f7466'}}>Diskon: {promo.discount}</span>}
            </p>

            {/* Dynamic Bundle Tabs */}
            {isBundlePromo && (
              <div className="dp-bundle-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                {parsedItems.map(bundle => (
                  <button
                    key={bundle.id}
                    onClick={() => setActiveBundleId(bundle.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: activeBundleId === bundle.id ? '2px solid #3f7466' : '1px solid #ddd',
                      backgroundColor: activeBundleId === bundle.id ? '#3f7466' : 'white',
                      color: activeBundleId === bundle.id ? 'white' : '#666',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  >
                    {bundle.name}
                  </button>
                ))}
              </div>
            )}

            <div className="dp-detail-items-list">
              {displayedItems.map((item, i) => {
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
                      {!isBundlePromo && <div className="dp-item-price">{formatItemPrice(item.price)}</div>}
                    </div>
                    {!isBundlePromo && (
                      <div className="dp-item-quantity">
                        <button className="dp-qty-btn" onClick={() => handleDecrement(item.id || i)}>-</button>
                        <span className="dp-qty-val">{getQty(item.id || i)}</span>
                        <button className="dp-qty-btn" onClick={() => handleIncrement(item.id || i)}>+</button>
                      </div>
                    )}
                  </div>
                );
              })}
              {displayedItems.length === 0 && (
                <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '16px 0' }}>
                  Tidak ada menu dalam bundle ini
                </div>
              )}
            </div>

            <div className="dp-detail-footer">
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {promo.discount && rawTotal > 0 && (
                  <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '14px' }}>
                    {formatPrice(rawTotal)}
                  </span>
                )}
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#39746c' }}>
                  Total: {formatPrice(finalTotal)}
                </span>
              </div>
              <button 
                className="dp-cart-btn"
                onClick={() => {
                  if (onAddToCart) {
                    onAddToCart({
                      id: isBundlePromo ? `${promo.id}-${activeBundleId}` : (promo.id || 'promo-' + Date.now()),
                      name: isBundlePromo ? `${promo.title || 'Promo Package'} - ${activeBundle?.name}` : (promo.title || 'Promo Package'),
                      price: finalTotal,
                      img: promo.image || imgBackground
                    }, 1);
                  }
                  if (onCartClick) {
                    onCartClick();
                  }
                }}
              >
                + keranjang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
