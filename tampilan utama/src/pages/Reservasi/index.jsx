import React, { useState } from "react";
import "./Reservasi.css";
import { IMAGES } from "../../constants";
import Step1Tanggal from "./steps/Step1Tanggal";
import Step2WaktuTamu from "./steps/Step2WaktuTamu";
import Step3DataPemesan from "./steps/Step3DataPemesan";
import Step4Konfirmasi from "./steps/Step4Konfirmasi";
import { apiRequest } from "../../lib/api";

function StepIndicator({ currentStep, lang = "en" }) {
  const steps = [
    { num: 1, label: lang === "id" ? "Pilih Tanggal" : "Select Date" },
    { num: 2, label: lang === "id" ? "Waktu & Tamu" : "Time & Guests" },
    { num: 3, label: lang === "id" ? "Data Pemesan" : "Reservation Data" },
    { num: 4, label: lang === "id" ? "Konfirmasi" : "Confirmation" },
  ];

  return (
    <div className="reservasi-steps">
      {steps.map((step, i) => (
        <React.Fragment key={step.num}>
          <div className="reservasi-step">
            <div
              className={`reservasi-step__circle ${currentStep === step.num
                  ? "reservasi-step__circle--active"
                  : currentStep > step.num
                    ? "reservasi-step__circle--done"
                    : ""
                }`}
            >
              {currentStep > step.num ? "✓" : step.num}
            </div>
            <span
              className={`reservasi-step__label ${currentStep === step.num ? "reservasi-step__label--active" : ""}`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`reservasi-step__line ${currentStep > step.num + 1 ? "reservasi-step__line--done" : ""}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function ReservasiSection({ lang = "en" }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [closedDates, setClosedDates] = useState([]);

  React.useEffect(() => {
    apiRequest('/api/jadwal')
      .then((data) => {
        if (Array.isArray(data)) {
          setClosedDates(data);
        }
      })
      .catch((err) => console.error('Error fetching closed dates:', err));
  }, []);

  const resetForm = () => {
    setTimeout(() => {
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setGuestCount(2);
      setFormData({ name: "", phone: "", email: "", notes: "" });
      setIsSuccess(false);
    }, 300);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.name.trim() || !formData.phone.trim()) {
      setSubmitError(lang === "id" ? "Tanggal, waktu, nama lengkap, dan nomor WhatsApp wajib diisi." : "Date, time, full name, and WhatsApp number are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await apiRequest("/api/reservasi", {
        method: "POST",
        body: JSON.stringify({
          tanggal: selectedDate,
          waktu: selectedTime,
          jumlahTamu: guestCount,
          nama: formData.name,
          whatsapp: formData.phone,
          email: formData.email,
          catatan: formData.notes,
        }),
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setStep(4);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError(error.message);
    }
  };

  return (
    <section id="reservasi" className="reservasi-section-container">
      <img src={IMAGES.reservasiBg} alt="" className="reservasi-section__bg" />
      <div className="reservasi-section__overlay" />

      <div className="reservasi-card">
        <div className="reservasi-card__header">
            <h2 className="reservasi-card__title">
              {lang === "id" ? "Reservasi Meja" : "Table Reservation"}
            </h2>
            <p className="reservasi-card__subtitle">
              {lang === "id" 
                ? "reservasi meja anda dan nikmati pengalaman terbaik bersama kami."
                : "reserve your table and enjoy the best experience with us."}
            </p>
          </div>

          {!isSuccess && <StepIndicator currentStep={step} lang={lang} />}

          {step === 1 && (
            <Step1Tanggal
              lang={lang}
              onNext={() => setStep(2)}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              closedDates={closedDates}
            />
          )}
          {step === 2 && (
            <Step2WaktuTamu
              lang={lang}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              guestCount={guestCount}
              onGuestChange={setGuestCount}
            />
          )}
          {step === 3 && (
            <Step3DataPemesan
              lang={lang}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              formData={formData}
              onFormChange={setFormData}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              guestCount={guestCount}
              submitError={submitError}
            />
          )}
          {step === 4 && (
            <Step4Konfirmasi
              lang={lang}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              guestCount={guestCount}
              formData={formData}
              onReset={resetForm}
            />
          )}
      </div>
    </section>
  );
}
