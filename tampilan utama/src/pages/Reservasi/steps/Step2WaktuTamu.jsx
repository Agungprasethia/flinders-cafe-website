import { TIME_SLOTS, DAYS, MONTHS } from "../../../constants";

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function Step2WaktuTamu({
  onNext,
  onBack,
  selectedDate,
  selectedTime,
  onSelectTime,
  guestCount,
  onGuestChange,
}) {
  return (
    <div className="reservasi-step-content">
      <button className="reservasi-btn-back" onClick={onBack}>
        ‹ Kembali
      </button>

      <div className="reservasi-summary-box">
        <div className="reservasi-summary-box__row">
          <span>📅</span> <span>{formatDate(selectedDate)}</span>
        </div>
      </div>

      <div className="reservasi-section">
        <h4 className="reservasi-section__title">
          <span>🕐</span> PILIH JAM KEDATANGAN
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
          <span>👥</span> JUMLAH TAMU
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
              <small>orang</small>
            </div>
            <button
              className="reservasi-guest__btn"
              onClick={() => onGuestChange(Math.min(20, guestCount + 1))}
            >
              +
            </button>
          </div>
          <p className="reservasi-guest__note">
            *Minimum spend per person 100k
          </p>
        </div>
      </div>

      <button
        className="reservasi-btn-next"
        onClick={onNext}
        disabled={!selectedTime}
      >
        Lanjutkan →
      </button>

      <p className="reservasi-note">
        Booking belum terkonfirmasi secara otomatis. Tim kami akan menghubungi
        Anda via WhatsApp dalam 15–30 menit.
      </p>
    </div>
  );
}
