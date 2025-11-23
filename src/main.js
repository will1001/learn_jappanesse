class JapaneseWordViewer {
    constructor() {
        this.words = [];
        this.filteredWords = [];
        this.currentFilter = 'all';
        this.apiBase = 'http://localhost:3001/api';
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        
        // Kana Data
        this.hiraganaData = [
            { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
            { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
            { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
            { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' },
            { char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' },
            { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
            { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' },
            { char: 'や', romaji: 'ya' }, { char: '', romaji: '' }, { char: 'ゆ', romaji: 'yu' }, { char: '', romaji: '' }, { char: 'よ', romaji: 'yo' },
            { char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' },
            { char: 'わ', romaji: 'wa' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: 'を', romaji: 'wo' },
            { char: 'ん', romaji: 'n' }
        ];

        this.katakanaData = [
            { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
            { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
            { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
            { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' },
            { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' },
            { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
            { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' },
            { char: 'ヤ', romaji: 'ya' }, { char: '', romaji: '' }, { char: 'ユ', romaji: 'yu' }, { char: '', romaji: '' }, { char: 'ヨ', romaji: 'yo' },
            { char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' },
            { char: 'ワ', romaji: 'wa' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: 'ヲ', romaji: 'wo' },
            { char: 'ン', romaji: 'n' }
        ];

        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.setupUploadListeners();
            this.setupNavigation();
            this.setupModalListeners();
            this.updateStats();
            this.renderWords();
            this.renderKana();
        } catch (error) {
            this.showError('Failed to load Japanese words data');
        }
    }

    setupModalListeners() {
        const modal = document.getElementById('exampleModal');
        const modalClose = document.getElementById('modalClose');
        
        // Close modal on close button click
        modalClose.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Close modal on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('exampleModal');
        modal.classList.remove('active');
        // Stop any ongoing speech
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
    }

    async showExampleSentences(event, wordIndex) {
        // Prevent card click when clicking pronunciation button
        if (event.target.closest('.pronunciation-btn')) {
            return;
        }

        const word = this.filteredWords[wordIndex];
        const modal = document.getElementById('exampleModal');
        
        // Update modal header
        const displayText = word.kanji ? `${word.kanji} (${word.japanese})` : word.japanese;
        document.getElementById('modalJapanese').textContent = displayText;
        document.getElementById('modalRomaji').textContent = word.romaji;
        document.getElementById('modalMeaning').textContent = `🇮🇩 ${word.indonesian}`;
        
        // Show modal with loading state
        const container = document.getElementById('exampleSentencesContainer');
        container.innerHTML = '<div class="loading-examples"><div class="loading-spinner"></div>Loading example sentences...</div>';
        modal.classList.add('active');
        
        // Generate example sentences
        const examples = this.generateExampleSentences(word);
        
        // Render examples
        this.renderExampleSentences(examples);
    }

    generateExampleSentences(word) {
        // Common sentence patterns for Japanese
        const wordToUse = word.kanji || word.japanese;
        const examples = [];
        
        // Pattern 1: Basic sentence
        if (this.isNoun(word)) {
            examples.push({
                japanese: `これは${wordToUse}です。`,
                romaji: `Kore wa ${word.romaji} desu.`,
                indonesian: `Ini adalah ${word.indonesian}.`
            });
            examples.push({
                japanese: `${wordToUse}が好きです。`,
                romaji: `${this.capitalizeFirst(word.romaji)} ga suki desu.`,
                indonesian: `Saya suka ${word.indonesian}.`
            });
            examples.push({
                japanese: `${wordToUse}があります。`,
                romaji: `${this.capitalizeFirst(word.romaji)} ga arimasu.`,
                indonesian: `Ada ${word.indonesian}.`
            });
        } else if (this.isVerb(word)) {
            examples.push({
                japanese: `毎日${wordToUse}。`,
                romaji: `Mainichi ${word.romaji}.`,
                indonesian: `Setiap hari ${word.indonesian}.`
            });
            examples.push({
                japanese: `私は${wordToUse}たいです。`,
                romaji: `Watashi wa ${word.romaji}tai desu.`,
                indonesian: `Saya ingin ${word.indonesian}.`
            });
        } else if (this.isAdjective(word)) {
            examples.push({
                japanese: `とても${wordToUse}です。`,
                romaji: `Totemo ${word.romaji} desu.`,
                indonesian: `Sangat ${word.indonesian}.`
            });
            examples.push({
                japanese: `${wordToUse}人です。`,
                romaji: `${this.capitalizeFirst(word.romaji)} hito desu.`,
                indonesian: `Orang yang ${word.indonesian}.`
            });
        } else {
            // Generic examples
            examples.push({
                japanese: `${wordToUse}はとても便利です。`,
                romaji: `${this.capitalizeFirst(word.romaji)} wa totemo benri desu.`,
                indonesian: `${this.capitalizeFirst(word.indonesian)} sangat berguna.`
            });
            examples.push({
                japanese: `${wordToUse}について教えてください。`,
                romaji: `${this.capitalizeFirst(word.romaji)} ni tsuite oshiete kudasai.`,
                indonesian: `Tolong ajarkan tentang ${word.indonesian}.`
            });
        }
        
        return examples;
    }

    isNoun(word) {
        // Simple heuristic: check if indonesian translation doesn't start with verb/adjective indicators
        const indicators = ['me', 'ber', 'ter', 'di'];
        const firstWord = word.indonesian.toLowerCase().split(' ')[0];
        return !indicators.some(ind => firstWord.startsWith(ind));
    }

    isVerb(word) {
        const verbIndicators = ['me', 'ber', 'ter', 'di'];
        const firstWord = word.indonesian.toLowerCase().split(' ')[0];
        return verbIndicators.some(ind => firstWord.startsWith(ind));
    }

    isAdjective(word) {
        const adjIndicators = ['sangat', 'lebih', 'paling'];
        return adjIndicators.some(ind => word.indonesian.toLowerCase().includes(ind));
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    renderExampleSentences(examples) {
        const container = document.getElementById('exampleSentencesContainer');
        
        if (examples.length === 0) {
            container.innerHTML = '<div class="loading-examples">No example sentences available.</div>';
            return;
        }
        
        const html = examples.map((example, index) => `
            <div class="example-sentence">
                <div class="sentence-japanese">${this.escapeHtml(example.japanese)}</div>
                <div class="sentence-romaji">${this.escapeHtml(example.romaji)}</div>
                <div class="sentence-translation">${this.escapeHtml(example.indonesian)}</div>
                <button class="sentence-pronunciation-btn" onclick="window.viewer.speakWord('${this.escapeHtml(example.japanese)}', this)">
                    🔊 Listen
                </button>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }

    async loadData() {
        try {
            const response = await fetch('./japanese_words.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            this.words = await response.json();
            this.filteredWords = [...this.words];
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const viewId = item.dataset.view;
                this.switchView(viewId);
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Quiz Event Listeners
        document.querySelectorAll('.start-quiz-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.closest('.quiz-mode-card').dataset.mode;
                this.startQuiz(mode);
            });
        });

        document.getElementById('quitQuizBtn').addEventListener('click', () => {
            this.quitQuiz();
        });

        document.getElementById('nextQuestionBtn').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Typing mode event listeners
        document.getElementById('submitAnswerBtn').addEventListener('click', () => {
            this.submitTypingAnswer();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            document.getElementById('typingInput').value = '';
        });
    }

    switchView(viewId) {
        // Hide all views
        document.querySelectorAll('.view-section').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const viewMap = {
            'word-list': 'word-list-view',
            'hiragana': 'hiragana-view',
            'katakana': 'katakana-view',
            'quiz': 'quiz-view'
        };
        
        const targetId = viewMap[viewId];
        if (targetId) {
            document.getElementById(targetId).classList.add('active');
        }

        // Reset quiz view if switching away
        if (viewId !== 'quiz') {
            this.quitQuiz();
        }
    }

    // --- Quiz Logic ---

    startQuiz(mode) {
        this.quizState = {
            mode: mode,
            score: 0,
            currentQuestion: null,
            isAnswering: false,
            isTypingMode: mode.startsWith('typing-')
        };

        document.getElementById('quiz-menu').style.display = 'none';
        document.getElementById('quiz-game').style.display = 'block';
        document.getElementById('current-score').textContent = '0';
        
        // Show/hide appropriate UI elements
        if (this.quizState.isTypingMode) {
            document.getElementById('optionsGrid').style.display = 'none';
            document.getElementById('typingContainer').style.display = 'block';
            this.setupVirtualKeyboard(mode);
        } else {
            document.getElementById('optionsGrid').style.display = 'grid';
            document.getElementById('typingContainer').style.display = 'none';
        }
        
        this.nextQuestion();
    }

    quitQuiz() {
        document.getElementById('quiz-game').style.display = 'none';
        document.getElementById('quiz-menu').style.display = 'grid';
        this.quizState = null;
    }

    nextQuestion() {
        this.quizState.isAnswering = true;
        document.getElementById('quizFeedback').textContent = '';
        document.getElementById('nextQuestionBtn').style.display = 'none';
        
        // Clear typing input if in typing mode
        if (this.quizState.isTypingMode) {
            document.getElementById('typingInput').value = '';
        }
        
        let pool = [];
        let questionProp = 'char';
        let answerProp = 'romaji';

        const mode = this.quizState.mode.replace('typing-', '');

        if (mode === 'hiragana') {
            pool = this.hiraganaData.filter(item => item.char);
        } else if (mode === 'katakana') {
            pool = this.katakanaData.filter(item => item.char);
        } else if (mode === 'vocabulary') {
            pool = this.words;
            questionProp = 'japanese';
            answerProp = 'indonesian';
        } else if (mode === 'kanji') {
            pool = this.words.filter(word => word.kanji);
            questionProp = 'kanji';
            answerProp = 'indonesian';
        }

        if (pool.length < 4) {
            this.showError('Not enough data for quiz');
            return;
        }

        // Select random question
        const questionItem = pool[Math.floor(Math.random() * pool.length)];
        this.quizState.currentQuestion = questionItem;

        // Render Question based on mode
        if (this.quizState.isTypingMode) {
            // For typing mode, show the prompt
            let questionText = '';
            let subtextText = '';
            
            if (mode === 'hiragana' || mode === 'katakana') {
                questionText = questionItem.romaji;
                subtextText = `Type the ${mode} character`;
            } else if (mode === 'vocabulary') {
                if (questionItem.kanji) {
                    questionText = `${questionItem.kanji} (${questionItem.romaji})`;
                } else {
                    questionText = questionItem.romaji;
                }
                subtextText = `Indonesian: ${questionItem.indonesian}`;
            } else if (mode === 'kanji') {
                questionText = `${questionItem.japanese} (${questionItem.romaji})`;
                subtextText = `Indonesian: ${questionItem.indonesian} - Type the kanji`;
            }
            
            const questionTextEl = document.getElementById('questionText');
            questionTextEl.textContent = questionText;
            
            const questionSubtextEl = document.getElementById('questionSubtext');
            questionSubtextEl.textContent = subtextText;
            
            // Add pronunciation button for vocabulary and kanji typing quiz
            const questionCard = document.querySelector('.question-card');
            const existingBtn = questionCard.querySelector('.quiz-pronunciation-btn');
            if (existingBtn) existingBtn.remove();
            
            if (mode === 'vocabulary' || mode === 'kanji') {
                const pronunciationBtn = document.createElement('button');
                pronunciationBtn.className = 'quiz-pronunciation-btn';
                pronunciationBtn.innerHTML = '🔊';
                pronunciationBtn.title = 'Hear pronunciation';
                pronunciationBtn.onclick = () => {
                    const textToSpeak = questionItem.kanji || questionItem.japanese;
                    this.speakWord(textToSpeak, pronunciationBtn);
                };
                questionCard.style.position = 'relative';
                questionCard.appendChild(pronunciationBtn);
            }
        } else {
            // Multiple choice mode
            // Select 3 wrong options
            const options = [questionItem];
            while (options.length < 4) {
                const randomItem = pool[Math.floor(Math.random() * pool.length)];
                if (!options.includes(randomItem)) {
                    options.push(randomItem);
                }
            }

            // Shuffle options
            this.shuffleArray(options);

            // Render Question
            const displayQuestion = mode === 'vocabulary' && questionItem.kanji 
                ? `${questionItem.kanji} (${questionItem[questionProp]})` 
                : questionItem[questionProp];
            
            const questionTextEl = document.getElementById('questionText');
            questionTextEl.textContent = displayQuestion;
            
            const questionSubtextEl = document.getElementById('questionSubtext');
            questionSubtextEl.textContent = mode === 'vocabulary' ? questionItem.romaji : '';
            
            // Add pronunciation button for vocabulary quiz
            const questionCard = document.querySelector('.question-card');
            const existingBtn = questionCard.querySelector('.quiz-pronunciation-btn');
            if (existingBtn) existingBtn.remove();
            
            if (mode === 'vocabulary') {
                const pronunciationBtn = document.createElement('button');
                pronunciationBtn.className = 'quiz-pronunciation-btn';
                pronunciationBtn.innerHTML = '🔊';
                pronunciationBtn.title = 'Hear pronunciation';
                pronunciationBtn.onclick = () => {
                    const textToSpeak = questionItem.kanji || questionItem.japanese;
                    this.speakWord(textToSpeak, pronunciationBtn);
                };
                questionCard.style.position = 'relative';
                questionCard.appendChild(pronunciationBtn);
            }

            // Render Options
            const optionsGrid = document.getElementById('optionsGrid');
            optionsGrid.innerHTML = '';
            
            options.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option[answerProp];
                btn.onclick = () => this.handleAnswer(option, btn, answerProp);
                optionsGrid.appendChild(btn);
            });
        }
    }

    handleAnswer(selectedOption, btnElement, answerProp) {
        if (!this.quizState.isAnswering) return;
        this.quizState.isAnswering = false;

        const isCorrect = selectedOption === this.quizState.currentQuestion;
        const feedbackEl = document.getElementById('quizFeedback');
        const correctAnswer = this.quizState.currentQuestion[answerProp];

        // Disable all buttons after answer
        const allButtons = document.querySelectorAll('.option-btn');
        allButtons.forEach(btn => btn.style.pointerEvents = 'none');

        if (isCorrect) {
            this.quizState.score += 10;
            document.getElementById('current-score').textContent = this.quizState.score;
            btnElement.classList.add('correct');
            feedbackEl.textContent = 'Correct! 🎉';
            feedbackEl.style.color = '#2ecc71';
        } else {
            btnElement.classList.add('wrong');
            feedbackEl.textContent = `Wrong! The correct answer was "${correctAnswer}"`;
            feedbackEl.style.color = '#e74c3c';
            
            // Highlight correct answer in green
            allButtons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }

        // Show Next button
        document.getElementById('nextQuestionBtn').style.display = 'inline-block';
        
        // Re-enable buttons for next question
        setTimeout(() => {
            allButtons.forEach(btn => btn.style.pointerEvents = 'auto');
        }, 100);
    }

    setupVirtualKeyboard(mode) {
        const keyboardEl = document.getElementById('virtualKeyboard');
        let keys = [];

        // Standard Japanese keyboard layout (JIS)
        if (mode === 'typing-hiragana') {
            keys = [
                ['あ', 'い', 'う', 'え', 'お', 'や', 'ゆ', 'よ', 'わ', 'を'],
                ['か', 'き', 'く', 'け', 'こ', 'が', 'ぎ', 'ぐ', 'げ', 'ご'],
                ['さ', 'し', 'す', 'せ', 'そ', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
                ['た', 'ち', 'つ', 'て', 'と', 'だ', 'ぢ', 'づ', 'で', 'ど'],
                ['な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ'],
                ['ま', 'み', 'む', 'め', 'も', 'ば', 'び', 'ぶ', 'べ', 'ぼ'],
                ['ら', 'り', 'る', 'れ', 'ろ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
                ['ん', 'っ', 'ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'],
                ['ー', '⌫']
            ];
        } else if (mode === 'typing-katakana') {
            keys = [
                ['ア', 'イ', 'ウ', 'エ', 'オ', 'ヤ', 'ユ', 'ヨ', 'ワ', 'ヲ'],
                ['カ', 'キ', 'ク', 'ケ', 'コ', 'ガ', 'ギ', 'グ', 'ゲ', 'ゴ'],
                ['サ', 'シ', 'ス', 'セ', 'ソ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'],
                ['タ', 'チ', 'ツ', 'テ', 'ト', 'ダ', 'ヂ', 'ヅ', 'デ', 'ド'],
                ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
                ['マ', 'ミ', 'ム', 'メ', 'モ', 'バ', 'ビ', 'ブ', 'ベ', 'ボ'],
                ['ラ', 'リ', 'ル', 'レ', 'ロ', 'パ', 'ピ', 'プ', 'ペ', 'ポ'],
                ['ン', 'ッ', 'ャ', 'ュ', 'ョ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ'],
                ['ー', '⌫']
            ];
        } else if (mode === 'typing-vocabulary') {
            // Combined keyboard for vocabulary with full character set
            keys = [
                ['あ', 'い', 'う', 'え', 'お', 'や', 'ゆ', 'よ', 'わ', 'を', 'ん'],
                ['か', 'き', 'く', 'け', 'こ', 'が', 'ぎ', 'ぐ', 'げ', 'ご'],
                ['さ', 'し', 'す', 'せ', 'そ', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
                ['た', 'ち', 'つ', 'て', 'と', 'だ', 'ぢ', 'づ', 'で', 'ど'],
                ['な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ'],
                ['ま', 'み', 'む', 'め', 'も', 'ば', 'び', 'ぶ', 'べ', 'ぼ'],
                ['ら', 'り', 'る', 'れ', 'ろ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
                ['っ', 'ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ー', '⌫']
            ];
        } else if (mode === 'typing-kanji') {
            // Common kanji keyboard - organized by JLPT N5-N4 frequency
            keys = [
                ['日', '月', '火', '水', '木', '金', '土', '人', '本', '大', '小'],
                ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百'],
                ['上', '下', '中', '外', '内', '左', '右', '前', '後', '間', '東'],
                ['山', '川', '田', '林', '森', '石', '花', '草', '竹', '雨', '雪'],
                ['子', '女', '男', '父', '母', '手', '足', '目', '耳', '口', '心'],
                ['食', '飲', '見', '聞', '話', '読', '書', '学', '校', '生', '先'],
                ['車', '駅', '道', '行', '来', '出', '入', '門', '家', '店', '買'],
                ['私', '今', '時', '年', '何', '国', '語', '文', '長', '高', '⌫']
            ];
        }

        keyboardEl.innerHTML = keys.map(row => {
            const rowKeys = row.map(key => {
                if (!key) return '<div style="min-width: 50px;"></div>';
                const btnClass = key === '⌫' ? 'key-btn backspace-btn' : 'key-btn';
                return `<button class="${btnClass}" data-key="${key}">${key}</button>`;
            }).join('');
            return `<div class="keyboard-row">${rowKeys}</div>`;
        }).join('');

        // Add click handlers
        keyboardEl.querySelectorAll('.key-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                const input = document.getElementById('typingInput');
                
                if (key === '⌫') {
                    input.value = input.value.slice(0, -1);
                } else {
                    input.value += key;
                }
            });
        });
    }

    submitTypingAnswer() {
        if (!this.quizState.isAnswering) return;
        this.quizState.isAnswering = false;

        const userAnswer = document.getElementById('typingInput').value.trim();
        const mode = this.quizState.mode.replace('typing-', '');
        let correctAnswer;
        
        if (mode === 'kanji') {
            correctAnswer = this.quizState.currentQuestion.kanji;
        } else {
            correctAnswer = this.quizState.currentQuestion.char || this.quizState.currentQuestion.japanese;
        }
        
        const isCorrect = userAnswer === correctAnswer;
        const feedbackEl = document.getElementById('quizFeedback');

        if (isCorrect) {
            this.quizState.score += 10;
            document.getElementById('current-score').textContent = this.quizState.score;
            feedbackEl.textContent = '✅ Correct! ' + userAnswer;
            feedbackEl.style.color = '#2ecc71';
        } else {
            feedbackEl.textContent = `❌ Wrong! You typed: "${userAnswer}". Correct answer: "${correctAnswer}"`;
            feedbackEl.style.color = '#e74c3c';
        }

        // Show Next button
        document.getElementById('nextQuestionBtn').style.display = 'inline-block';
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    renderKana() {
        this.renderKanaGrid('hiragana-grid', this.hiraganaData);
        this.renderKanaGrid('katakana-grid', this.katakanaData);
    }

    renderKanaGrid(elementId, data) {
        const grid = document.getElementById(elementId);
        if (!grid) return;

        grid.innerHTML = data.map(item => {
            if (!item.char) return '<div class="kana-card" style="visibility: hidden;"></div>';
            return `
                <div class="kana-card" onclick="this.classList.toggle('flipped')">
                    <div class="kana-char">${item.char}</div>
                    <div class="kana-romaji">${item.romaji}</div>
                </div>
            `;
        }).join('');
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.filter);

                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    setupUploadListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');

        if (!uploadArea || !fileInput || !uploadBtn) return;

        // Button click
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        // File selection
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.uploadFile(file);
            }
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.uploadFile(files[0]);
            }
        });

        // Click on upload area
        uploadArea.addEventListener('click', (e) => {
            if (e.target !== uploadBtn) {
                fileInput.click();
            }
        });
    }

    async uploadFile(file) {
        // Validate file type
        if (!file.name.match(/\.(txt|md)$/i)) {
            this.showUploadStatus('Please upload a .txt or .md file', 'error');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            this.showUploadStatus('File size must be less than 10MB', 'error');
            return;
        }

        
        this.showUploadStatus(`Uploading ${file.name}...`, 'uploading');
        this.showProgress(true);

        try {
            // Check if server is running
            const statusResponse = await fetch(`${this.apiBase}/status`);
            if (!statusResponse.ok) {
                throw new Error('Server is not running. Please start the backend server with "npm run server"');
            }

            // Create form data
            const formData = new FormData();
            formData.append('file', file);

            // Upload file
            const response = await fetch(`${this.apiBase}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Upload failed');
            }

            const result = await response.json();

            // Update progress
            this.updateProgress(100, 'Processing complete!');

            // Update words data
            this.words = result.data.words;
            this.filteredWords = [...this.words];
            this.updateStats();
            this.renderWords();

            // Show success message with details
            const message = `✅ Successfully processed ${file.name}! Found ${result.data.totalWords} words, processed ${result.data.processedWords} with translations. ${result.data.message}`;

            this.showUploadStatus(message, 'success');

            // Hide progress after delay
            setTimeout(() => {
                this.showProgress(false);
            }, 3000);

        } catch (error) {
            console.error('Upload error:', error);
            this.showUploadStatus(`❌ ${error.message}`, 'error');
            this.showProgress(false);
        }

        // Reset file input
        document.getElementById('fileInput').value = '';
    }

    showUploadStatus(message, type = 'info') {
        const statusElement = document.getElementById('uploadStatus');
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = 'upload-status';

        if (type === 'error') {
            statusElement.style.color = '#e74c3c';
        } else if (type === 'success') {
            statusElement.style.color = '#27ae60';
        } else if (type === 'uploading') {
            statusElement.style.color = '#667eea';
        }
    }

    showProgress(show) {
        const progressElement = document.getElementById('uploadProgress');
        if (!progressElement) return;
        
        progressElement.style.display = show ? 'block' : 'none';

        if (show) {
            this.updateProgress(0, 'Starting upload...');
        }
    }

    updateProgress(percent, text) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressText) progressText.textContent = text;
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();

        if (!searchTerm) {
            this.filteredWords = this.words.filter(word =>
                this.currentFilter === 'all' || this.isWordType(word, this.currentFilter)
            );
        } else {
            this.filteredWords = this.words.filter(word => {
                const matchesSearch =
                    word.japanese.includes(searchTerm) ||
                    (word.kanji && word.kanji.includes(searchTerm)) ||
                    word.romaji.toLowerCase().includes(searchTerm) ||
                    word.indonesian.toLowerCase().includes(searchTerm);

                const matchesFilter =
                    this.currentFilter === 'all' ||
                    this.isWordType(word, this.currentFilter);

                return matchesSearch && matchesFilter;
            });
        }

        this.updateStats();
        this.renderWords();
    }

    handleFilter(filterType) {
        this.currentFilter = filterType;
        const searchInput = document.getElementById('searchInput');
        this.handleSearch(searchInput ? searchInput.value : '');
    }

    isWordType(word, type) {
        if (type === 'hiragana') {
            return /^[\u3040-\u309f]+$/.test(word.japanese) && !word.kanji;
        } else if (type === 'katakana') {
            return /^[\u30a0-\u30ff]+$/.test(word.japanese) && !word.kanji;
        } else if (type === 'kanji') {
            return word.kanji && word.kanji.length > 0;
        }
        return true;
    }

    updateStats() {
        const totalWordsEl = document.getElementById('totalWords');
        const filteredWordsEl = document.getElementById('filteredWords');
        const uniqueCharsEl = document.getElementById('uniqueChars');

        if (totalWordsEl) totalWordsEl.textContent = this.words.length;
        if (filteredWordsEl) filteredWordsEl.textContent = this.filteredWords.length;

        // Calculate unique characters
        if (uniqueCharsEl) {
            const uniqueChars = new Set();
            this.words.forEach(word => {
                word.japanese.split('').forEach(char => uniqueChars.add(char));
                if (word.kanji) {
                    word.kanji.split('').forEach(char => uniqueChars.add(char));
                }
            });
            uniqueCharsEl.textContent = uniqueChars.size;
        }
    }

    renderWords() {
        const content = document.getElementById('content');
        if (!content) return;

        if (this.filteredWords.length === 0) {
            content.innerHTML = '<div class="no-results">No words found matching your criteria</div>';
            return;
        }

        const wordsHTML = this.filteredWords.map(word => this.createWordCard(word)).join('');
        content.innerHTML = `<div class="words-container">${wordsHTML}</div>`;
    }

    createWordCard(word) {
        const displayText = word.kanji 
            ? `${word.kanji} (${word.japanese})` 
            : word.japanese;
        
        const wordIndex = this.filteredWords.indexOf(word);
        const wordData = JSON.stringify(word).replace(/"/g, '&quot;');
        
        return `
            <div class="word-card" onclick="window.viewer.showExampleSentences(event, ${wordIndex})">
                <div class="japanese-word">${this.escapeHtml(displayText)}</div>
                <div class="romaji">${this.escapeHtml(word.romaji)}</div>
                <div class="translations">
                    <div class="translation">
                        <span class="translation-label">🇮🇩 Indonesian:</span>
                        <span class="translation-text">${this.escapeHtml(word.indonesian)}</span>
                    </div>
                </div>
                <button class="pronunciation-btn" onclick="event.stopPropagation(); window.viewer.speakWord('${this.escapeHtml(word.japanese)}', this)">
                    🔊 Pronunciation
                </button>
            </div>
        `;
    }

    speakWord(text, button) {
        // Stop any ongoing speech
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
            if (this.currentUtterance && this.currentUtterance.button) {
                this.currentUtterance.button.classList.remove('speaking');
            }
        }

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        // Add button reference
        this.currentUtterance = { utterance, button };
        
        // Add visual feedback
        if (button) {
            button.classList.add('speaking');
            if (button.classList.contains('pronunciation-btn')) {
                button.textContent = '🔊 Speaking...';
            } else if (button.classList.contains('quiz-pronunciation-btn')) {
                button.innerHTML = '🔊';
            } else if (button.classList.contains('sentence-pronunciation-btn')) {
                button.textContent = '🔊 Speaking...';
            }
        }
        
        // Handle speech end
        utterance.onend = () => {
            if (button) {
                button.classList.remove('speaking');
                if (button.classList.contains('pronunciation-btn')) {
                    button.textContent = '🔊 Pronunciation';
                } else if (button.classList.contains('quiz-pronunciation-btn')) {
                    button.innerHTML = '🔊';
                } else if (button.classList.contains('sentence-pronunciation-btn')) {
                    button.textContent = '🔊 Listen';
                }
            }
            this.currentUtterance = null;
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            if (button) {
                button.classList.remove('speaking');
                if (button.classList.contains('pronunciation-btn')) {
                    button.textContent = '🔊 Pronunciation';
                } else if (button.classList.contains('quiz-pronunciation-btn')) {
                    button.innerHTML = '🔊';
                } else if (button.classList.contains('sentence-pronunciation-btn')) {
                    button.textContent = '🔊 Listen';
                }
            }
            this.currentUtterance = null;
        };
        
        this.speechSynthesis.speak(utterance);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = `<div class="error">${message}</div>`;
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.viewer = new JapaneseWordViewer();
});