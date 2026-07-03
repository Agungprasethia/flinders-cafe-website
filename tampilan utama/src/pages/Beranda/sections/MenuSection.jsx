import { useState, useRef, useEffect } from "react";
import { IMAGES, MENU_ITEMS } from "../../../constants";
import PromoDetailModal from "../../../components/ui/PromoDetailModal";
import { getMenus } from "../../../services/api";

export default function MenuSection({ lang = "en", onMenuSelect }) {
  const [activeCategory, setActiveCategory] = useState("recomended");
  const [selectedPromo, setSelectedPromo] = useState(null);
  const promosRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollData, setScrollData] = useState({ thumbWidth: 100, thumbLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Scrollbar thumb dragging state
  const [isThumbDragging, setIsThumbDragging] = useState(false);
  const [thumbStartX, setThumbStartX] = useState(0);
  const [thumbStartScrollLeft, setThumbStartScrollLeft] = useState(0);

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    if (scrollWidth <= clientWidth) {
      setScrollData({ thumbWidth: 100, thumbLeft: 0 });
      return;
    }
    const widthPercentage = (clientWidth / scrollWidth) * 100;
    const maxScrollLeft = scrollWidth - clientWidth;
    const scrollPercentage = scrollLeft / maxScrollLeft;
    const maxThumbLeft = 100 - widthPercentage;
    const leftPercentage = scrollPercentage * maxThumbLeft;
    
    setScrollData({ thumbWidth: widthPercentage, thumbLeft: leftPercentage });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - promosRef.current.offsetLeft);
    setScrollLeft(promosRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - promosRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    promosRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTrackClick = (e) => {
    if (!trackRef.current || !promosRef.current || isThumbDragging) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;
    const trackWidth = trackRect.width;
    
    const thumbWidthPx = (scrollData.thumbWidth / 100) * trackWidth;
    let newThumbLeft = clickX - (thumbWidthPx / 2);
    
    if (newThumbLeft < 0) newThumbLeft = 0;
    if (newThumbLeft > trackWidth - thumbWidthPx) newThumbLeft = trackWidth - thumbWidthPx;
    
    const scrollPercentage = newThumbLeft / (trackWidth - thumbWidthPx);
    const maxScrollLeft = promosRef.current.scrollWidth - promosRef.current.clientWidth;
    
    promosRef.current.scrollTo({
      left: scrollPercentage * maxScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleThumbMouseDown = (e) => {
    e.stopPropagation();
    setIsThumbDragging(true);
    setThumbStartX(e.clientX);
    setThumbStartScrollLeft(promosRef.current.scrollLeft);
  };

  useEffect(() => {
    const handleThumbMouseMove = (e) => {
      if (!isThumbDragging || !trackRef.current || !promosRef.current) return;
      e.preventDefault();
      
      const trackWidth = trackRef.current.clientWidth;
      const deltaX = e.clientX - thumbStartX;
      
      const { scrollWidth, clientWidth } = promosRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      const thumbWidthPx = (scrollData.thumbWidth / 100) * trackWidth;
      const maxThumbTravel = trackWidth - thumbWidthPx;
      
      if (maxThumbTravel > 0) {
        const scrollPerPixel = maxScrollLeft / maxThumbTravel;
        let newScrollLeft = thumbStartScrollLeft + (deltaX * scrollPerPixel);
        
        if (newScrollLeft < 0) newScrollLeft = 0;
        if (newScrollLeft > maxScrollLeft) newScrollLeft = maxScrollLeft;
        
        promosRef.current.scrollLeft = newScrollLeft;
      }
    };

    const handleThumbMouseUp = () => {
      setIsThumbDragging(false);
    };

    if (isThumbDragging) {
      window.addEventListener('mousemove', handleThumbMouseMove);
      window.addEventListener('mouseup', handleThumbMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleThumbMouseMove);
      window.removeEventListener('mouseup', handleThumbMouseUp);
    };
  }, [isThumbDragging, thumbStartX, thumbStartScrollLeft, scrollData.thumbWidth]);

  useEffect(() => {
    if (promosRef.current) {
      handleScroll({ target: promosRef.current });
    }
  }, []);

  const categories = [
    "recomended", // spelled with one m as requested in the screenshot
    "best seller",
    "drink",
    "food",
    "dessert & snack"
  ];

  const promoData = [
    {
      id: 1,
      // Title parts with mixed typography
      titleParts: [
        { text: "lunch package", style: "regular" },
        { text: "\n" },
        { text: "deals", style: "italic" },
      ],
      poster: IMAGES.promo2,
      items: [
        { name: "salted egg chicken", price: "59k" },
        { name: "nasi goreng suna cekuh", price: "55k" },
        { name: "pasta chilli oil", price: "55k" },
        { name: "enoki beef roll", price: "65k" },
        { name: "fried wonton with chilli oil", price: "35k" },
      ],
      totalPrice: "65k",
      description: lang === "id"
        ? "Paket makan siang hemat dan mengenyangkan."
        : "Affordable and filling lunch package.",
    },
    {
      id: 2,
      titleParts: [
        { text: "asian ", style: "italic" },
        { text: "flavours", style: "regular" },
      ],
      subtitle: "nikmati cita rasa khas asian versi dari\nflinders cafe yang sangat nikmat.",
      poster: IMAGES.promo1,
      items: [
        { name: "salted egg chicken", price: "59k" },
        { name: "nasi goreng suna cekuh", price: "55k" },
        { name: "pasta chilli oil", price: "55k" },
        { name: "enoki beef roll", price: "65k" },
        { name: "fried wonton with chilli oil", price: "35k" },
      ],
      totalPrice: "35k~65k",
      description: lang === "id"
        ? "Jelajahi cita rasa Asia yang otentik."
        : "Explore authentic Asian flavors.",
    },
    {
      id: 3,
      titleParts: [
        { text: "flinders ", style: "italic" },
        { text: "specials", style: "regular" },
      ],
      subtitle: "nikmati hidangan spesial dari flinders cafe.",
      poster: IMAGES.promo2,
      items: [
        { name: "creamy butterscoot latte", price: "55k" },
        { name: "chicken parmigiana", price: "55k" },
        { name: "ice latte", price: "55k" },
        { name: "mie goreng spesial", price: "55k" },
        { name: "frozen mint lemonade", price: "55k" },
      ],
      totalPrice: "55k",
      description: lang === "id"
        ? "Menu spesial pilihan."
        : "Special selected menu.",
    },
  ];

  // Dummy menu data to match screenshot
  const dummyMenuData = [
    { id: 1, name: "creamy butterscoot latte", price: "55k", img: IMAGES.menuFood, hasStar: true },
    { id: 2, name: "chicken parmigiana", price: "55k", img: IMAGES.menuFood, hasStar: false },
    { id: 3, name: "ice latte", price: "55k", img: IMAGES.menuFood, hasStar: false },
    { id: 4, name: "mie goreng spesial", price: "55k", img: IMAGES.menuFood, hasStar: false },
    { id: 5, name: "creamy butterscoot latte", price: "55k", img: IMAGES.menuFood, hasStar: false },
    { id: 6, name: "chicken parmigiana", price: "55k", img: IMAGES.menuFood, hasStar: false },
    { id: 7, name: "ice latte", price: "55k", img: IMAGES.menuFood, hasStar: false },
    { id: 8, name: "mie goreng spesial", price: "55k", img: IMAGES.menuFood, hasStar: false },
  ];

  const [menuData, setMenuData] = useState(dummyMenuData);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getMenus({ category: activeCategory });
        if (data && data.length > 0) {
          setMenuData(data);
        } else {
          setMenuData(dummyMenuData);
        }
      } catch (err) {
        console.warn("[MenuSection] Backend belum aktif, menggunakan data dummy:", err.message);
        setMenuData(dummyMenuData);
      }
    };
    fetchMenus();
  }, [activeCategory]);

  // Render title with mixed typography
  const renderTitle = (titleParts) => {
    return titleParts.map((part, i) => {
      if (part.text === "\n") return <br key={i} />;
      const className =
        part.style === "italic"
          ? "promo-detail-card__title-italic"
          : "promo-detail-card__title-regular";
      return <span key={i} className={className}>{part.text}</span>;
    });
  };

  return (
    <section className="menu-section" id="menu">
      <img src={IMAGES.menuBg} alt="Menu Background" className="menu-section__bg" />
      <div className="menu-section__overlay" />
      <div className="menu-section__content">
        <h2 className="menu-section__title">menu</h2>

        {/* Search Bar */}
        <div className="menu-section__search-bar">
          <input
            type="text"
            className="menu-section__search-input"
          />
        </div>

        {/* Category Filters */}
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

        {/* Promo Cards - Horizontal Scroll */}
        <div 
          className={`menu-section__promos ${isDragging ? "dragging" : ""}`} 
          ref={promosRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {promoData.map((promo) => (
            <div
              key={promo.id}
              className="promo-detail-card"
              onClick={() => setSelectedPromo({
                title: promo.titleParts.map(p => p.text).join(""),
                price: promo.totalPrice,
                image: promo.poster,
                description: promo.description,
                items: promo.items.map(i => i.name),
              })}
            >
              {/* Left: Poster */}
              <div className="promo-detail-card__poster">
                <img src={promo.poster} alt="promo" />
              </div>

              {/* Right: Info */}
              <div className="promo-detail-card__info">
                {/* Flinders Logo Icon */}
                <div className="promo-detail-card__logo">
                  <img src={IMAGES.logo} alt="Flinders" />
                </div>

                <h3 className="promo-detail-card__title">
                  {renderTitle(promo.titleParts)}
                </h3>
                
                {promo.subtitle && (
                  <p className="promo-detail-card__subtitle">
                    {promo.subtitle}
                  </p>
                )}

                <div className="promo-detail-card__items">
                  {promo.items.map((item, idx) => (
                    <div key={idx} className="promo-detail-card__item">
                      <span className="promo-detail-card__item-name">{item.name}</span>
                      <span className="promo-detail-card__item-price">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="promo-detail-card__total">
                  {promo.totalPrice}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scrollbar indicator */}
        <div 
          className="menu-section__scrollbar-track" 
          ref={trackRef} 
          onClick={handleTrackClick}
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="menu-section__scrollbar-thumb" 
            onMouseDown={handleThumbMouseDown}
            style={{ 
              width: `${scrollData.thumbWidth}%`, 
              transform: `translateX(${scrollData.thumbLeft * (100 / scrollData.thumbWidth)}%)`,
              cursor: isThumbDragging ? 'grabbing' : 'grab'
            }}
          />
        </div>

        {/* Menu Grid */}
        <div className="menu-section__grid">
          {menuData.map((item) => (
            <div
              key={item.id}
              className="menu-card"
              onClick={() => onMenuSelect && onMenuSelect(item)}
            >
              <div className="menu-card__img-wrap">
                <img src={item.img} alt={item.name} className="menu-card__img" />
              </div>
              <div className="menu-card__info">
                <span className="menu-card__name">
                  {item.name === "creamy butterscoot latte" ? (
                    <>
                      <span className="txt-italic-green">creamy </span>
                      <span className="txt-regular-green">butterscoot </span>
                      <span className="txt-regular-tan">latte</span>
                    </>
                  ) : item.name === "ice latte" ? (
                    <>
                      <span className="txt-italic-green">ice </span>
                      <span className="txt-regular-tan">latte</span>
                    </>
                  ) : (
                    <span className="txt-regular-black">{item.name}</span>
                  )}
                  {item.hasStar && <span className="menu-card__star">★</span>}
                </span>
                <span className="menu-card__price">{item.price}</span>
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

