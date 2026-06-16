import { useEffect } from "react";
import "./FlindersGallery.css";

const imgBackground =
  "https://www.figma.com/api/mcp/asset/ec0581a9-8061-4f28-a508-966d610d7b30";

export default function FlindersGallery({ lang = "en" }) {
  const texts = {
    en: {
      title: "FLINDERS GALLERY",
      subtitle: "Moments at flinders cafe"
    },
    id: {
      title: "GALERI FLINDERS",
      subtitle: "Momen di flinders cafe"
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
        <img src={imgBackground} alt="" className="fg-bg-img" />
        <div className="fg-bg-overlay" />
      </div>

      <div className="fg-content">
        <div className="fg-header">
          <h1 className="fg-title">{t.title}</h1>
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
