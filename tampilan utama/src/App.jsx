import { useState } from "react";
import Beranda from "./pages/Beranda";
import Reservasi from "./pages/Reservasi";

export default function App() {
  const [showReservasi, setShowReservasi] = useState(false);

  return (
    <>
      <Beranda onReservasiClick={() => setShowReservasi(true)} />
      <Reservasi
        isOpen={showReservasi}
        onClose={() => setShowReservasi(false)}
      />
    </>
  );
}
