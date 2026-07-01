# 🎬 Movie Explorer

Aplikasi katalog film mobile yang menampilkan daftar film populer dari [The Movie Database (TMDB)](https://www.themoviedb.org/), dengan fitur pencarian, halaman detail, animasi interaktif, favorit lokal, dan dukungan light/dark theme.

---

## 🚀 Cara Menjalankan Aplikasi di Emulator atau Perangkat Asli

### Prasyarat
- [Node.js](https://nodejs.org/) versi 20 atau lebih baru
- Salah satu dari:
  - **Expo Go** ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)) — cara tercepat untuk mencoba di perangkat asli tanpa build native
  - **Android Studio** untuk menjalankan di emulator Android
  - **Xcode** untuk menjalankan di simulator iOS (hanya macOS)
- Akun gratis di [themoviedb.org](https://www.themoviedb.org/settings/api) untuk mendapatkan API Key

> **Catatan untuk iOS:** Efek Liquid Glass pada tab bar (`expo-glass-effect`) hanya muncul di perangkat/simulator iOS 26+. Di iOS versi lebih lama, tab bar tetap tampil namun tanpa efek glass. Di Android, tab bar menggunakan tampilan solid semi-transparan.

### Langkah-langkah

**1. Clone dan install dependency**
```bash
git clone https://github.com/mikasa01014/Test-Bookingtogo.git
cd movie-explorer
npm install
```

**2. Konfigurasi API Key**

Daftar di [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) untuk mendapatkan API Key gratis (pilih "API Key (v3 auth)").

Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Isi `.env` dengan API Key Anda:
```
EXPO_PUBLIC_TMDB_API_KEY=masukkan_api_key_anda_di_sini
```

> Prefix `EXPO_PUBLIC_` wajib ada — Expo hanya menyertakan environment variable dengan prefix ini ke dalam bundle aplikasi.

**3. Jalankan aplikasi**
```bash
npx expo start
```

Setelah Metro Bundler berjalan, pilih salah satu:
- **Scan QR code** dengan aplikasi Expo Go di HP (Android/iOS) — paling cepat
- Tekan `a` — buka di Android Emulator (Android Studio harus terinstall)
- Tekan `i` — buka di iOS Simulator (Xcode harus terinstall, hanya macOS)

**4. (Opsional) Build native untuk animasi optimal**

Karena aplikasi menggunakan Reanimated 4.x dengan New Architecture, performa animasi paling baik saat dijalankan sebagai development build:
```bash
npx expo run:android
# atau
npx expo run:ios
```

**5. Menjalankan unit test**
```bash
npm test
npm run test:watch
```

---

## 📚 Pustaka (Libraries) Pihak Ketiga yang Digunakan dan Alasannya

| Library | Alasan Pemilihan |
|---|---|
| **Expo SDK 54** | Mempercepat development React Native tanpa perlu setup project native (Android/Xcode) secara manual. Menyediakan ekosistem modul resmi yang stabil dan kompatibel satu sama lain. |
| **React Navigation** (`@react-navigation/native`, `native-stack`, `bottom-tabs`) | Standar industri untuk navigasi di React Native. Kombinasi Stack Navigator (untuk halaman detail yang di-push di atas tab) dan Bottom Tab Navigator (untuk Home & Favorites) memberikan struktur navigasi yang natural dan familiar bagi pengguna mobile. |
| **axios** | HTTP client yang lebih ringkas dibanding `fetch` bawaan untuk kebutuhan seperti base URL terpusat, default query params (API key TMDB), dan deteksi error yang granular via `axios.isAxiosError()` — memudahkan mapping status HTTP ke pesan error yang informatif bagi pengguna. |
| **Zustand** | State management yang ringan dengan pendekatan selector-based — komponen hanya re-render ketika slice state yang relevan berubah, penting untuk performa saat merender grid film yang panjang. API-nya lebih sederhana dibanding Redux dan lebih terprediksi dibanding Context API untuk state yang kompleks. |
| **react-native-reanimated**  | Engine animasi utama seluruh aplikasi. Semua animasi — entrance grid (fade+slide+scale staggered), transisi shared-element ke halaman detail (poster membesar jadi backdrop), parallax/collapse/zoom backdrop, bounce tombol favorit dengan efek partikel, dan slide indicator theme toggle — dijalankan di UI thread via worklet. Hasilnya tetap mulus di 60fps meskipun JS thread sedang sibuk fetch data. |
| **react-native-gesture-handler** | Dependency wajib dari Reanimated dan React Navigation native-stack untuk sistem gesture berbasis native thread, termasuk swipe-back dan pull-to-refresh. |
| **react-native-worklets** | Peer dependency Reanimated 4.x — menjalankan kode animasi ("worklet") di thread terpisah dari JS thread sehingga animasi tidak terblokir oleh aktivitas JS. |
| **expo-glass-effect** | Memberikan efek Liquid Glass asli di iOS menggunakan `UIVisualEffectView` native — dipakai untuk tab bar floating pill agar konten film keliatan di baliknya dengan efek frosted glass + specular highlight khas iOS 26. Tidak ada alternatif yang memberikan efek visual setara di React Native tanpa library ini. |
| **expo-linear-gradient** | Gradient overlay di atas backdrop film (fade bawah ke warna background, fade atas untuk keterbacaan tombol back) — memberikan kesan visual yang lebih sinematik dan memastikan teks/tombol tetap terbaca di atas gambar apapun. |
| **expo-image** | Pengganti `Image` bawaan React Native dengan caching otomatis, placeholder blur-hash, dan performa decode gambar yang lebih baik — penting untuk grid poster film yang sering scroll cepat. |
| **@expo/vector-icons** | Set ikon (Ionicons) yang sudah bundled dengan Expo, memberikan tampilan ikon yang konsisten di iOS dan Android tanpa setup tambahan. |
| **@react-native-async-storage/async-storage** | Persistensi lokal untuk dua data: daftar film favorit dan preferensi tema (light/dark/system). Dipilih karena datanya berupa struktur sederhana (array/string) yang tidak membutuhkan relasi atau query kompleks seperti SQLite. Data tetap ada setelah aplikasi ditutup dan dibuka kembali. |
| **use-debounce** | Menunda pemanggilan API pencarian hingga pengguna berhenti mengetik (~450ms), menghindari request berlebihan di setiap keystroke dan menghemat kuota API TMDB. |
| **Jest + jest-expo + @testing-library/react-native** | Unit testing dengan preset resmi Expo yang sudah mengkonfigurasi mock untuk seluruh native module secara otomatis, sehingga test bisa berjalan di lingkungan Node.js tanpa emulator. |
| **TypeScript** | Type-safety di seluruh lapisan aplikasi — terutama berguna untuk parameter navigasi antar halaman (tipe-checked via `RootStackParamList`) dan response API TMDB yang banyak field opsional/nullable. |

---

## 🏗️ Pola Arsitektur: MVVM

Aplikasi ini menggunakan pola **MVVM (Model-View-ViewModel)** dengan tambahan lapisan Repository sebagai abstraksi sumber data.

### Struktur Folder

```
src/
├── types/
│   └── movie.ts              # MODEL — tipe data (Movie, MovieDetail, FavoriteMovie, AppError)
│
├── api/                      # Lapisan akses data mentah
│   ├── client.ts              # Instance axios + fungsi toAppError() + getImageUrl()
│   ├── movieApi.ts             # Fungsi pemanggilan endpoint TMDB (fetchPopularMovies, dll)
│   └── favoritesStorage.ts      # Baca/tulis favorit ke AsyncStorage
│
├── repositories/             # Abstraksi antara ViewModel dan sumber data
│   ├── movieRepository.ts     # Dipanggil store, mendelegasikan ke api/movieApi.ts
│   └── favoriteRepository.ts   # Dipanggil store, mendelegasikan ke api/favoritesStorage.ts
│
├── store/                    # VIEWMODEL — Zustand stores, memegang state & logic UI
│   ├── movieStore.ts           # State dashboard: daftar film, pencarian, pagination, refresh
│   ├── movieDetailStore.ts      # State halaman detail film
│   └── favoriteStore.ts          # State daftar favorit, toggle, sinkronisasi lokal
│
├── screens/                  # VIEW — halaman, hanya merender dari state ViewModel
│   ├── HomeScreen.tsx
│   ├── FavoritesScreen.tsx
│   └── MovieDetailScreen.tsx   # Backdrop dengan parallax + collapse + zoom on pull
│
├── components/               # VIEW — komponen UI reusable
│   ├── GlassTabBar.tsx          # Floating pill tab bar dengan iOS Liquid Glass / Android solid
│   ├── AnimatedMovieCard.tsx     # Card dengan entrance animation staggered
│   ├── AnimatedFavoriteButton.tsx # Heart bounce + efek partikel saat di-like
│   ├── PullToRefreshList.tsx      # FlatList dengan custom arrow pull-to-refresh indicator
│   ├── ThemeToggle.tsx             # Switcher 3-posisi (System/Light/Dark) dengan slide animation
│   └── ...                          # RatingBadge, SearchBar, ErrorView, GenreChip, dll
│
├── navigation/               # Konfigurasi React Navigation
│   ├── RootNavigator.tsx      # Stack: Tabs + MovieDetail
│   ├── TabNavigator.tsx        # Bottom tabs: Home + Favorites, pakai GlassTabBar
│   ├── SharedPosterContext.tsx  # Context untuk shared-element transition (simpan posisi card)
│   ├── useMovieNavigation.ts     # Hook: tap card → measure posisi → navigate ke Detail
│   ├── useMovieDetailScreenData.ts # Hook: load data detail, dipakai MovieDetailScreen
│   └── types.ts                    # RootStackParamList, TabParamList
│
├── theme/
│   ├── palette.ts            # Warna light & dark (ColorPalette interface)
│   ├── ThemeProvider.tsx      # Context yang meresolusi preferensi → palette aktual
│   └── themeStore.ts           # Zustand store untuk preferensi tema, persisten di AsyncStorage
│
└── utils/
    └── format.ts             # Fungsi format tanggal, rating, runtime
```

### Penjelasan Alur MVVM

**Model** (`src/types/movie.ts`) mendefinisikan bentuk data yang dipakai di seluruh aplikasi: `Movie`, `MovieDetail`, `FavoriteMovie`, dan `AppError`.

**Repository** (`src/repositories/`) adalah lapisan tipis yang menjadi satu-satunya titik penghubung antara ViewModel dan sumber data. ViewModel tidak pernah memanggil `axios` atau `AsyncStorage` langsung — selalu melalui repository. Ini membuat sumber data mudah diganti di masa depan tanpa menyentuh logic UI, dan memudahkan pengujian karena repository bisa di-mock.

**ViewModel** (`src/store/`) adalah Zustand store yang menyimpan seluruh state layar (data film, status loading, error, pagination, refresh) dan mengekspos fungsi aksi. Seluruh logic pengambilan data, penanganan error, dan orkestrasi ada di sini — bukan di komponen UI.

**View** (`src/screens/`, `src/components/`) adalah komponen React yang murni membaca state dari ViewModel via hook Zustand dan meneruskan interaksi pengguna ke fungsi aksi ViewModel. Tidak ada business logic atau pemanggilan API di level ini.

### Mengapa MVVM?

- **Pemisahan tanggung jawab yang jelas** — perubahan tampilan tidak memengaruhi logic data, dan sebaliknya. Misalnya, mengganti warna tema tidak perlu menyentuh store.
- **ViewModel mudah diuji tanpa UI** — pada unit test, Repository di-mock sehingga logic di dalam Store diuji secara terisolasi tanpa memanggil API sungguhan atau emulator.
- **Reaktivitas otomatis dengan performa baik** — Zustand selector memastikan setiap komponen hanya re-render ketika bagian state yang benar-benar ia konsumsi berubah.

---

## 📂 Environment

| File | Keterangan |
|---|---|
| `.env.example` | Template berisi nama variable yang dibutuhkan (aman di-commit) |
| `.env` | API key asli Anda — sudah masuk `.gitignore`, **jangan di-commit** |
---

## 📂 Environment

| File           | Keterangan                                                         |
| -------------- | ------------------------------------------------------------------ |
| `.env.example` | Template berisi nama variable yang dibutuhkan (aman di-commit)     |
| `.env`         | API key asli Anda — sudah masuk `.gitignore`, **jangan di-commit** |
