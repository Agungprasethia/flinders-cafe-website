import { useState } from "react";
import "./Beranda.css";
import Navbar from "../../components/common/Navbar";
import HeroSection from "./sections/HeroSection";
import MenuSection from "./sections/MenuSection";
import ReservasiSection from "../Reservasi";
import FlindersGallery from "../../components/ui/FlindersGallery";
import AboutSection from "./sections/AboutSection";
import DetailMenu from "../../components/ui/DetailMenu";
import MenuDetailModal from "../../components/ui/MenuDetailModal";

export default function Beranda({ lang, toggleLang, onCartClick, onAddToCart }) {
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleReservasiClick = () => {
    document.getElementById('reservasi')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="beranda">
      <Navbar
        lang={lang}
        onReservasiClick={handleReservasiClick}
        onMenuClick={() => setShowFullMenu(true)}
        onCartClick={onCartClick}
      />
      <HeroSection
        lang={lang}
        toggleLang={toggleLang}
        onReservasiClick={handleReservasiClick}
        onMenuClick={() => setShowFullMenu(true)}
        onCartClick={onCartClick}
      />
      <MenuSection 
        lang={lang} 
        onMenuSelect={(item) => setSelectedMenu(item)} 
        onAddToCart={onAddToCart}
        onCartClick={onCartClick}
      />
      <ReservasiSection lang={lang} />
      <FlindersGallery lang={lang} />
      <AboutSection lang={lang} />

      {/* Full Menu view for the "Menu" links */}
      {showFullMenu && <DetailMenu lang={lang} onClose={() => setShowFullMenu(false)} />}
      
      {/* Detail Modal specifically for clicking a Menu Card */}
      {selectedMenu && (
        <MenuDetailModal
          lang={lang}
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
          onAddToCart={onAddToCart}
          onCartClick={() => {
            setSelectedMenu(null);
            onCartClick();
          }}
        />
      )}
    </div>
  );
}
