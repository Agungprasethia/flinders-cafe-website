import { DAYS, MONTHS } from "../../../constants";

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function Step3DataPemesan({
  onNext,
  onBack,
  onSubmit,
  isSubmitting,
  formData,
  onFormChange,
  selectedDate,
  selectedTime,
  guestCount,
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
        <div className="reservasi-summary-box__row">
          <span>🕐</span> <span>{selectedTime}</span>
        </div>
        <div className="reservasi-summary-box__row">
          <span>👥</span> <span>{guestCount} orang</span>
        </div>
      </div>

      <div className="reservasi-form">
        <div className="reservasi-form__group">
          <label className="reservasi-form__label">Nama Lengkap *</label>
          <input
            type="text"
            className="reservasi-form__input"
            placeholder="agung"
            value={formData.name}
            onChange={(e) =>
              onFormChange({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div className="reservasi-form__group">
          <label className="reservasi-form__label">Nomor WhatsApp *</label>
          <div className="reservasi-form__input-wrap">
            <span className="reservasi-form__prefix">+62</span>
            <input
              type="tel"
              className="reservasi-form__input reservasi-form__input--phone"
              placeholder="81234567890"
              value={formData.phone}
              onChange={(e) =>
                onFormChange({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <small className="reservasi-form__hint">Konfirmasi akan dikirim via WhatsApp ke nomor ini</small>
        </div>

        <div className="reservasi-form__group">
          <label className="reservasi-form__label">Catatan Khusus (optional)</label>
          <textarea
            className="reservasi-form__textarea"
            placeholder="Contoh: meja di dekat jendela, ulang tahun dll."
            rows={2}
            value={formData.notes}
            onChange={(e) =>
              onFormChange({ ...formData, notes: e.target.value })
            }
          />
        </div>
      </div>

      <button
        className="reservasi-btn-wa"
        onClick={onSubmit}
        disabled={!formData.name || !formData.phone || isSubmitting}
      >
        <span className="wa-icon">💬</span> {isSubmitting ? "Memproses..." : "Kirim via WhatsApp"}
      </button>

      <p className="reservasi-note">
        Booking belum terkonfirmasi secara otomatis. Tim kami akan menghubungi
        Anda via WhatsApp dalam 15–30 menit.
      </p>
    </div>
  );
}
