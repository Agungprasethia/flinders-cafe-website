import { TIME_SLOTS } from "../../../constants";

export default function Step2WaktuTamu({
  lang = "en",
  onNext,
  onBack,
  selectedDate,
  selectedTime,
  onSelectTime,
  guestCount,
  onGuestChange,
}) {
  const texts = {
    id: {
      back: "‹ Kembali",
      timeTitle: "PILIH JAM KEDATANGAN",
      guestTitle: "JUMLAH TAMU",
      person: "orang",
      minSpend: "*Minimum spend per person 100k",
      next: "Lanjutkan →",
      note: "Booking belum terkonfirmasi secara otomatis. Tim kami akan menghubungi Anda via WhatsApp dalam 15–30 menit.",
      days: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    },
    en: {
      back: "‹ Back",
      timeTitle: "SELECT ARRIVAL TIME",
      guestTitle: "NUMBER OF GUESTS",
      person: "people",
      minSpend: "*Minimum spend per person 100k",
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
      <button className="reservasi-btn-back" onClick={onBack}>
        {t.back}
      </button>

      <div className="reservasi-summary-box">
        <div className="reservasi-summary-box__row">
          <span>📅</span> <span>{formatDateTranslated(selectedDate)}</span>
        </div>
      </div>

      <div className="reservasi-section">
        <h4 className="reservasi-section__title">
          <span>🕐</span> {t.timeTitle}
        </h4>
        <div className="reservasi-timeslots">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              className={`reservasi-timeslot ${selectedTime === time ? "reservasi-timeslot--active" : ""}`}
              onClick={() => onSelectTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="reservasi-section">
        <h4 className="reservasi-section__title">
          <span>👥</span> {t.guestTitle}
        </h4>
        <div className="reservasi-guest">
          <div className="reservasi-guest__counter">
            <button
              className="reservasi-guest__btn"
              onClick={() => onGuestChange(Math.max(1, guestCount - 1))}
            >
              −
            </button>
            <div className="reservasi-guest__count">
              <span>{guestCount}</span>
              <small>{t.person}</small>
            </div>
            <button
              className="reservasi-guest__btn"
              onClick={() => onGuestChange(Math.min(20, guestCount + 1))}
            >
              +
            </button>
          </div>
          <p className="reservasi-guest__note">
            {t.minSpend}
          </p>
        </div>
      </div>

      <button
        className="reservasi-btn-next"
        onClick={onNext}
        disabled={!selectedTime}
      >
        {t.next}
      </button>

      <p className="reservasi-note">
        {t.note}
      </p>
    </div>
  );
}
