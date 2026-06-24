import { useState, useRef } from 'react';
import { 
  ClipboardList, Coffee, Tag, Layout,
  Plus, Edit2, Trash2, Eye, Star, LogOut, X, Upload, Image,
  ChevronLeft, ChevronRight, Minus, Calendar, Clock, Users, Phone, User
} from 'lucide-react';

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
      <button data-testid="btn-preview-halaman" className="bg-white text-[#2E6A67] px-5 py-2 rounded-full font-medium shadow hover:bg-gray-50 transition flex items-center gap-2">
        <Eye size={16} /> Preview Halaman
      </button>
    </div>
  );

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen font-sans antialiased text-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto h-screen">
        {activeTab === 'reservasi' && <ReservasiView Header={Header} />}
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
const TambahReservasiModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [jumlahTamu, setJumlahTamu] = useState(2);
  const [formData, setFormData] = useState({
    nama: '', whatsapp: '', catatan: ''
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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
      const selected = selectedDate === day;
      const today = isToday(day);
      cells.push(
        <button
          key={day}
          disabled={past}
          onClick={() => setSelectedDate(day)}
          className={`w-9 h-9 rounded-full text-sm font-medium transition-all flex items-center justify-center
            ${past ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-[#2E6A67]/10'}
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
              disabled={!formData.nama || !formData.whatsapp}
              onClick={handleReset}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                formData.nama && formData.whatsapp
                  ? 'bg-[#2E6A67] text-white hover:bg-[#245552] shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
// TAB 1: KELOLA RESERVASI
// ==========================================
const ReservasiView = ({ Header }) => {
  const [showTambahReservasi, setShowTambahReservasi] = useState(false);
  const dummyReservasi = [
    { id: 1, waktu: '26 Mei 2026 13.00', customer: 'Andrew', kontak: '08521138204239', jumlah: 3, status: 'Menunggu', color: 'text-yellow-600 bg-yellow-50' },
    { id: 2, waktu: '26 Mei 2026 13.00', customer: 'Andrew', kontak: '08521138204239', jumlah: 3, status: 'Selesai', color: 'text-green-600 bg-green-50' },
    { id: 3, waktu: '26 Mei 2026 13.00', customer: 'Andrew', kontak: '08521138204239', jumlah: 3, status: 'Batal', color: 'text-red-600 bg-red-50' },
  ];

  return (
    <>
      <Header title="Kelola Reservasi" />
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <button data-testid="link-kelola-jadwal" className="text-gray-500 font-medium underline cursor-pointer hover:text-gray-700">kelola jadwal</button>
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
                {dummyReservasi.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-700">{row.waktu}</td>
                    <td className="p-4">{row.customer}</td>
                    <td className="p-4 text-gray-500">{row.kontak}</td>
                    <td className="p-4 text-center">{row.jumlah}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-semibold text-xs ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button data-testid={`btn-detail-reservasi-${row.id}`} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-300 transition-colors">
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
      <TambahReservasiModal isOpen={showTambahReservasi} onClose={() => setShowTambahReservasi(false)} />
    </>
  );
};

// ==========================================
// TAB 2: KELOLA MENU
// ==========================================
// ==========================================
// MODAL: TAMBAH MENU
// ==========================================
const TambahMenuModal = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nama: '', kategori: '', harga: '', deskripsi: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    // Handle save logic here
    onClose();
  };

  const handleCancel = () => {
    setFormData({ nama: '', kategori: '', harga: '', deskripsi: '' });
    setPreviewImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCancel} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 animate-modalIn">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-2">
          <h2 className="text-xl font-bold text-[#2E6A67]">Tambah Menu</h2>
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
            className="px-8 py-2.5 bg-[#2E6A67] text-white font-semibold rounded-lg hover:bg-[#245552] transition-all text-sm shadow-md hover:shadow-lg"
          >
            Simpan
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

  const dummyMenus = [
    { id: 1, name: 'creamy butterscoot latte', price: '55k', category: 'drink' },
    { id: 2, name: 'chicken parmigiana', price: '65k', category: 'food' },
    { id: 3, name: 'ice latte', price: '55k', category: 'drink' },
    { id: 4, name: 'mie goreng spesial', price: '55k', category: 'food' },
  ];

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-8 animate-modalIn">
        <h2 className="text-2xl font-bold text-[#2E6A67] text-center mb-6">Tambah Menu</h2>
        
        {/* Search */}
        <input 
          type="text" 
          placeholder="Cari menu..." 
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
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
          {dummyMenus.map(menu => {
            const isSelected = localSelected.find(m => m.id === menu.id);
            return (
              <div 
                key={menu.id} 
                onClick={() => toggleSelection(menu)}
                className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer transition-colors ${isSelected ? 'bg-[#2E6A67] text-white border-[#2E6A67]' : 'bg-white border-gray-200 text-gray-700 hover:border-[#2E6A67]'}`}
              >
                <span className="font-medium text-sm">{menu.name}</span>
                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#ba8f65]'}`}>{menu.price}</span>
              </div>
            );
          })}
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
const TambahPromoModal = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nama: '', diskon: '', durasi: '', deskripsi: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [showMenuSelection, setShowMenuSelection] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onClose();
  };

  const handleCancel = () => {
    setFormData({ nama: '', diskon: '', durasi: '', deskripsi: '' });
    setPreviewImage(null);
    setSelectedMenus([]);
    onClose();
  };

  const removeMenu = (id) => {
    setSelectedMenus(selectedMenus.filter(m => m.id !== id));
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
                className="flex-1 bg-gray-100 rounded-md px-4 py-2 border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0">Diskon</label>
              <input
                type="text" name="diskon" value={formData.diskon} onChange={handleChange}
                className="w-48 bg-gray-100 rounded-md px-4 py-2 border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0">Durasi Promo</label>
              <input
                type="text" name="durasi" value={formData.durasi} onChange={handleChange}
                className="w-48 bg-gray-100 rounded-md px-4 py-2 border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20"
              />
            </div>

            <div className="flex items-start gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0 pt-2">Deskripsi</label>
              <textarea
                name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={3}
                className="flex-1 bg-gray-100 rounded-md px-4 py-2 border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#2E6A67]/20 resize-none"
              />
            </div>

            <div className="flex items-start gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0 pt-2">Poster Promo</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-gray-100 rounded-md h-12 flex items-center px-4 cursor-pointer hover:bg-gray-200 overflow-hidden"
              >
                {previewImage ? <img src={previewImage} className="h-full object-cover" /> : <span className="text-gray-400 text-xs">Klik untuk upload...</span>}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex items-start gap-6">
              <label className="w-32 text-sm font-bold text-[#2E6A67] flex-shrink-0 pt-2">Menu Promo</label>
              <div className="flex-1 flex flex-wrap gap-2 items-start">
                {selectedMenus.map(menu => (
                  <div key={menu.id} className="bg-gray-100 rounded-md px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-gray-700">
                    {menu.name}
                    <button onClick={() => removeMenu(menu.id)} className="text-red-500 hover:text-red-700 rounded-full p-0.5">
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                ))}
                {selectedMenus.length < 4 && (
                  <div className="bg-gray-100 rounded-md px-4 py-1.5 min-w-[100px]"></div>
                )}
                {selectedMenus.length < 3 && (
                  <div className="bg-gray-100 rounded-md px-4 py-1.5 min-w-[100px]"></div>
                )}
                <div className="w-full mt-2">
                  <button 
                    onClick={() => setShowMenuSelection(true)}
                    className="w-8 h-8 bg-[#2E6A67] text-white rounded flex items-center justify-center hover:bg-[#245552] transition-colors"
                  >
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
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
        selectedMenus={selectedMenus}
        onSave={(menus) => setSelectedMenus(menus)}
      />
    </div>
  );
};

