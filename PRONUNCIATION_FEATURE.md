# Pronunciation Feature

Fitur pengucapan bahasa Jepang telah ditambahkan menggunakan Web Speech API.

## Fitur yang Ditambahkan

### 1. Word List Pronunciation
- Setiap kartu kata di word list memiliki tombol "🔊 Pronunciation"
- Klik tombol untuk mendengar pengucapan kata dalam bahasa Jepang
- Visual feedback: tombol berubah hijau dan menampilkan "Speaking..." saat sedang berbicara

### 2. Quiz Vocabulary Pronunciation
- Tombol speaker (🔊) muncul di pojok kanan atas question card
- Tersedia untuk:
  - Vocabulary Quiz (multiple choice)
  - Vocabulary Typing Quiz
  - Kanji Typing Quiz
- Klik untuk mendengar pengucapan kata yang sedang ditanyakan

## Teknologi
- Menggunakan Web Speech API (SpeechSynthesis)
- Language: Japanese (ja-JP)
- Rate: 0.8 (sedikit lebih lambat untuk pembelajaran)
- Pitch: 1 (normal)

## Browser Support
Fitur ini didukung oleh browser modern:
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

## Cara Penggunaan

### Di Word List:
1. Browse daftar kata Jepang
2. Klik tombol "🔊 Pronunciation" di kartu kata
3. Dengarkan pengucapan yang benar

### Di Quiz:
1. Mulai Vocabulary Quiz atau Vocabulary/Kanji Typing Quiz
2. Klik tombol speaker (🔊) di pojok kanan atas question card
3. Dengarkan pengucapan kata sebelum menjawab

## Catatan
- Hanya satu audio yang bisa dimainkan dalam satu waktu
- Klik tombol pronunciation lagi akan menghentikan audio sebelumnya dan memulai yang baru
- Jika browser tidak support Web Speech API, tombol tetap muncul tapi tidak akan mengeluarkan suara
