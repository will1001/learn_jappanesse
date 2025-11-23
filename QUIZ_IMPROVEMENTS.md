# Quiz Improvements

## Perubahan yang Dilakukan

### 1. ✅ Tombol "Next Question"
- **Sebelumnya**: Quiz otomatis berpindah ke pertanyaan berikutnya setelah 1.5 detik
- **Sekarang**: User harus klik tombol "Next Question →" untuk lanjut ke soal berikutnya
- **Manfaat**: User punya waktu untuk membaca feedback dan memahami jawaban yang benar

### 2. ✅ Highlight Jawaban Benar
- **Sebelumnya**: Jika user salah, hanya feedback text yang muncul
- **Sekarang**: 
  - Jawaban yang dipilih user (salah) ditandai dengan warna **merah**
  - Jawaban yang benar ditandai dengan warna **hijau**
- **Manfaat**: User bisa langsung melihat mana jawaban yang benar secara visual

### 3. ✅ Disable Buttons Setelah Dijawab
- Setelah user memilih jawaban, semua tombol option di-disable
- Mencegah user klik option lain setelah menjawab
- Buttons otomatis aktif lagi saat pertanyaan berikutnya dimuat

### 4. ✅ Display Kanji di Vocabulary Quiz
- Pertanyaan vocabulary sekarang menampilkan: **"Kanji (Hiragana)"**
- Contoh: "今日 (きょう)" untuk kata "hari ini"
- Membantu user belajar kanji sambil mengerjakan quiz

## Detail Implementasi

### File yang Diubah

#### 1. `index.html`
```html
<!-- Tombol Next ditambahkan -->
<button class="next-question-btn" id="nextQuestionBtn" style="display: none;">
    Next Question →
</button>
```

**CSS untuk tombol:**
```css
.next-question-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 15px 40px;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}
```

#### 2. `src/main.js`

**Event Listener untuk tombol Next:**
```javascript
document.getElementById('nextQuestionBtn').addEventListener('click', () => {
    this.nextQuestion();
});
```

**handleAnswer() - Logic baru:**
```javascript
handleAnswer(selectedOption, btnElement, answerProp) {
    // Disable all buttons
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.style.pointerEvents = 'none');
    
    if (isCorrect) {
        btnElement.classList.add('correct'); // Hijau
    } else {
        btnElement.classList.add('wrong'); // Merah
        
        // Highlight jawaban yang benar dengan hijau
        allButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }
    
    // Tampilkan tombol Next
    document.getElementById('nextQuestionBtn').style.display = 'inline-block';
}
```

**nextQuestion() - Reset state:**
```javascript
nextQuestion() {
    // Hide tombol Next saat pertanyaan baru dimuat
    document.getElementById('nextQuestionBtn').style.display = 'none';
    
    // Display kanji untuk vocabulary quiz
    const displayQuestion = this.quizState.mode === 'vocabulary' && questionItem.kanji 
        ? `${questionItem.kanji} (${questionItem[questionProp]})` 
        : questionItem[questionProp];
}
```

## User Experience Flow

1. **Pertanyaan muncul** → User melihat pertanyaan dan 4 pilihan jawaban
2. **User memilih jawaban** → 
   - Jika benar: Tombol yang dipilih menjadi **hijau** ✅
   - Jika salah: Tombol yang dipilih menjadi **merah** ❌, dan jawaban benar ditandai **hijau** ✅
3. **Feedback text muncul** → "Correct! 🎉" atau "Wrong! The correct answer was ..."
4. **Tombol "Next Question →" muncul** → User klik untuk lanjut
5. **Pertanyaan baru dimuat** → Kembali ke step 1

## Screenshots Konsep

### Ketika User Benar:
```
┌─────────────────────────┐
│   今日 (きょう)          │  ← Pertanyaan dengan kanji
│   kyou                  │  ← Romaji
└─────────────────────────┘

[hari ini] ✅ (hijau)
[kemarin]
[besok]
[minggu ini]

✅ Correct! 🎉

[Next Question →]
```

### Ketika User Salah:
```
┌─────────────────────────┐
│   今日 (きょう)          │
│   kyou                  │
└─────────────────────────┘

[hari ini] ✅ (hijau - jawaban benar)
[kemarin] ❌ (merah - pilihan user)
[besok]
[minggu ini]

❌ Wrong! The correct answer was "hari ini"

[Next Question →]
```

## Testing Checklist

- [x] Tombol Next muncul setelah jawaban dipilih
- [x] Tombol Next hilang saat pertanyaan baru dimuat
- [x] Jawaban benar ditandai hijau
- [x] Jawaban salah ditandai merah
- [x] Tidak bisa klik option lain setelah menjawab
- [x] Kanji ditampilkan di vocabulary quiz
- [x] Score bertambah saat jawaban benar
- [x] Feedback text sesuai dengan jawaban

## Update Date
2025-11-21