const MenuView = ({ Header }) => {
  const [menus, setMenus] = useState([
    { id: 1, nama: 'Espresso', harga: '35.000', status: 'Tersedia', tersedia: true },
    { id: 2, nama: 'Americano', harga: '35.000', status: 'Habis', tersedia: false },
    { id: 3, nama: 'Espresso', harga: '35.000', status: 'Tersedia', tersedia: true },
  ]);
  const [showTambahMenu, setShowTambahMenu] = useState(false);

  const toggleStatus = (id) => {
    setMenus(menus.map(menu => {
      if (menu.id === id) {
        const newStatus = !menu.tersedia;
        return { ...menu, tersedia: newStatus, status: newStatus ? 'Tersedia' : 'Habis' };
      }
      return menu;
    }));
  };

  return (
    <>
      <Header title="Kelola Menu" />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700">Manajemen Menu</h2>
          <button data-testid="btn-tambah-menu" onClick={() => setShowTambahMenu(true)} className="bg-[#2E6A67] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow hover:bg-opacity-90 transition-all">
            <Plus size={18} /> tambah menu
          </button>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-600 mb-4 border-b pb-2">Kopi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((item) => (
              <div key={item.id} className="bg-gray-100 p-4 rounded-xl flex gap-4 relative shadow-sm border border-gray-200">
                <div className="w-24 h-24 bg-gray-300 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-500 font-light text-xs">
                  {item.tersedia ? '[Foto]' : '[Kosong]'}
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-gray-800">{item.nama}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 ${
                        item.tersedia ? 'bg-[#2E6A67] text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-semibold mt-1">{item.harga}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">Deskripsi menu singkat...</p>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-gray-400 cursor-pointer hover:text-yellow-400 transition-colors" data-testid={`icon-star-${item.id}`} />
                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.tersedia}
                        data-testid={`toggle-menu-${item.id}`}
                        onClick={() => toggleStatus(item.id)}
                        className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          item.tersedia ? 'bg-[#2E6A67]' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          item.tersedia ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                    <div className="flex gap-3 text-gray-500">
                      <button data-testid={`btn-edit-menu-${item.id}`} className="cursor-pointer hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                      <button data-testid={`btn-delete-menu-${item.id}`} className="cursor-pointer hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Tambah Menu */}
      <TambahMenuModal isOpen={showTambahMenu} onClose={() => setShowTambahMenu(false)} />
    </>
  );
};

