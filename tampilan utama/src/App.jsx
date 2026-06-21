import { useState } from "react";
import Beranda from "./pages/Beranda";
import CartModal from "./components/ui/CartModal";

export default function App() {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Beranda onCartClick={() => setShowCart(true)} />
      <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
