import { useState } from "react";
import Beranda from "./pages/Beranda";
import CartModal from "./components/ui/CartModal";

export default function App() {
  const [showCart, setShowCart] = useState(false);
  const [lang, setLang] = useState("en");
  const [cartItems, setCartItems] = useState([]);

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
      />
      <CartModal 
        lang={lang} 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
        items={cartItems}
        setItems={setCartItems}
      />
    </>
  );
}

