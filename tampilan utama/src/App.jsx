import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Beranda from "./pages/Beranda";
import CartModal from "./components/ui/CartModal";
import AdminApp from "./admin/AdminApp";
import { apiRequest } from "./lib/api";

function HomeApp() {
  const [showCart, setShowCart] = useState(false);
  const [lang, setLang] = useState("en");
  const [cartItems, setCartItems] = useState([]);
  const [pageConfig, setPageConfig] = useState(null);

  useEffect(() => {
    apiRequest('/api/halaman')
      .then(data => {
        if (data && data.about) {
          setPageConfig(data.about);
        }
      })
      .catch(err => console.error('Error fetching page config:', err));
  }, []);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "id" : "en"));
  };

  const handleAddToCart = (menuItem, quantity) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: menuItem.id,
          name: menuItem.name || menuItem.nama,
          price: menuItem.price || menuItem.harga,
          img: menuItem.image || menuItem.img,
          quantity: quantity,
        },
      ];
    });
  };

  return (
    <>
      <Beranda 
        lang={lang} 
        toggleLang={toggleLang} 
        onCartClick={() => setShowCart(true)} 
        onAddToCart={handleAddToCart}
        pageConfig={pageConfig}
      />
      <CartModal 
        lang={lang} 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
        items={cartItems}
        setItems={setCartItems}
        pageConfig={pageConfig}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home/*" element={<HomeApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
