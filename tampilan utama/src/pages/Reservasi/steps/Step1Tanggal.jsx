import { useState } from "react";
import {
  MONTHS,
  DAYS,
  FULL_DATES,
  AVAILABLE_DATES,
} from "../../../constants";

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function Step1Tanggal({ lang = "en", onNext, selectedDate, onSelectDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const handleSelect = (day) => {
    if (FULL_DATES.includes(day)) return;
    const d = new Date(viewYear, viewMonth, day);
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      return;
    onSelectDate(d.toISOString());
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const d = new Date(selectedDate);
    return (
      d.getDate() === day &&
      d.getMonth() === viewMonth &&
      d.getFullYear() === viewYear
    );
  };

  const isPast = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const texts = {
    id: {
      available: "Tersedia",
      full: "Penuh",
      selected: "Dipilih",
      next: "Lanjutkan →",
      note: "Booking belum terkonfirmasi secara otomatis. Tim kami akan menghubungi Anda via WhatsApp dalam 15–30 menit.",
      days: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    },
    en: {
      available: "Available",
      full: "Full",
      selected: "Selected",
      next: "Continue →",
      note: "Booking is not automatically confirmed. Our team will contact you via WhatsApp within 15-30 minutes.",
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }
  };
  const t = texts[lang] || texts.en;

  const formatDateTranslated = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${t.days[d.getDay()]}, ${d.getDate()} ${t.months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="reservasi-step-content">
      <div className="reservasi-calendar">
        <div className="reservasi-calendar__header">
          <button className="reservasi-calendar__nav" onClick={prevMonth}>
            ‹
          </button>
          <span className="reservasi-calendar__month">
            {t.months[viewMonth]} {viewYear}
          </span>
          <button className="reservasi-calendar__nav" onClick={nextMonth}>
            ›
          </button>
        </div>

        <div className="reservasi-calendar__days-header">
          {t.days.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="reservasi-calendar__grid">
          {Array(firstDay)
            .fill(null)
            .map((_, i) => (
              <span key={`e${i}`} />
            ))}
          {Array(daysInMonth)
            .fill(null)
            .map((_, i) => {
              const day = i + 1;
              const full = FULL_DATES.includes(day);
              const past = isPast(day);
              const selected = isSelected(day);
              return (
                <button
                  key={day}
                  className={`reservasi-calendar__day
                  ${selected ? "reservasi-calendar__day--selected" : ""}
                  ${full ? "reservasi-calendar__day--full" : ""}
                  ${past ? "reservasi-calendar__day--past" : ""}
                `}
                  onClick={() => handleSelect(day)}
                  disabled={full || past}
                >
                  {day}
                  {!full && !past && AVAILABLE_DATES.includes(day) && (
                    <span className="reservasi-calendar__dot reservasi-calendar__dot--available" />
                  )}
                  {full && (
                    <span className="reservasi-calendar__dot reservasi-calendar__dot--full" />
                  )}
                </button>
              );
            })}
        </div>

        <div className="reservasi-calendar__legend">
          <span>
            <span className="legend-dot legend-dot--available" /> {t.available}
          </span>
          <span>
            <span className="legend-dot legend-dot--full" /> {t.full}
          </span>
          <span>
            <span className="legend-dot legend-dot--selected" /> {t.selected}
          </span>
        </div>
      </div>

      {selectedDate && (
        <div className="reservasi-selected-date">
          <span>📅</span>
          <span>{formatDateTranslated(selectedDate)}</span>
          <span className="reservasi-selected-date__badge">{t.available}</span>
        </div>
      )}

      <button
        className="reservasi-btn-next"
        onClick={onNext}
        disabled={!selectedDate}
      >
        {t.next}
      </button>

      <p className="reservasi-note">
        {t.note}
      </p>
    </div>
  );
}
