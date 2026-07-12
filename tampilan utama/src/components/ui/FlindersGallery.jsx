import { useEffect } from "react";
import { IMAGES } from "../../constants";
import "./FlindersGallery.css";

export default function FlindersGallery({ lang = "en" }) {
  const texts = {
    en: {
      titlePart1: "flinders",
      titlePart2: "gallery",
      subtitle: "visual stories from our cozy corner."
    },
    id: {
      titlePart1: "galeri",
      titlePart2: "flinders",
      subtitle: "momen di flinders cafe"
    }
  };

  const t = texts[lang];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Optional: Clean up script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="fg-wrapper" id="gallery">
      <div className="fg-bg">
        <img src={IMAGES.galleryBg} alt="" className="fg-bg-img" />
        <div className="fg-bg-overlay" />
      </div>

      <div className="fg-content">
        <div className="fg-header">
          <h1 className="fg-title">
            <span className="fg-title-sans">{t.titlePart1}</span>{" "}
            <span className="fg-title-serif">{t.titlePart2}</span>
          </h1>
          <p className="fg-subtitle">{t.subtitle}</p>
        </div>

        {/* Elfsight Instagram Feed */}
        <div
          className="elfsight-app-416c7d72-c8c5-4fa8-9802-39abd071fe9b"
          data-elfsight-app-lazy
        ></div>
      </div>
    </div>
  );
}
