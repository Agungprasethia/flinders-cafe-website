import { useEffect, useState, useRef } from 'react';
import { 
  ClipboardList, Coffee, Tag, Layout,
  Plus, Edit2, Trash2, Eye, Star, LogOut, X, Upload, Image,
  ChevronLeft, ChevronRight, Minus, Calendar, Clock, Users, Phone, User
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

// Hapus interface AdminDashboardProps
export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('reservasi');

  const Sidebar = () => {
    const menuItems = [
      { id: 'reservasi', label: 'Kelola Reservasi', icon: ClipboardList },
      { id: 'menu', label: 'Kelola Menu', icon: Coffee },
      { id: 'promo', label: 'Kelola Promo', icon: Tag },
    ];
    
    const settingsItems = [
      { id: 'halaman', label: 'Kelola Halaman', icon: Layout },
    ];

    return (
      <div className="w-64 bg-[#E0E0E0] h-screen flex flex-col justify-between border-r border-gray-300 flex-shrink-0">
        <div>
          <div className="bg-[#2E6A67] py-10 px-6 flex flex-col items-center justify-center">
            <img src="/logo.png" alt="Logo Flinders Cafe" className="w-32 h-auto object-contain drop-shadow-lg" />
          </div>
          
          <div className="p-4 flex flex-col gap-2 mt-4">
            <span className="text-xs font-bold text-gray-500 tracking-wider px-3 mb-2">MENU</span>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  data-testid={`tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-left font-medium transition-all ${
                    isActive
                      ? 'bg-[#2E6A67] text-white shadow-md'
                      : 'bg-white text-[#2E6A67] hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="p-4 flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-500 tracking-wider px-3 mb-2 uppercase">Pengaturan</span>
            {settingsItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  data-testid={`tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-left font-medium transition-all ${
                    isActive
                      ? 'bg-[#2E6A67] text-white shadow-md'
                      : 'bg-white text-[#2E6A67] hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-[#2E6A67] text-white px-5 py-4 flex items-center justify-between border-t border-[#255856]">
          <span className="font-semibold text-base tracking-wide">Admin1</span>
          <button
            data-testid="btn-logout"
            onClick={onLogout}
            className="flex items-center gap-2 text-xs font-medium text-white hover:text-red-200 transition px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </div>
    );
  };

  // Hapus tipe pada parameter
  const Header = ({ title }) => (
    <div className="bg-[#C59B73] text-white px-8 py-4 flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-semibold tracking-wide">{title}</h1>
    </div>
  );

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen font-sans antialiased text-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto h-screen">
        {activeTab === 'reservasi' && <ReservasiView Header={Header} setActiveTab={setActiveTab} />}
        {activeTab === 'menu' && <MenuView Header={Header} />}
        {activeTab === 'promo' && <PromoView Header={Header} />}
        {activeTab === 'halaman' && <HalamanView Header={Header} />}
      </div>
    </div>
  );
}

// ==========================================
// MODAL: TAMBAH RESERVASI (3 STEPS)
// ==========================================
const TambahReservasiModal = ({ isOpen, onClose, onCreated }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [jumlahTamu, setJumlahTamu] = useState(2);
  const [formData, setFormData] = useState({
    nama: '', whatsapp: '', catatan: ''
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [closedDates, setClosedDates] = useState([]);

  useEffect(() => {
    if (isOpen) {
      apiRequest('/api/jadwal')
        .then((data) => {
          if (Array.isArray(data)) {
            setClosedDates(data);
          }
        })
        .catch((err) => console.error('Error fetching closed dates:', err));
    }
  }, [isOpen]);

  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleReset = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setJumlahTamu(2);
    setFormData({ nama: '', whatsapp: '', catatan: '' });
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.nama.trim() || !formData.whatsapp.trim()) {
      alert('Tanggal, waktu, nama lengkap, dan nomor WhatsApp wajib diisi.');
      return;
    }

    try {
      const pad = (num) => String(num).padStart(2, '0');
      const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(selectedDate)}`;
      
      const payload = {
        tanggal: dateStr,
        waktu: selectedTime,
        jumlahTamu: jumlahTamu,
        nama: formData.nama,
        whatsapp: formData.whatsapp,
        catatan: formData.catatan,
        status: 'Pending'
      };

      await apiRequest('/api/reservasi', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (onCreated) {
        onCreated();
      }
      handleReset();
    } catch (err) {
      console.error('Gagal menyimpan reservasi:', err);
      alert('Gagal menyimpan reservasi');
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentYear, currentMonth, day);
    return checkDate < today;
  };

  const isClosedDate = (day) => {
    const pad = (num) => String(num).padStart(2, '0');
    const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
    return closedDates.includes(dateStr);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const date = new Date(currentYear, currentMonth, selectedDate);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return `${days[date.getDay()]}, ${selectedDate} ${monthNames[currentMonth]} ${currentYear}`;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const past = isPastDate(day);
      const closed = isClosedDate(day);
      const selected = selectedDate === day;
      const today = isToday(day);
      cells.push(
        <button
          key={day}
          disabled={past || closed}
          onClick={() => setSelectedDate(day)}
          className={`w-9 h-9 rounded-full text-sm font-medium transition-all flex items-center justify-center
            ${past || closed ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-[#2E6A67]/10'}
            ${closed ? 'bg-red-50 text-red-400 border border-red-200' : ''}
            ${selected ? 'bg-[#2E6A67] text-white shadow-md' : ''}
            ${today && !selected ? 'ring-2 ring-[#2E6A67] text-[#2E6A67] font-bold' : ''}
          `}
        >
          {day}
        </button>
      );
    }
    return cells;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleReset} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-modalIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#2E6A67] text-white px-6 py-5 rounded-t-2xl text-center relative">
          <button
            data-testid="btn-close-modal-reservasi"
            onClick={handleReset}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold">Tambah Reservasi Meja</h2>
          <p className="text-white/70 text-xs mt-1">Reservasi meja Anda dan nikmati pengalaman terbaik bersama kami.</p>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-all ${
                  s === step ? 'bg-white w-6' : s < step ? 'bg-white/80' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Pilih Tanggal */}
        {step === 1 && (
          <div className="p-6">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft size={20} className="text-gray-500" />
              </button>
              <span className="font-semibold text-gray-700">{monthNames[currentMonth]} {currentYear}</span>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronRight size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 justify-center">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#2E6A67]" />
                <span>Tersedia</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span>Penuh</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <span>Tutup</span>
              </div>
            </div>

            {/* Selected date display */}
            {selectedDate && (
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 mb-4 border border-gray-100">
                <Calendar size={16} className="text-[#2E6A67]" />
                <span className="text-sm font-medium text-gray-700">{formatSelectedDate()}</span>
                <span className="ml-auto text-xs bg-[#2E6A67] text-white px-2 py-0.5 rounded">Tersedia</span>
              </div>
            )}

            <button
              data-testid="btn-lanjutkan-step1"
              disabled={!selectedDate}
              onClick={() => setStep(2)}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                selectedDate
                  ? 'bg-[#2E6A67] text-white hover:bg-[#245552] shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Lanjutkan <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: Pilih Jam & Jumlah Tamu */}
        {step === 2 && (
          <div className="p-6">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 flex items-center gap-1 mb-4 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft size={14} /> Kembali
            </button>

            {/* Selected date */}
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 mb-5 border border-gray-100">
              <Calendar size={16} className="text-[#2E6A67]" />
              <span className="text-sm font-medium text-gray-700">{formatSelectedDate()}</span>
            </div>

            {/* Time slots */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-[#2E6A67]" />
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Pilih Jam Kedatangan</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTime === time
                        ? 'bg-[#2E6A67] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest count */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-[#2E6A67]" />
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Jumlah Tamu</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  data-testid="btn-minus-tamu"
                  onClick={() => setJumlahTamu(Math.max(1, jumlahTamu - 1))}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-800">{jumlahTamu}</span>
                  <p className="text-xs text-gray-400">orang</p>
                </div>
                <button
                  data-testid="btn-plus-tamu"
                  onClick={() => setJumlahTamu(Math.min(20, jumlahTamu + 1))}
                  className="w-9 h-9 rounded-full bg-[#2E6A67] flex items-center justify-center text-white hover:bg-[#245552] transition-colors shadow-sm"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 italic">*Minimum spend per person 100k</p>
            </div>

            <button
              data-testid="btn-lanjutkan-step2"
              disabled={!selectedTime}
              onClick={() => setStep(3)}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                selectedTime
                  ? 'bg-[#2E6A67] text-white hover:bg-[#245552] shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Lanjutkan <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 3: Data Diri & Konfirmasi */}
        {step === 3 && (
          <div className="p-6">
            <button
              onClick={() => setStep(2)}
              className="text-sm text-gray-500 flex items-center gap-1 mb-4 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft size={14} /> Kembali
            </button>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-2 border border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar size={14} className="text-[#2E6A67]" />
                <span className="font-medium">{formatSelectedDate()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock size={14} className="text-[#2E6A67]" />
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Users size={14} className="text-[#2E6A67]" />
                <span className="font-medium">{jumlahTamu} orang</span>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4 mb-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <User size={14} className="text-[#2E6A67]" />
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <input
                  data-testid="input-nama-reservasi"
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] focus:ring-1 focus:ring-[#2E6A67]/20 transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <Phone size={14} className="text-[#2E6A67]" />
                  Nomor WhatsApp <span className="text-red-400">*</span>
                </label>
                <input
                  data-testid="input-whatsapp-reservasi"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] focus:ring-1 focus:ring-[#2E6A67]/20 transition-all"
                  placeholder="08xxxxxxxxxx"
                />
                <p className="text-xs text-gray-400 mt-1">Konfirmasi akan dikirim ke WhatsApp ini</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  Catatan Khusus <span className="text-gray-400 text-xs font-normal">(opsional)</span>
                </label>
                <textarea
                  data-testid="textarea-catatan-reservasi"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  rows={2}
                  className="w-full bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] focus:ring-1 focus:ring-[#2E6A67]/20 transition-all resize-none"
                  placeholder="Contoh: meja di balkon, perayaan ulang tahun dll"
                />
              </div>
            </div>

            <button
              data-testid="btn-simpan-reservasi"
              onClick={handleSubmit}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                'bg-[#2E6A67] text-white hover:bg-[#245552] shadow-md'
              }`}
            >
              Simpan Reservasi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// MODAL: DETAIL RESERVASI
// ==========================================
const DetailReservasiModal = ({ isOpen, onClose, reservasi, onStatusChange }) => {
  if (!isOpen || !reservasi) return null;

  const handleStatusUpdate = async (status) => {
    await apiRequest(`/api/reservasi/${reservasi.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    onStatusChange(reservasi.id, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-modalIn overflow-hidden">
        {/* Header */}
        <div className="bg-[#2E6A67] text-white px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold">Detail Reservasi</h2>
          <p className="text-white/70 text-xs mt-1">Informasi lengkap pemesanan meja customer.</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-2 border-b pb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Nama</span>
            <span className="col-span-2 text-sm font-semibold text-gray-800">{reservasi.nama || reservasi.customer || '-'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b pb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">WhatsApp</span>
            <span className="col-span-2 text-sm font-semibold text-[#2E6A67]">{reservasi.whatsapp || reservasi.kontak || '-'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b pb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Email</span>
            <span className="col-span-2 text-sm font-semibold text-gray-800">{reservasi.email || '-'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b pb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Waktu</span>
            <span className="col-span-2 text-sm font-semibold text-gray-800">
              {reservasi.tanggal ? new Date(reservasi.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) : '-'} {reservasi.waktu || ''}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b pb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Tamu</span>
            <span className="col-span-2 text-sm font-semibold text-gray-800">{reservasi.jumlahTamu || reservasi.jumlah || 1} orang</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b pb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Catatan</span>
            <span className="col-span-2 text-sm text-gray-700 italic">{reservasi.catatan || 'Tidak ada catatan khusus'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
            <span className="col-span-2">
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                reservasi.status === 'Selesai' ? 'text-green-600 bg-green-50' :
                reservasi.status === 'Batal' ? 'text-red-600 bg-red-50' :
                'text-yellow-600 bg-yellow-50'
              }`}>
                {reservasi.status}
              </span>
            </span>
          </div>
        </div>

        {/* Footer: Action Buttons */}
        <div className="flex gap-2 p-6 bg-gray-50 border-t justify-end">
          <button
            onClick={() => handleStatusUpdate('Batal')}
            className="px-4 py-2 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition text-xs"
          >
            Batalkan
          </button>
          <button
            onClick={() => handleStatusUpdate('Selesai')}
            className="px-4 py-2 bg-[#2E6A67] text-white font-semibold rounded-lg hover:bg-[#245552] transition text-xs shadow-sm"
          >
            Selesaikan
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MODAL: KELOLA JADWAL (OPERASIONAL / TUTUP)
// ==========================================
const KelolaJadwalModal = ({ isOpen, onClose }) => {
  const [closedDates, setClosedDates] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  useEffect(() => {
    if (isOpen) {
      apiRequest('/api/jadwal')
        .then((data) => {
          if (Array.isArray(data)) {
            setClosedDates(data);
          }
        })
        .catch((err) => console.error('Error fetching closed dates:', err));
    }
  }, [isOpen]);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleReset = () => {
    onClose();
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const handleDayClick = (day) => {
    const pad = (num) => String(num).padStart(2, '0');
    const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
    if (closedDates.includes(dateStr)) {
      setClosedDates(closedDates.filter(d => d !== dateStr));
    } else {
      setClosedDates([...closedDates, dateStr]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiRequest('/api/jadwal', {
        method: 'POST',
        body: JSON.stringify({ closedDates }),
      });
      alert('Jadwal operasional berhasil diperbarui!');
      onClose();
    } catch (err) {
      console.error('Error saving schedule:', err);
      alert('Gagal memperbarui jadwal operasional');
    } finally {
      setIsSaving(false);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const cells = [];
    const pad = (num) => String(num).padStart(2, '0');

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
      const isClosed = closedDates.includes(dateStr);
      const today = isToday(day);
      
      cells.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDayClick(day)}
          className={`w-10 h-10 rounded-full text-xs font-semibold transition-all flex flex-col items-center justify-center relative cursor-pointer
            ${isClosed 
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
              : 'bg-teal-50 text-[#2E6A67] border border-teal-100 hover:bg-teal-100'}
            ${today ? 'ring-2 ring-[#2E6A67] font-bold' : ''}
          `}
        >
          <span>{day}</span>
          <span className={`text-[7px] font-bold mt-[-2px] uppercase ${isClosed ? 'text-red-500' : 'text-teal-600'}`}>
            {isClosed ? 'Tutup' : 'Buka'}
          </span>
        </button>
      );
    }
    return cells;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleReset} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-modalIn overflow-hidden">
        {/* Header */}
        <div className="bg-[#2E6A67] text-white px-6 py-5 relative text-center">
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold">Kelola Jadwal Operasional</h2>
          <p className="text-white/70 text-xs mt-1">Tentukan tanggal buka atau tutup cafe untuk reservasi.</p>
        </div>

        {/* Calendar Body */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={20} className="text-gray-500" />
            </button>
            <span className="font-semibold text-gray-700">{monthNames[currentMonth]} {currentYear}</span>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronRight size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {dayNames.map((d) => (
              <div key={d} className="text-xs font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-6">
            {renderCalendar()}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-xs text-gray-500 mb-6 justify-center border-t pt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-teal-50 border border-teal-100" />
              <span className="font-medium text-gray-600">Buka (Tersedia)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-red-50 border border-red-200" />
              <span className="font-medium text-gray-600">Tutup (Tidak Bisa Booking)</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-2.5 bg-[#2E6A67] text-white rounded-xl text-sm font-semibold hover:bg-[#245552] transition-colors shadow-md disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Jadwal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// TAB 1: KELOLA RESERVASI
// ==========================================
const ReservasiView = ({ Header, setActiveTab }) => {
  const [showTambahReservasi, setShowTambahReservasi] = useState(false);
  const [showKelolaJadwal, setShowKelolaJadwal] = useState(false);
  const [selectedReservasi, setSelectedReservasi] = useState(null);
  const [reservasi, setReservasi] = useState([]);

  const fetchReservasi = () => {
    apiRequest('/api/reservasi')
      .then(setReservasi)
      .catch(() => setReservasi([]));
  };

  useEffect(() => {
    fetchReservasi();
  }, []);

  const statusColor = (status) => {
    if (status === 'Selesai') return 'text-green-600 bg-green-50';
    if (status === 'Batal') return 'text-red-600 bg-red-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const formatWaktu = (row) => {
    const tanggal = row.tanggal ? new Date(row.tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) : '-';
    return `${tanggal} ${row.waktu || ''}`;
  };

  return (
    <>
      <Header title="Kelola Reservasi" />
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <button data-testid="link-kelola-jadwal" onClick={() => setShowKelolaJadwal(true)} className="text-gray-500 font-medium underline cursor-pointer hover:text-gray-700">kelola jadwal</button>
            <button data-testid="btn-tambah-reservasi" onClick={() => setShowTambahReservasi(true)} className="text-[#2E6A67] font-medium underline flex items-center gap-1 hover:text-teal-800">
              <Plus size={16} /> tambah reservasi
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 rounded-l-lg font-semibold">Waktu</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Kontak</th>
                  <th className="p-4 text-center font-semibold">Jumlah</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                  <th className="p-4 text-center rounded-r-lg font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {reservasi.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-700">{formatWaktu(row)}</td>
                    <td className="p-4">{row.nama || row.customer}</td>
                    <td className="p-4 text-gray-500">{row.whatsapp || row.kontak}</td>
                    <td className="p-4 text-center">{row.jumlahTamu || row.jumlah}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-semibold text-xs ${statusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        data-testid={`btn-detail-reservasi-${row.id}`} 
                        onClick={() => setSelectedReservasi(row)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-300 transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tambah Reservasi */}
      <TambahReservasiModal 
        isOpen={showTambahReservasi} 
        onClose={() => setShowTambahReservasi(false)} 
        onCreated={fetchReservasi}
      />

      {/* Modal Kelola Jadwal */}
      <KelolaJadwalModal 
        isOpen={showKelolaJadwal} 
        onClose={() => setShowKelolaJadwal(false)} 
      />

      {/* Modal Detail Reservasi */}
      <DetailReservasiModal 
        isOpen={!!selectedReservasi} 
        onClose={() => setSelectedReservasi(null)} 
        reservasi={selectedReservasi}
        onStatusChange={(id, status) => {
          setReservasi(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        }}
      />
    </>
  );
};

// ==========================================
// TAB 2: KELOLA MENU
// ==========================================
// ==========================================
// MODAL: TAMBAH MENU
// ==========================================
const TambahMenuModal = ({ isOpen, onClose, onCreated, menuToEdit, onUpdated }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nama: '', kategori: '', harga: '', deskripsi: '', bestSeller: false, recommended: false
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (menuToEdit) {
      setFormData({
        nama: menuToEdit.name || menuToEdit.nama || '',
        kategori: menuToEdit.category || menuToEdit.kategori || '',
        harga: menuToEdit.price ?? menuToEdit.harga ?? '',
        deskripsi: menuToEdit.description ?? menuToEdit.deskripsi ?? '',
        bestSeller: menuToEdit.bestSeller ?? menuToEdit.best_seller ?? false,
        recommended: menuToEdit.recommended ?? menuToEdit.is_recommended ?? false,
      });
      setPreviewImage(menuToEdit.image || null);
    } else {
      setFormData({ nama: '', kategori: '', harga: '', deskripsi: '', bestSeller: false, recommended: false });
      setPreviewImage(null);
    }
    setSelectedFile(null);
  }, [menuToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData.nama.trim() || !formData.kategori || !String(formData.harga).trim()) {
      alert('Nama menu, kategori, dan harga wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = menuToEdit?.image || null;

      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedFile);
        
        const uploadRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/upload`, {
          method: 'POST',
          body: formDataUpload,
        });
        
        if (!uploadRes.ok) throw new Error('Gagal upload gambar');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const payload = {
        ...formData,
        image: imageUrl,
        bestSeller: formData.bestSeller,
        recommended: formData.recommended,
      };

      if (menuToEdit) {
        const updated = await apiRequest(`/api/menus/${menuToEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (onUpdated) onUpdated(updated);
      } else {
        const created = await apiRequest('/api/menus', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (onCreated) onCreated(created);
      }
      handleCancel();
    } catch (err) {
      console.error('Gagal menyimpan menu:', err);
      alert(`Gagal menyimpan menu: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ nama: '', kategori: '', harga: '', deskripsi: '', bestSeller: false, recommended: false });
    setPreviewImage(null);
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCancel} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 animate-modalIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-2">
          <h2 className="text-xl font-bold text-[#2E6A67]">{menuToEdit ? 'Edit Menu' : 'Tambah Menu'}</h2>
          <button
            data-testid="btn-close-modal-menu"
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-5 space-y-5">
          {/* Nama Menu */}
          <div className="flex items-center gap-6">
            <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0">Nama Menu</label>
            <input
              data-testid="input-nama-menu"
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="flex-1 bg-gray-100 rounded-lg px-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] focus:ring-1 focus:ring-[#2E6A67]/20 transition-all"
              placeholder="Masukkan nama menu"
            />
          </div>

          {/* Kategori */}
          <div className="flex items-center gap-6">
            <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0">Kategori</label>
            <select
              data-testid="select-kategori-menu"
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="flex-1 bg-gray-100 rounded-lg px-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] focus:ring-1 focus:ring-[#2E6A67]/20 transition-all appearance-none cursor-pointer"
            >
              <option value="">Pilih kategori</option>
              <option value="kopi">Kopi</option>
              <option value="non-kopi">Non-Kopi</option>
              <option value="makanan">Makanan</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {/* Harga */}
          <div className="flex items-center gap-6">
            <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0">Harga</label>
            <input
              data-testid="input-harga-menu"
              type="text"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              className="w-44 bg-gray-100 rounded-lg px-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] focus:ring-1 focus:ring-[#2E6A67]/20 transition-all"
              placeholder="Contoh: 35.000"
            />
          </div>

          {/* Deskripsi */}
          <div className="flex items-start gap-6">
            <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0 pt-2">Deskripsi</label>
            <textarea
              data-testid="textarea-deskripsi-menu"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows={3}
              className="flex-1 bg-gray-100 rounded-lg px-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] focus:ring-1 focus:ring-[#2E6A67]/20 transition-all resize-none"
              placeholder="Deskripsi menu"
            />
          </div>

          {/* Best Seller & Recommended Toggles */}
          <div className="flex items-center gap-6">
            <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0">Status</label>
            <div className="flex flex-col gap-3 flex-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.bestSeller}
                  data-testid="toggle-best-seller"
                  onClick={() => setFormData({ ...formData, bestSeller: !formData.bestSeller })}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.bestSeller ? 'bg-[#2E6A67]' : 'bg-gray-300'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.bestSeller ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
                <span className="text-sm text-gray-700 font-medium">Best Seller</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.recommended}
                  data-testid="toggle-recommended"
                  onClick={() => setFormData({ ...formData, recommended: !formData.recommended })}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.recommended ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.recommended ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
                <span className="text-sm text-gray-700 font-medium">Rekomendasi</span>
              </label>
            </div>
          </div>

          {/* Media Gambar */}
          <div>
            <label className="text-sm font-bold text-[#2E6A67] block mb-3">Media Gambar</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#2E6A67] hover:bg-[#2E6A67]/5 transition-all group"
            >
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#2E6A67]/10 transition-colors">
                    <Image size={24} className="text-gray-400 group-hover:text-[#2E6A67] transition-colors" />
                  </div>
                  <p className="text-xs text-gray-400 group-hover:text-[#2E6A67] transition-colors">Klik untuk upload gambar</p>
                </>
              )}
              <input
                ref={fileInputRef}
                data-testid="input-gambar-menu"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-8 pb-7 pt-3">
          <button
            data-testid="btn-batal-menu"
            onClick={handleCancel}
            className="px-8 py-2.5 text-[#2E6A67] font-semibold rounded-lg hover:bg-gray-100 transition-all text-sm"
          >
            Batal
          </button>
          <button
            data-testid="btn-simpan-menu"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8 py-2.5 bg-[#2E6A67] text-white font-semibold rounded-lg hover:bg-[#245552] transition-all text-sm shadow-md hover:shadow-lg"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MODAL: MENU SELECTION
// ==========================================
const MenuSelectionModal = ({ isOpen, onClose, selectedMenus, onSave }) => {
  const [activeCategory, setActiveCategory] = useState("all menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelected, setLocalSelected] = useState(selectedMenus || []);
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    if (isOpen) {
      apiRequest('/api/menus')
        .then((data) => {
          if (Array.isArray(data)) {
            setMenus(data);
          }
        })
        .catch((err) => console.error('Gagal mengambil menu:', err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setLocalSelected(selectedMenus || []);
      setSearchQuery("");
      setActiveCategory("all menu");
    }
  }, [selectedMenus, isOpen]);

  const categories = ["all menu", "best seller", "drink", "food", "dessert & snack"];

  const toggleSelection = (menu) => {
    if (localSelected.find(m => m.id === menu.id)) {
      setLocalSelected(localSelected.filter(m => m.id !== menu.id));
    } else {
      setLocalSelected([...localSelected, menu]);
    }
  };

  const handleSave = () => {
    onSave(localSelected);
    onClose();
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') return `${(price / 1000)}k`;
    return price;
  };

  const filteredMenus = menus.filter(menu => {
    // Search filter
    const nameMatch = (menu.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (menu.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (searchQuery && !nameMatch && !descMatch) return false;

    // Category filter
    if (activeCategory === "all menu") return true;
    if (activeCategory === "best seller") {
      return menu.bestSeller === true || menu.best_seller === true;
    }
    const cat = (menu.category || '').toLowerCase();
    if (activeCategory === "drink") {
      return ["drink", "kopi", "non-kopi"].includes(cat);
    }
    if (activeCategory === "food") {
      return ["food", "makanan"].includes(cat);
    }
    if (activeCategory === "dessert & snack") {
      return ["dessert", "snack", "dessert & snack"].includes(cat);
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-8 animate-modalIn">
        <h2 className="text-2xl font-bold text-[#2E6A67] text-center mb-6">Tambah Menu ke Bundle</h2>
        
        {/* Search */}
        <input 
          type="text" 
          placeholder="Cari nama menu..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm mb-6 focus:outline-none focus:border-[#2E6A67]"
        />

        {/* Categories */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`px-4 py-1.5 text-xs rounded-full border font-semibold transition-colors ${activeCategory === cat ? 'bg-[#e8d8b4] text-gray-800 border-[#e8d8b4]' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === "all menu" ? "Semua Menu" : cat === "best seller" ? "Terlaris" : cat === "drink" ? "Minuman" : cat === "food" ? "Makanan" : "Dessert & Camilan"}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
          {filteredMenus.map(menu => {
            const isSelected = localSelected.find(m => m.id === menu.id);
            return (
              <div 
                key={menu.id} 
                onClick={() => toggleSelection(menu)}
                className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer transition-colors ${isSelected ? 'bg-[#2E6A67] text-white border-[#2E6A67]' : 'bg-white border-gray-200 text-gray-700 hover:border-[#2E6A67]'}`}
              >
                <span className="font-medium text-sm">{menu.name}</span>
                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#ba8f65]'}`}>{formatPrice(menu.price)}</span>
              </div>
            );
          })}
          {filteredMenus.length === 0 && (
            <div className="col-span-2 text-center text-gray-400 py-6 text-sm">Tidak ada menu ditemukan</div>
          )}
        </div>

        <div className="flex justify-end gap-6 mt-8">
          <button onClick={onClose} className="text-[#2E6A67] font-bold text-sm hover:underline">Batal</button>
          <button onClick={handleSave} className="text-[#2E6A67] font-bold text-sm hover:underline">Simpan</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MODAL: TAMBAH PROMO
// ==========================================
const TambahPromoModal = ({ isOpen, onClose, onCreated, onUpdated, promoToEdit }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nama: '', diskon: '', durasi: '', deskripsi: '', startTime: '', endTime: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [showMenuSelection, setShowMenuSelection] = useState(false);

  // New Bundle States
  const [promoType, setPromoType] = useState('biasa'); // 'biasa' atau 'bundle'
  const [bundles, setBundles] = useState([
    { id: 'b-1', name: 'Bundle 1', price: '', items: [], isBundle: true }
  ]);
  const [activeBundleId, setActiveBundleId] = useState(null);

  useEffect(() => {
    if (promoToEdit) {
      setFormData({
        nama: promoToEdit.title || promoToEdit.nama || '',
        diskon: promoToEdit.discount || promoToEdit.diskon || '',
        durasi: promoToEdit.validUntil || promoToEdit.durasi || '',
        deskripsi: promoToEdit.description || promoToEdit.deskripsi || '',
        startTime: promoToEdit.startTime || '',
        endTime: promoToEdit.endTime || ''
      });
      setPreviewImage(promoToEdit.image || null);
      
      const items = promoToEdit.items || [];
      const isBundlePromo = items.length > 0 && items[0].isBundle === true;
      if (isBundlePromo) {
        setPromoType('bundle');
        setBundles(items.map(b => ({ ...b, price: b.price || '' })));
        setSelectedMenus([]);
      } else {
        setPromoType('biasa');
        setSelectedMenus(items);
        setBundles([{ id: 'b-1', name: 'Bundle 1', price: '', items: [], isBundle: true }]);
      }
    } else {
      setFormData({ nama: '', diskon: '', durasi: '', deskripsi: '', startTime: '', endTime: '' });
      setPreviewImage(null);
      setPromoType('biasa');
      setSelectedMenus([]);
      setBundles([{ id: 'b-1', name: 'Bundle 1', price: '', items: [], isBundle: true }]);
    }
    setSelectedFile(null);
  }, [promoToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Bundle operations
  const addBundle = () => {
    const nextNum = bundles.length + 1;
    setBundles([...bundles, { id: `b-${Date.now()}`, name: `Bundle ${nextNum}`, price: '', items: [], isBundle: true }]);
  };

  const removeBundle = (id) => {
    if (bundles.length === 1) {
      alert("Minimal harus ada 1 bundle!");
      return;
    }
    setBundles(bundles.filter(b => b.id !== id));
  };

  const handleBundleNameChange = (id, newName) => {
    setBundles(prev => prev.map(b => b.id === id ? { ...b, name: newName } : b));
  };

  const handleBundlePriceChange = (id, newPrice) => {
    setBundles(prev => prev.map(b => b.id === id ? { ...b, price: newPrice } : b));
  };

  const openMenuSelection = (bundleId) => {
    setActiveBundleId(bundleId);
    setShowMenuSelection(true);
  };

  const handleMenuSelectionSave = (menus) => {
    if (promoType === 'biasa') {
      setSelectedMenus(menus);
    } else {
      setBundles(prev => prev.map(b => b.id === activeBundleId ? { ...b, items: menus } : b));
    }
  };

  const removeMenuFromBiasa = (menuId) => {
    setSelectedMenus(selectedMenus.filter(m => m.id !== menuId));
  };

  const removeMenuFromBundle = (bundleId, menuId) => {
    setBundles(prev => prev.map(b => b.id === bundleId ? { ...b, items: b.items.filter(m => m.id !== menuId) } : b));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      ['nama promo', formData.nama],
      ['diskon', formData.diskon],
      ['durasi promo', formData.durasi],
    ];
    const missingField = requiredFields.find(([, value]) => !String(value).trim());

    if (missingField) {
      alert(`Field ${missingField[0]} wajib diisi.`);
      return;
    }

    if (promoType === 'biasa' && selectedMenus.length === 0) {
      alert('Pilih minimal satu menu promo.');
      return;
    }

    if (promoType === 'bundle') {
      const invalidBundle = bundles.some((bundle) => !bundle.name.trim() || !String(bundle.price).trim() || bundle.items.length === 0);
      if (invalidBundle) {
        alert('Setiap bundle harus memiliki nama, harga, dan minimal satu menu.');
        return;
      }
    }

    try {
      let imageUrl = promoToEdit?.image || null;

      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedFile);
        
        const uploadRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/upload`, {
          method: 'POST',
          body: formDataUpload,
        });
        
        if (!uploadRes.ok) throw new Error('Gagal upload gambar promo');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const payload = {
        title: formData.nama,
        discount: formData.diskon,
        validUntil: formData.durasi,
        description: formData.deskripsi,
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
        items: promoType === 'biasa' ? selectedMenus : bundles.map(b => ({ ...b, isBundle: true })),
        image: imageUrl,
        active: promoToEdit ? promoToEdit.active : true,
      };

      if (promoToEdit) {
        const updated = await apiRequest(`/api/promo/${promoToEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        onUpdated(updated);
      } else {
        const created = await apiRequest('/api/promo', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        onCreated(created);
      }
      handleCancel();
    } catch (err) {
      console.error('Gagal menyimpan promo:', err);
      alert('Gagal menyimpan promo');
    }
  };

  const handleCancel = () => {
    setFormData({ nama: '', diskon: '', durasi: '', deskripsi: '', startTime: '', endTime: '' });
    setPreviewImage(null);
    setSelectedFile(null);
    setSelectedMenus([]);
    setPromoType('biasa');
    setBundles([{ id: 'b-1', name: 'Bundle 1', items: [], isBundle: true }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCancel} />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 animate-modalIn max-h-[90vh] overflow-y-auto">
        <div className="px-10 py-8">
          {/* Header */}
          <h2 className="text-2xl font-bold text-[#2E6A67] text-center mb-8">Detail Promo</h2>

          {/* Body */}
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0">Nama Promo</label>
              <input
                type="text" name="nama" value={formData.nama} onChange={handleChange}
                placeholder="Contoh: Promo Weekend"
                className="flex-1 bg-gray-100 rounded-md px-4 py-2 border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0">Diskon</label>
              <input
                type="text" name="diskon" value={formData.diskon} onChange={handleChange}
                placeholder="Contoh: 10% atau 20k"
                className="w-48 bg-gray-100 rounded-md px-4 py-2 border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0">Durasi Promo</label>
              <input
                type="date" name="durasi" value={formData.durasi} onChange={handleChange}
                className="w-48 bg-gray-100 rounded-md px-4 py-2 border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20"
              />
            </div>

            {/* Jadwal Harian */}
            <div className="flex items-center gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0">Jam Aktif</label>
              <div className="flex items-center gap-2">
                <input
                  type="time" name="startTime" value={formData.startTime} onChange={handleChange}
                  className="bg-gray-100 rounded-md px-3 py-2 border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20"
                />
                <span className="text-gray-500 text-sm font-medium">s/d</span>
                <input
                  type="time" name="endTime" value={formData.endTime} onChange={handleChange}
                  className="bg-gray-100 rounded-md px-3 py-2 border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20"
                />
              </div>
            </div>

            <div className="flex items-start gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0 pt-2">Deskripsi</label>
              <textarea
                name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={3}
                placeholder="Deskripsi promo..."
                className="flex-1 bg-gray-100 rounded-md px-4 py-2 border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20 resize-none"
              />
            </div>

            <div className="flex items-start gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0 pt-2">Poster Promo</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-gray-100 rounded-md h-24 flex items-center justify-center px-4 cursor-pointer hover:bg-gray-200 overflow-hidden relative border border-dashed border-gray-300"
              >
                {previewImage ? <img src={previewImage} className="h-full object-cover w-full" /> : <span className="text-gray-400 text-xs">Klik untuk upload...</span>}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Tipe Promo Option */}
            <div className="flex items-center gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0">Tipe Promo</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-gray-700">
                  <input
                    type="radio"
                    name="promoType"
                    value="biasa"
                    checked={promoType === 'biasa'}
                    onChange={() => setPromoType('biasa')}
                    className="accent-[#2E6A67]"
                  />
                  Item Biasa
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-gray-700">
                  <input
                    type="radio"
                    name="promoType"
                    value="bundle"
                    checked={promoType === 'bundle'}
                    onChange={() => setPromoType('bundle')}
                    className="accent-[#2E6A67]"
                  />
                  Bundle Pilihan
                </label>
              </div>
            </div>

            {/* Conditionally Render Menu Selection based on Tipe Promo */}
            {promoType === 'biasa' ? (
              <div className="flex items-start gap-6 border-t pt-4">
                <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0 pt-2">Menu Promo</label>
                <div className="flex-1 flex flex-wrap gap-2 items-start">
                  {selectedMenus.map(menu => (
                    <div key={menu.id} className="bg-gray-100 rounded-md px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-gray-700 border">
                      {menu.name}
                      <button onClick={() => removeMenuFromBiasa(menu.id)} className="text-red-500 hover:text-red-700 rounded-full p-0.5">
                        <X size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                  <div className="w-full mt-2">
                    <button 
                      onClick={() => openMenuSelection(null)}
                      className="px-3 py-1.5 bg-[#2E6A67] text-white text-xs rounded flex items-center gap-1 hover:bg-[#245552] transition-colors font-semibold"
                    >
                      <Plus size={14} strokeWidth={3} /> Pilih Menu
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t pt-4 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-[#2E6A67]">Daftar Bundle Pilihan</h4>
                  <button 
                    onClick={addBundle}
                    className="px-3 py-1 bg-[#2E6A67] text-white text-xs rounded hover:bg-[#245552] transition-colors font-semibold flex items-center gap-1"
                  >
                    <Plus size={14} /> Tambah Pilihan Bundle
                  </button>
                </div>

                <div className="space-y-4">
                  {bundles.map((bundle, index) => (
                    <div key={bundle.id} className="bg-gray-50 border rounded-xl p-4 space-y-3 relative">
                      <div className="flex flex-col gap-2 relative">
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-xs font-bold text-[#2E6A67] bg-[#2E6A67]/10 px-2 py-1 rounded">#{index + 1}</span>
                            <input
                              type="text"
                              value={bundle.name}
                              onChange={(e) => handleBundleNameChange(bundle.id, e.target.value)}
                              placeholder="Nama Pilihan Bundle (cth: Paket A)"
                              className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20 font-semibold text-gray-700"
                            />
                          </div>
                          <button 
                            onClick={() => removeBundle(bundle.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold"
                          >
                            Hapus Pilihan
                          </button>
                        </div>
                        <div className="flex items-center gap-2 pl-7">
                          <span className="text-xs font-semibold text-gray-500">Harga:</span>
                          <input
                            type="text"
                            value={bundle.price}
                            onChange={(e) => handleBundlePriceChange(bundle.id, e.target.value)}
                            placeholder="Harga Bundle (cth: 120.000 atau 120k)"
                            className="w-48 bg-white border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20 text-gray-700 font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 items-start pt-1">
                        {bundle.items.map(menu => (
                          <div key={menu.id} className="bg-white border rounded-md px-2.5 py-1.5 flex items-center gap-2 text-xs font-medium text-gray-600">
                            {menu.name}
                            <button onClick={() => removeMenuFromBundle(bundle.id, menu.id)} className="text-red-500 hover:text-red-700 rounded-full p-0.5">
                              <X size={10} strokeWidth={3} />
                            </button>
                          </div>
                        ))}
                        {bundle.items.length === 0 && (
                          <span className="text-xs text-gray-400 italic">Belum ada menu di bundle ini</span>
                        )}
                        <div className="w-full pt-1.5">
                          <button 
                            onClick={() => openMenuSelection(bundle.id)}
                            className="px-2.5 py-1 bg-white border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-50 transition-colors font-medium flex items-center gap-1 shadow-sm"
                          >
                            <Plus size={12} /> Pilih Menu
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-8 mt-10">
            <button onClick={handleCancel} className="text-[#2E6A67] font-bold text-sm hover:underline">
              Batal
            </button>
            <button onClick={handleSubmit} className="text-[#2E6A67] font-bold text-sm hover:underline">
              Simpan
            </button>
          </div>
        </div>
      </div>

      <MenuSelectionModal 
        isOpen={showMenuSelection} 
        onClose={() => setShowMenuSelection(false)} 
        selectedMenus={promoType === 'biasa' ? selectedMenus : (bundles.find(b => b.id === activeBundleId)?.items || [])}
        onSave={handleMenuSelectionSave}
      />
    </div>
  );
};

const MenuView = ({ Header }) => {
  const [menus, setMenus] = useState([]);
  const [showTambahMenu, setShowTambahMenu] = useState(false);
  const [menuToEdit, setMenuToEdit] = useState(null);

  const loadMenus = async () => {
    try {
      setMenus(await apiRequest('/api/menus'));
    } catch (error) {
      console.error('Gagal mengambil menu:', error);
      setMenus([]);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const toggleStatus = async (id) => {
    const current = menus.find((menu) => menu.id === id);
    const available = !(current?.available ?? current?.tersedia);
    await apiRequest(`/api/menus/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ available }),
    });
    setMenus(menus.map(menu => {
      if (menu.id === id) {
        return { ...menu, available };
      }
      return menu;
    }));
  };

  const toggleRecommended = async (id) => {
    const current = menus.find((menu) => menu.id === id);
    const recommended = !(current?.recommended);
    try {
      await apiRequest(`/api/menus/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ recommended }),
      });
      setMenus(menus.map(menu => {
        if (menu.id === id) {
          return { ...menu, recommended };
        }
        return menu;
      }));
    } catch (err) {
      console.error('Gagal mengubah status rekomendasi:', err);
    }
  };

  const deleteMenu = async (id) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus menu ini?');
    if (!confirmed) return;
    await apiRequest(`/api/menus/${id}`, { method: 'DELETE' });
    setMenus(menus.filter((menu) => menu.id !== id));
  };

  const handleEditMenu = (item) => {
    setMenuToEdit(item);
    setShowTambahMenu(true);
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') return price.toLocaleString('id-ID');
    return price;
  };

  // Group menus by category
  const categoryLabels = {
    'kopi': 'Kopi',
    'non-kopi': 'Non-Kopi',
    'makanan': 'Makanan',
    'food': 'Makanan',
    'snack': 'Snack',
    'dessert': 'Dessert & Snack',
    'dessert & snack': 'Dessert & Snack',
    'drink': 'Minuman',
  };

  const groupedMenus = menus.reduce((groups, item) => {
    const cat = (item.category || item.kategori || 'lainnya').toLowerCase();
    const label = categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
    return groups;
  }, {});

  const renderMenuCard = (item) => (
    <div key={item.id} className="bg-gray-100 p-4 rounded-xl flex gap-4 relative shadow-sm border border-gray-200">
      <div className="w-24 h-24 bg-gray-300 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-500 font-light text-xs">
        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" /> : '[Foto]'}
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-bold text-gray-800">{item.name || item.nama}</h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 ${
              (item.available ?? item.tersedia) ? 'bg-[#2E6A67] text-white' : 'bg-gray-400 text-white'
            }`}>
              {(item.available ?? item.tersedia) ? 'Tersedia' : 'Habis'}
            </span>
          </div>
          <p className="text-sm text-gray-700 font-semibold mt-1">{formatPrice(item.price || item.harga)}</p>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.description || item.deskripsi || 'Deskripsi menu singkat...'}</p>
        </div>
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Star 
              size={16} 
              className={`cursor-pointer transition-colors ${
                item.recommended ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400 hover:text-yellow-400'
              }`} 
              data-testid={`icon-star-${item.id}`}
              onClick={() => toggleRecommended(item.id)}
            />
            <button
              type="button"
              role="switch"
              aria-checked={item.available ?? item.tersedia}
              data-testid={`toggle-menu-${item.id}`}
              onClick={() => toggleStatus(item.id)}
              className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                (item.available ?? item.tersedia) ? 'bg-[#2E6A67]' : 'bg-gray-300'
              }`}
            >
              <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                (item.available ?? item.tersedia) ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <div className="flex gap-3 text-gray-500">
            <button data-testid={`btn-edit-menu-${item.id}`} onClick={() => handleEditMenu(item)} className="cursor-pointer hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
            <button data-testid={`btn-delete-menu-${item.id}`} onClick={() => deleteMenu(item.id)} className="cursor-pointer hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header title="Kelola Menu" />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700">Manajemen Menu</h2>
          <button data-testid="btn-tambah-menu" onClick={() => { setMenuToEdit(null); setShowTambahMenu(true); }} className="bg-[#2E6A67] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow hover:bg-opacity-90 transition-all">
            <Plus size={18} /> tambah menu
          </button>
        </div>
        {Object.entries(groupedMenus).map(([categoryLabel, items]) => (
          <div key={categoryLabel} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-600 mb-4 border-b pb-2">{categoryLabel}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(renderMenuCard)}
            </div>
          </div>
        ))}
        {menus.length === 0 && (
          <div className="text-center text-gray-400 py-10">Belum ada menu. Klik "tambah menu" untuk membuat menu baru.</div>
        )}
      </div>

      {/* Modal Tambah/Edit Menu */}
      <TambahMenuModal
        isOpen={showTambahMenu}
        onClose={() => { setShowTambahMenu(false); setMenuToEdit(null); }}
        menuToEdit={menuToEdit}
        onCreated={loadMenus}
        onUpdated={loadMenus}
      />
    </>
  );
};

// ==========================================
// TAB 3: KELOLA PROMO
// ==========================================
const PromoView = ({ Header }) => {
  const [showTambahPromo, setShowTambahPromo] = useState(false);
  const [promoToEdit, setPromoToEdit] = useState(null);
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    apiRequest('/api/promo')
      .then(setPromos)
      .catch(() => setPromos([]));
  }, []);

  const deletePromo = async (id) => {
    await apiRequest(`/api/promo/${id}`, { method: 'DELETE' });
    setPromos(promos.filter((promo) => promo.id !== id));
  };

  const handleEditPromo = (promo) => {
    setPromoToEdit(promo);
    setShowTambahPromo(true);
  };

  const togglePromoStatus = async (promo) => {
    const active = !promo.active;
    const updated = await apiRequest(`/api/promo/${promo.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: promo.title || promo.nama,
        discount: promo.discount || promo.diskon,
        validUntil: promo.validUntil || promo.durasi,
        description: promo.description || promo.deskripsi,
        startTime: promo.startTime || null,
        endTime: promo.endTime || null,
        items: promo.items,
        active,
      }),
    });
    setPromos(promos.map((p) => (p.id === promo.id ? updated : p)));
  };

  return (
    <>
      <Header title="Kelola Promo" />
      <div className="p-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-700">Manajemen Promo</h2>
          <button data-testid="btn-tambah-promo" onClick={() => setShowTambahPromo(true)} className="bg-[#2E6A67] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow hover:bg-opacity-90 transition-all">
            <Plus size={18} /> Tambah Promo
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">Total Promo Aktif : {promos.length}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promos.map((promo) => (
            <div key={promo.id} className="bg-gray-100 p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
              <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm relative">
                {promo.image ? <img src={promo.image} alt={promo.title} className="w-full h-full object-cover rounded-lg" /> : '[Banner Promo]'}
                <span className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${promo.active ? 'bg-[#2E6A67]' : 'bg-gray-400'}`}>
                  {promo.active ? 'Tersedia' : 'Nonaktif'}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-base">{promo.title || promo.nama}</h4>
                <p className="text-xs text-gray-400 mt-1">{promo.description || promo.deskripsi}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {promo.validUntil && (
                    <span className="text-[11px] text-gray-500 font-medium bg-gray-200 inline-block px-2 py-1 rounded">
                      📅 {promo.validUntil}
                    </span>
                  )}
                  {promo.startTime && promo.endTime && (
                    <span className="text-[11px] text-[#2E6A67] font-bold bg-[#2E6A67]/10 inline-block px-2 py-1 rounded">
                      ⏰ {promo.startTime} - {promo.endTime}
                    </span>
                  )}
                  {!promo.validUntil && !promo.startTime && (
                    <span className="text-[11px] text-gray-500 font-medium bg-gray-200 inline-block px-2 py-1 rounded">-</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <button 
                  data-testid={`btn-status-promo-${promo.id}`} 
                  onClick={() => togglePromoStatus(promo)}
                  className={`text-xs px-4 py-1.5 rounded-md font-medium transition-all ${
                    promo.active 
                      ? 'bg-[#2E6A67] text-white hover:bg-opacity-90' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {promo.active ? 'Aktif' : 'Nonaktif'}
                </button>
                <div className="flex gap-3 text-gray-500">
                  <button data-testid={`btn-edit-promo-${promo.id}`} onClick={() => handleEditPromo(promo)} className="cursor-pointer hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                  <button data-testid={`btn-delete-promo-${promo.id}`} onClick={() => deletePromo(promo.id)} className="cursor-pointer hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tambah Promo */}
      <TambahPromoModal
        isOpen={showTambahPromo}
        onClose={() => {
          setShowTambahPromo(false);
          setPromoToEdit(null);
        }}
        promoToEdit={promoToEdit}
        onCreated={(promo) => setPromos((current) => [...current, promo])}
        onUpdated={(updated) => setPromos((current) => current.map((p) => (p.id === updated.id ? updated : p)))}
      />
    </>
  );
};

// ==========================================
// TAB 4: KELOLA HALAMAN
// ==========================================
const HalamanView = ({ Header }) => {
  const [formData, setFormData] = useState({
    nama_cafe: '',
    logo_cafe: '',
    deskripsi: '',
    alamat: '',
    google_maps: '',
    jam_operasional: '',
    instagram: '',
    whatsapp: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    apiRequest('/api/halaman')
      .then(data => {
        if (data && data.about) {
          setFormData({
            nama_cafe: data.about.nama_cafe || '',
            logo_cafe: data.about.logo_cafe || '',
            deskripsi: data.about.deskripsi || '',
            alamat: data.about.alamat || '',
            google_maps: data.about.google_maps || '',
            jam_operasional: data.about.jam_operasional || '',
            instagram: data.about.instagram || '',
            whatsapp: data.about.whatsapp || ''
          });
        }
      })
      .catch(err => console.error('Error fetching halaman:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    const form = new FormData();
    form.append('image', file);

    try {
      const res = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, logo_cafe: data.url }));
      } else {
        alert(data.message || 'Gagal upload logo');
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      alert('Gagal upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSimpan = async () => {
    setIsSaving(true);
    try {
      await apiRequest('/api/halaman', {
        method: 'PUT',
        body: JSON.stringify({ about: formData })
      });
      alert('Halaman berhasil disimpan!');
    } catch (err) {
      console.error('Error saving halaman:', err);
      alert('Gagal menyimpan pengaturan halaman');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Memuat data...</div>;

  return (
    <>
      <Header title="Kelola Halaman" />
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl border border-gray-100">
          <h2 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Kelola Deskripsi Halaman</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Nama Cafe</label>
              <input 
                name="nama_cafe"
                value={formData.nama_cafe}
                onChange={handleChange}
                type="text" 
                className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:border-[#2E6A67] transition-all" 
                placeholder="Masukkan nama cafe..." 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Logo Cafe {uploadingLogo && '(Uploading...)'}</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#2E6A67] file:text-white cursor-pointer" 
              />
              {formData.logo_cafe && (
                <div className="mt-2 p-2 bg-gray-50 rounded-lg border flex items-center justify-center">
                  <img src={formData.logo_cafe} alt="Logo Preview" className="h-10 object-contain" />
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Deskripsi Cafe</label>
            <textarea 
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows={4} 
              className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:border-[#2E6A67] transition-all resize-y" 
              placeholder="Tulis deskripsi cafe di sini..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Alamat</label>
              <input 
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                type="text" 
                className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 text-sm mb-2 focus:outline-none focus:border-[#2E6A67] transition-all" 
                placeholder="Alamat lengkap" 
              />
              <input 
                name="google_maps"
                value={formData.google_maps}
                onChange={handleChange}
                type="text" 
                className="w-full p-2 bg-gray-200 rounded-lg text-xs text-gray-500 focus:outline-none focus:border-[#2E6A67] transition-all" 
                placeholder="Link Iframe Google Maps (src)" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Jam Operasional</label>
              <input 
                name="jam_operasional"
                value={formData.jam_operasional}
                onChange={handleChange}
                type="text" 
                className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] transition-all" 
                placeholder="Contoh: 09.00 - 22.00" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Contact</label>
              <div className="flex flex-col gap-2">
                <input 
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  type="text" 
                  className="w-full p-2.5 bg-gray-100 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] transition-all" 
                  placeholder="Username Instagram (tanpa @)" 
                />
                <input 
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  type="text" 
                  className="w-full p-2.5 bg-gray-100 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] transition-all" 
                  placeholder="WhatsApp Number (contoh: 628...)" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              className="px-6 py-2 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition text-sm"
              onClick={() => window.location.reload()}
            >
              Batal
            </button>
            <button 
              onClick={handleSimpan}
              disabled={isSaving}
              className={`px-6 py-2 bg-[#2E6A67] text-white rounded-lg font-medium hover:bg-opacity-95 transition text-sm shadow-sm ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
