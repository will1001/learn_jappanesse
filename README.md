# 🌸 Japanese Text Parser - AI Powered Translation & Romaji

Aplikasi Node.js untuk mengambil kata-kata dalam bahasa Jepang dari file teks, menerjemahkannya menggunakan AI (OpenRouter dengan model GPT-4o-mini), dan menampilkan hasilnya dalam GUI yang interaktif.

## 🚀 Fitur

- **Ekstraksi Otomatis**: Mengidentifikasi dan mengekstrak kata-kata Jepang (Hiragana, Katakana, Kanji) dari file teks
- **AI Translation**: Menggunakan OpenRouter API dengan model GPT-4o-mini untuk terjemahan yang akurat
- **Romaji Pronunciation**: Mendapatkan pengucapan Romaji untuk setiap kata
- **Multi-bahasa**: Terjemahan dalam Bahasa Inggris dan Indonesia
- **GUI Interaktif**: Interface modern dengan pencarian dan filter
- **Responsive Design**: Bekerja dengan baik di desktop dan mobile

## 📋 Prasyarat

- Node.js (versi 14 atau lebih tinggi)
- OpenRouter API Key (dapatkan dari [https://openrouter.ai/keys](https://openrouter.ai/keys))
- File `input.txt` dengan teks bahasa Jepang

## 🛠️ Installation

1. Clone atau download repository ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup API Key:
   - Buka file `src/config.js`
   - Ganti `YOUR_OPENROUTER_API_KEY` dengan API key Anda

## 📖 Cara Penggunaan

### Cara 1: Parsing File Input.txt (Mode CLI)

Pastikan Anda memiliki file `input.txt` di direktori utama dengan konten bahasa Jepang, lalu jalankan:

```bash
npm start
```

Aplikasi akan:
- Membaca `input.txt`
- Mengekstrak semua kata Jepang menggunakan AI
- Memproses setiap kata dengan AI untuk mendapatkan terjemahan dan romaji
- Menyimpan hasil ke `japanese_words.json`

### Cara 2: Upload File via GUI (Recommended)

1. **Start Backend Server**:
   ```bash
   npm run server
   ```

2. **Start Frontend** (di terminal baru):
   ```bash
   npm run dev
   ```

3. **Atau jalankan keduanya bersamaan**:
   ```bash
   npm run dev:full
   ```

4. **Buka browser** di `http://localhost:3000`

5. **Upload file**:
   - Drag & drop file .txt atau .md ke upload area
   - Atau klik "Choose File" untuk memilih file
   - File akan diproses dengan AI dan hasilnya langsung tampil di GUI

### Cara 3: Mode CLI dengan File Custom

Andka bisa memodifikasi `src/parser.js` untuk memproses file lain:

```javascript
// Ganti baris ini di main.js
const results = await parser.parseAndProcess('./nama_file_anda.txt');
```

## 🎮 Fitur GUI

- **File Upload**: Upload file .txt atau .md dengan drag & drop
- **AI-Powered Processing**: Ekstraksi kata menggunakan AI untuk hasil yang lebih akurat
- **Real-time Progress**: Lihat progress saat file diproses
- **Pencarian**: Cari kata berdasarkan huruf Jepang, romaji, atau terjemahan
- **Filter**: Filter berdasarkan jenis karakter (Hiragana, Katakana, Kanji)
- **Statistik**: Lihat total kata, kata yang difilter, dan karakter unik
- **Responsive Design**: Bekerja dengan baik di semua ukuran layar

## 🤖 AI Features

- **Smart Word Extraction**: AI menganalisis teks untuk mengekstrak kata-kata yang bermakna
- **Batch Processing**: Memproses teks dalam batch untuk optimasi API usage
- **Fallback Mechanism**: Otomatis menggunakan regex jika AI parsing gagal
- **Rate Limiting**: Delay otomatis untuk menghindari API rate limits
- **Context Analysis**: AI memahami konteks bahasa Jepang untuk ekstraksi yang lebih baik

## 📁 Struktur Project

```
japanese-text-parser/
├── src/
│   ├── config.js           # Konfigurasi API
│   ├── japaneseParser.js   # Parser logic
│   ├── parser.js          # Main entry point
│   └── main.js            # Frontend JavaScript
├── input.txt              # File input dengan teks Jepang
├── japanese_words.json    # Output JSON dengan hasil parsing
├── index.html             # Frontend HTML
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies
└── README.md              # Documentation
```

## 🔧 Konfigurasi API

### Mendapatkan OpenRouter API Key

1. Kunjungi [https://openrouter.ai/](https://openrouter.ai/)
2. Sign up atau login
3. Buka [API Keys page](https://openrouter.ai/keys)
4. Generate API key baru
5. Copy dan paste ke `src/config.js`

### Model yang Digunakan

- **Model**: `openai/gpt-4o-mini`
- **Cost**: Sangat hemat (sekitar $0.15 per 1M tokens)
- **Performance**: Cepat dan akurat untuk tugas terjemahan

## 📊 Format Output JSON

```json
[
  {
    "japanese": "こんにちは",
    "romaji": "konnichiwa",
    "english": "hello",
    "indonesian": "halo"
  }
]
```

## ⚠️ Catatan Penting

- **Rate Limiting**: Script menggunakan delay 1 detik antar request untuk menghindari rate limit
- **API Cost**: Pastikan Anda memiliki credit yang cukup di OpenRouter account
- **Input File**: Pastikan `input.txt` berisi karakter Jepang (Hiragana, Katakana, atau Kanji)

## 🚨 Troubleshooting

### API Key Error
```
❌ Error: Please set your OpenRouter API key in src/config.js
```
**Solution**: Setup API key Anda di `src/config.js`

### File Not Found
```
❌ Error: input.txt file not found in the current directory
```
**Solution**: Pastikan file `input.txt` ada di direktori utama

### API Error
```
Error processing word "xxx": Request failed with status code 429
```
**Solution**: Tunggu beberapa saat dan coba lagi (rate limit terlampaui)

## 🌟 Commands

```bash
# Setup API key
npm run setup

# Parse dan proses file input.txt (CLI mode)
npm start

# Jalankan backend server saja
npm run server

# Jalankan frontend development server saja
npm run dev

# Jalankan backend + frontend bersamaan (Recommended)
npm run dev:full

# Build untuk production
npm run build

# Preview production build
npm run preview
```

## 🚀 Quick Start

### Metode 1: Quick Start Script (Recommended)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

### Metode 2: Manual Commands

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup API key**:
   ```bash
   npm run setup
   # Masukkan OpenRouter API key Anda
   ```

3. **Start aplikasi**:
   ```bash
   npm run dev:full
   ```

4. **Buka browser**: http://localhost:3000

5. **Upload file** dan lihat hasilnya!

### 🌐 Server URLs
- **Frontend GUI**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Terima Kasih

- OpenRouter untuk API access
- Vite untuk development tool
- Axios untuk HTTP client
