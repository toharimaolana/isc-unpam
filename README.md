# ISC Absenku - Sistem Absensi & Manajemen Anggota

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

**ISC Absenku** adalah aplikasi manajemen presensi/absensi berbasis web yang dirancang khusus untuk organisasi/komunitas **Integrated Student Community (ISC) Universitas Pamulang**. Aplikasi ini menyediakan fitur pemindaian barcode presensi secara realtime, manajemen anggota, pengelolaan jadwal kelas, serta rekapitulasi data kehadiran yang mudah di-export.

---

## 🚀 Fitur Utama

- 📷 **Barcode Scanner & Realtime Absensi**
  - Pemindaian barcode anggota secara cepat menggunakan kamera via Quagga2.
  - Integrasi listener data presensi secara *realtime* memanfaatkan fitur realtime Supabase.
  - Generasi kode barcode individual untuk setiap anggota (JsBarcode).

- 👥 **Manajemen Anggota (Members)**
  - Pengelolaan data anggota ISC (Tambah, Edit, Hapus, Filter).
  - Penataan identitas unik (ID Anggota/NIM/Barcode).

- 📚 **Manajemen Kelas & Sesi**
  - Pembuatan dan pengelolaan jadwal pertemuaan/kelas latihan/kegiatan ISC.
  - Penentuan status kehadiran (Hadir, Izin, Sakit, Alpa) per sesi kelas.

- 📊 **Rekapitulasi Data & Ekspor**
  - Tabel rekapitulasi presensi komprehensif menggunakan TanStack Table.
  - Fitur ekspor data presensi ke format Excel (`.xlsx`) dan CSV (PapaParse).

- 🔒 **Sistem Otentikasi & Keamanan**
  - Manajemen sesi pengguna/admin yang aman terintegrasi dengan Supabase Auth & Zustand.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Library/Framework**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/), [Headless UI](https://headlessui.com/), [Lucide React Icons](https://lucide.dev/)
- **State Management & Data Fetching**: [Zustand](https://zustand-demo.pmnd.rs/), [TanStack React Query v5](https://tanstack.com/query)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Scanner & Barcode**: `@ericblade/quagga2`, `jsbarcode`
- **Data Table & Utilities**: `@tanstack/react-table`, `date-fns`, `papaparse`, `xlsx`

### Backend & Database
- **BaaS**: [Supabase](https://supabase.com/) (Database PostgreSQL, Realtime Subscriptions, Authentication)

---

## 🏁 Memulai (Getting Started)

### Prasyarat

Sebelum memulai, pastikan perangkat Anda telah terinstal:
- [Node.js](https://nodejs.org/) (versi 18+ direkomendasikan)
- [npm](https://www.npmjs.com/) atau [pnpm](https://pnpm.io/)

### 1. Clone Repository

```bash
git clone https://github.com/toharimaolana/isc-unpam.git
cd isc-unpam
```

### 2. Instalasi Dependensi

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env` di root direktori proyek dan isi variabel berikut:

```env
VITE_SUPABASE_URL=https://your-supabase-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Menjalankan Server Pengembangan

```bash
npm run dev
```

Aplikasi dapat diakses melalui browser di `http://localhost:5173`.

---

## 📦 Build untuk Produksi

Untuk membuat bundle produksi siap deploy:

```bash
npm run build
```

Hasil build akan tersimpan di dalam folder `dist/`. Anda dapat menguji hasil build secara lokal dengan:

```bash
npm run preview
```

---

## 📄 Lisensi

Proyek ini dikembangkan untuk kebutuhan internal **Integrated Student Community (ISC) UNPAM**.
