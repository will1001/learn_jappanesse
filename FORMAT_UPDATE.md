# Format Update - japanese_words.json

## Format Baru (Updated)

Setiap entry sekarang memiliki 4 field:

```json
{
  "japanese": "きょう",        // Hiragana/Katakana SAJA
  "kanji": "今日",             // Kanji (kosong jika tidak ada)
  "romaji": "kyou",           // Romaji (pronunciation)
  "indonesian": "hari ini"    // Terjemahan Indonesia
}
```

## Contoh Data

### Kata dengan Kanji:
```json
{
  "japanese": "きょう",
  "kanji": "今日",
  "romaji": "kyou",
  "indonesian": "hari ini"
}
```

### Kata Pure Hiragana (tanpa kanji):
```json
{
  "japanese": "こんにちは",
  "kanji": "",
  "romaji": "konnichiwa",
  "indonesian": "selamat siang"
}
```

### Kata Katakana (tanpa kanji):
```json
{
  "japanese": "アメリカ",
  "kanji": "",
  "romaji": "Amerika",
  "indonesian": "Amerika"
}
```

## Perubahan pada Kode

### 1. File: `japanese_words.json`
- Format data telah diubah untuk memisahkan kanji dan kana
- Field `japanese` sekarang hanya berisi hiragana/katakana
- Field `kanji` baru ditambahkan untuk menyimpan karakter kanji

### 2. File: `src/main.js`
- `createWordCard()`: Sekarang menampilkan "Kanji (Hiragana)" jika ada kanji
- `handleSearch()`: Mencari di field `kanji` juga
- `isWordType()`: Filter berdasarkan object word, bukan string
- `updateStats()`: Menghitung unique characters dari kanji dan kana

### 3. File: `src/japaneseParser.js`
- `extractKanjiAndKana()`: Fungsi baru untuk memisahkan kanji dan kana
- `callAIBatch()`: AI prompt updated untuk format baru
- `callAI()`: AI prompt updated untuk format baru
- `processWordsIndividually()`: Fallback dengan extraction kanji/kana

## Statistics

- Total data: 344 kata
- Data dengan kanji: 201 kata (58.4%)
- Data pure hiragana/katakana: 143 kata (41.6%)

## Cara Penggunaan

### Menampilkan kata di UI:
```javascript
// Jika ada kanji, tampilkan: "今日 (きょう)"
// Jika tidak ada kanji, tampilkan: "こんにちは"
const displayText = word.kanji 
    ? `${word.kanji} (${word.japanese})` 
    : word.japanese;
```

### Filter berdasarkan tipe:
```javascript
// Hiragana only (no kanji)
word => /^[\u3040-\u309f]+$/.test(word.japanese) && !word.kanji

// Katakana only (no kanji)
word => /^[\u30a0-\u30ff]+$/.test(word.japanese) && !word.kanji

// Has Kanji
word => word.kanji && word.kanji.length > 0
```

## Update Date
2025-11-21
