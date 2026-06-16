import { DAYS, MONTHS } from "../../../constants";

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function Step4Konfirmasi({
  selectedDate,
  selectedTime,
  guestCount,
  formData,
}) {
  return (
    <div className="reservasi-step-content reservasi-step-content--success">
      <div className="reservasi-success">
        <div className="reservasi-success__icon-wrap">
          <div className="reservasi-success__icon">✓</div>
        </div>
        <h3 className="reservasi-success__title">Permintaan Terkirim! 🎉</h3>
        <p className="reservasi-success__msg">
          Pesan booking Anda telah dikirim ke WhatsApp kami. Tim kami akan
          membalas konfirmasi ke nomor WhatsApp Anda.
        </p>
        
        <div className="reservasi-summary-box">
          <div className="reservasi-summary-box__row">
            <span>📅</span> <span>{formatDate(selectedDate)}</span>
          </div>
          <div className="reservasi-summary-box__row">
            <span>🕐</span> <span>{selectedTime}</span>
          </div>
          <div className="reservasi-summary-box__row">
            <span>👥</span> <span>{guestCount} orang</span>
          </div>
          <div className="reservasi-summary-box__row">
            <span>👤</span> <span>{formData.name}</span>
          </div>
        </div>
        
        <p className="reservasi-note reservasi-note--center">
          Layanan balas WA 15-30 menit pada jam operasional (09:00 - 22:00)
        </p>

        <button
          className="reservasi-btn-next"
          onClick={() => window.location.reload()}
        >
          Buat Booking Baru
        </button>
      </div>
    </div>
  );
}
