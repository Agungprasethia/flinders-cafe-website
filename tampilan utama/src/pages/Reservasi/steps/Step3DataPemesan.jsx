export default function Step3DataPemesan({
  lang = "en",
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
  const texts = {
    id: {
      back: "‹ Kembali",
      person: "orang",
      nameLabel: "Nama Lengkap *",
      phoneLabel: "Nomor WhatsApp *",
      phoneHint: "Konfirmasi akan dikirim via WhatsApp ke nomor ini",
      notesLabel: "Catatan Khusus (optional)",
      notesPlaceholder: "Contoh: meja di dekat jendela, ulang tahun dll.",
      submit: "Kirim via WhatsApp",
      submitting: "Memproses...",
      note: "Booking belum terkonfirmasi secara otomatis. Tim kami akan menghubungi Anda via WhatsApp dalam 15–30 menit.",
      days: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    },
    en: {
      back: "‹ Back",
      person: "people",
      nameLabel: "Full Name *",
      phoneLabel: "WhatsApp Number *",
      phoneHint: "Confirmation will be sent via WhatsApp to this number",
      notesLabel: "Special Notes (optional)",
      notesPlaceholder: "Example: table near window, birthday etc.",
      submit: "Send via WhatsApp",
      submitting: "Processing...",
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
        <div className="reservasi-summary-box__row">
          <span>🕐</span> <span>{selectedTime}</span>
        </div>
        <div className="reservasi-summary-box__row">
          <span>👥</span> <span>{guestCount} {t.person}</span>
        </div>
      </div>

      <div className="reservasi-form">
        <div className="reservasi-form__group">
          <label className="reservasi-form__label">{t.nameLabel}</label>
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
          <label className="reservasi-form__label">{t.phoneLabel}</label>
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
          <small className="reservasi-form__hint">{t.phoneHint}</small>
        </div>

        <div className="reservasi-form__group">
          <label className="reservasi-form__label">{t.notesLabel}</label>
          <textarea
            className="reservasi-form__textarea"
            placeholder={t.notesPlaceholder}
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
        <span className="wa-icon">💬</span> {isSubmitting ? t.submitting : t.submit}
      </button>

      <p className="reservasi-note">
        {t.note}
      </p>
    </div>
  );
}
