# Example Sentences Feature

Fitur contoh kalimat penggunaan kata telah ditambahkan ke aplikasi Japanese Word Viewer.

## Fitur yang Ditambahkan

### 1. Click to Show Examples
- Setiap kartu kata di word list dapat diklik
- Klik kartu akan membuka modal popup dengan contoh kalimat
- Modal menampilkan:
  - Kata dalam Kanji/Hiragana/Katakana
  - Romaji (cara baca)
  - Arti dalam bahasa Indonesia
  - 2-3 contoh kalimat penggunaan

### 2. Example Sentence Display
Setiap contoh kalimat menampilkan:
- **Japanese**: Kalimat dalam bahasa Jepang (Kanji + Kana)
- **Romaji**: Transliterasi cara baca
- **Indonesian**: Terjemahan dalam bahasa Indonesia
- **Pronunciation Button**: Tombol untuk mendengar pengucapan kalimat

### 3. Sentence Patterns
Contoh kalimat di-generate berdasarkan jenis kata:

#### Untuk Kata Benda (Noun):
- これは[kata]です。(Kore wa [kata] desu.) - Ini adalah [kata].
- [kata]が好きです。([Kata] ga suki desu.) - Saya suka [kata].
- [kata]があります。([Kata] ga arimasu.) - Ada [kata].

#### Untuk Kata Kerja (Verb):
- 毎日[kata]。(Mainichi [kata].) - Setiap hari [kata].
- 私は[kata]たいです。(Watashi wa [kata]tai desu.) - Saya ingin [kata].

#### Untuk Kata Sifat (Adjective):
- とても[kata]です。(Totemo [kata] desu.) - Sangat [kata].
- [kata]人です。([Kata] hito desu.) - Orang yang [kata].

### 4. Modal Features
- **ESC Key**: Tekan ESC untuk menutup modal
- **Click Outside**: Klik di luar modal untuk menutup
- **Close Button**: Tombol × di pojok kanan atas
- **Auto-stop Audio**: Audio berhenti otomatis saat modal ditutup
- **Smooth Animation**: Animasi slide-up dan fade-in

### 5. Interactive Elements
- Hover effects pada contoh kalimat
- Visual feedback saat audio diputar (tombol berubah hijau)
- Loading spinner saat generate contoh kalimat
- Responsive design yang mobile-friendly

## Cara Penggunaan

1. **Browse Word List**: Lihat daftar kata di halaman utama
2. **Click Word Card**: Klik pada kartu kata yang ingin dipelajari
3. **View Examples**: Modal akan muncul dengan contoh kalimat
4. **Listen Pronunciation**: Klik tombol 🔊 Listen untuk mendengar pengucapan
5. **Close Modal**: Tekan ESC, klik di luar modal, atau klik tombol × untuk menutup

## Teknologi
- Modal overlay dengan backdrop blur effect
- CSS animations (fadeIn, slideUp, pulse)
- Dynamic sentence generation based on word type
- Speech synthesis untuk setiap contoh kalimat
- Event handling untuk keyboard (ESC) dan click events

## Catatan
- Tombol pronunciation di kartu kata tidak akan membuka modal (event.stopPropagation)
- Hanya satu audio yang bisa diputar dalam satu waktu
- Contoh kalimat di-generate secara otomatis berdasarkan pola umum bahasa Jepang
- Sistem mendeteksi jenis kata (noun/verb/adjective) dari terjemahan Indonesia
