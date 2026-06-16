import { useState } from "react";
import "./Beranda.css";
import Navbar from "../../components/common/Navbar";
import HeroSection from "./sections/HeroSection";
import PromoSection from "./sections/PromoSection";
import MenuSection from "./sections/MenuSection";
import FlindersGallery from "../../components/ui/FlindersGallery";
import AboutSection from "./sections/AboutSection";
import DetailMenu from "../../components/ui/DetailMenu";
import MenuDetailModal from "../../components/ui/MenuDetailModal";

export default function Beranda({ onReservasiClick }) {
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [lang, setLang] = useState("en");

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "id" : "en"));
  };

  return (
    <div className="beranda">
      <Navbar
        lang={lang}
        onReservasiClick={onReservasiClick}
        onMenuClick={() => setShowFullMenu(true)}
      />
      <HeroSection
        lang={lang}
        toggleLang={toggleLang}
        onReservasiClick={onReservasiClick}
        onMenuClick={() => setShowFullMenu(true)}
      />
      <PromoSection lang={lang} />
      <MenuSection lang={lang} onMenuSelect={(item) => setSelectedMenu(item)} />
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
        />
      )}
    </div>
  );
}
