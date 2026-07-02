import { useState } from "react";
import Beranda from "./pages/Beranda";
import CartModal from "./components/ui/CartModal";

export default function App() {
  const [showCart, setShowCart] = useState(false);
  const [lang, setLang] = useState("en");

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "id" : "en"));
  };

  return (
    <>
      <Beranda lang={lang} toggleLang={toggleLang} onCartClick={() => setShowCart(true)} />
      <CartModal lang={lang} isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