// ==========================================
// TAB 3: KELOLA PROMO
// ==========================================
const PromoView = ({ Header }) => {
  const [showTambahPromo, setShowTambahPromo] = useState(false);

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
        <p className="text-sm text-gray-500 mb-6">Total Promo Aktif : 2</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((id) => (
            <div key={id} className="bg-gray-100 p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
              <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm relative">
                [Banner Promo]
                <span className="absolute top-3 right-3 bg-[#2E6A67] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">Tersedia</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-base">Valentine Deals</h4>
                <p className="text-xs text-gray-400 mt-1">Deskripsi promo menarik disematkan disini...</p>
                <p className="text-[11px] text-gray-500 font-medium mt-2 bg-gray-200 inline-block px-2 py-1 rounded">
                  10 February 2026 - 15 February 2026
                </p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <button data-testid={`btn-status-promo-${id}`} className="bg-[#2E6A67] text-white text-xs px-4 py-1.5 rounded-md font-medium hover:bg-opacity-90 transition-all">Aktif</button>
                <div className="flex gap-3 text-gray-500">
                  <button data-testid={`btn-edit-promo-${id}`} className="cursor-pointer hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                  <button data-testid={`btn-delete-promo-${id}`} className="cursor-pointer hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tambah Promo */}
      <TambahPromoModal isOpen={showTambahPromo} onClose={() => setShowTambahPromo(false)} />
    </>
  );
};

// ==========================================
// TAB 4: KELOLA HALAMAN
// ==========================================
const HalamanView = ({ Header }) => (
  <>
    <Header title="Kelola Halaman" />
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Kelola Deskripsi Halaman</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Nama Cafe</label>
            <input data-testid="input-nama-cafe" type="text" className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:border-[#2E6A67] transition-all" placeholder="Masukkan nama cafe..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Logo Cafe</label>
            <input data-testid="input-logo-cafe" type="file" className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#2E6A67] file:text-white cursor-pointer" />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Deskripsi Cafe</label>
          <textarea data-testid="textarea-deskripsi" rows={4} className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:border-[#2E6A67] transition-all resize-y" placeholder="Tulis deskripsi cafe di sini..."></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Alamat</label>
            <input data-testid="input-alamat" type="text" className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 text-sm mb-2 focus:outline-none focus:border-[#2E6A67] transition-all" placeholder="Alamat lengkap" />
            <input data-testid="input-gmaps" type="text" className="w-full p-2 bg-gray-200 rounded-lg text-xs text-gray-500 focus:outline-none focus:border-[#2E6A67] transition-all" placeholder="Link Google Maps" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Jam Operasional</label>
            <input data-testid="input-jam" type="text" className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] transition-all" placeholder="Contoh: 09.00 - 22.00" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Contact</label>
            <div className="flex flex-col gap-2">
              <input data-testid="input-instagram" type="text" className="w-full p-2.5 bg-gray-100 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] transition-all" placeholder="Instagram Link" />
              <input data-testid="input-whatsapp" type="text" className="w-full p-2.5 bg-gray-100 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E6A67] transition-all" placeholder="WhatsApp Number" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button data-testid="btn-batal-halaman" className="px-6 py-2 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition text-sm">Batal</button>
          <button data-testid="btn-simpan-halaman" className="px-6 py-2 bg-[#2E6A67] text-white rounded-lg font-medium hover:bg-opacity-95 transition text-sm shadow-sm">Simpan</button>
        </div>
      </div>
    </div>
  </>
);