import React, { useState } from "react";
import "./Reservasi.css";
import { IMAGES } from "../../constants";
import Step1Tanggal from "./steps/Step1Tanggal";
import Step2WaktuTamu from "./steps/Step2WaktuTamu";
import Step3DataPemesan from "./steps/Step3DataPemesan";
import Step4Konfirmasi from "./steps/Step4Konfirmasi";

function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: "Pilih Tanggal" },
    { num: 2, label: "Waktu & Tamu" },
    { num: 3, label: "Data Pemesanan" },
    { num: 4, label: "Konfirmasi" },
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

export default function Reservasi({ isOpen, onClose }) {
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

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setGuestCount(2);
      setFormData({ name: "", phone: "", email: "", notes: "" });
      setIsSuccess(false);
    }, 300);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setStep(4);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="reservasi-overlay" onClick={handleClose}>
      <div className="reservasi-modal" onClick={(e) => e.stopPropagation()}>
        <img src={IMAGES.reservasiBg} alt="" className="reservasi-modal__bg" />
        <div className="reservasi-modal__overlay" />

        <div className="reservasi-card">
          <button className="reservasi-card__close" onClick={handleClose}>
            ✕
          </button>

          <div className="reservasi-card__header">
            <h2 className="reservasi-card__title">Reservasi Meja</h2>
            <p className="reservasi-card__subtitle">
              reservasi meja anda dan nikmati pengalaman terbaik bersama kami.
            </p>
          </div>

          {!isSuccess && <StepIndicator currentStep={step} />}

          {step === 1 && (
            <Step1Tanggal
              onNext={() => setStep(2)}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}
          {step === 2 && (
            <Step2WaktuTamu
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
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              formData={formData}
              onFormChange={setFormData}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              guestCount={guestCount}
            />
          )}
          {step === 4 && (
            <Step4Konfirmasi
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              guestCount={guestCount}
              formData={formData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
