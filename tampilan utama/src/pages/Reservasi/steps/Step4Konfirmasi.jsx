export default function Step4Konfirmasi({
  lang = "en",
  selectedDate,
  selectedTime,
  guestCount,
  formData,
}) {
  const texts = {
    id: {
      title: "Permintaan Terkirim! 🎉",
      msg: "Pesan booking Anda telah dikirim ke WhatsApp kami. Tim kami akan membalas konfirmasi ke nomor WhatsApp Anda.",
      person: "orang",
      note: "Layanan balas WA 15-30 menit pada jam operasional (09:00 - 22:00)",
      newBooking: "Buat Booking Baru",
      days: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    },
    en: {
      title: "Request Sent! 🎉",
      msg: "Your booking request has been sent to our WhatsApp. Our team will reply with a confirmation to your WhatsApp number.",
      person: "people",
      note: "WA reply service takes 15-30 minutes during operational hours (09:00 - 22:00)",
      newBooking: "Make a New Booking",
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
    <div className="reservasi-step-content reservasi-step-content--success">
      <div className="reservasi-success">
        <div className="reservasi-success__icon-wrap">
          <div className="reservasi-success__icon">✓</div>
        </div>
        <h3 className="reservasi-success__title">{t.title}</h3>
        <p className="reservasi-success__msg">
          {t.msg}
        </p>
        
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
          <div className="reservasi-summary-box__row">
            <span>👤</span> <span>{formData.name}</span>
          </div>
        </div>
        
        <p className="reservasi-note reservasi-note--center">
          {t.note}
        </p>

        <button
          className="reservasi-btn-next"
          onClick={() => window.location.reload()}
        >
          {t.newBooking}
        </button>
      </div>
    </div>
  );
}
