const fs = require('fs');
const axios = require('axios');
const config = require('./config');

class JapaneseParser {
  constructor() {
    this.processedWords = new Set();
    this.existingWords = new Set();
    this.loadExistingWords();
  }

  // Load existing words from JSON file to avoid duplicates
  loadExistingWords() {
    try {
      const fs = require('fs');
      if (fs.existsSync('./japanese_words.json')) {
        const existingData = JSON.parse(fs.readFileSync('./japanese_words.json', 'utf8'));
        existingData.forEach(item => {
          if (item.japanese) {
            this.existingWords.add(item.japanese);
          }
        });
        console.log(`📚 Loaded ${this.existingWords.size} existing words from japanese_words.json`);
      }
    } catch (error) {
      console.log('⚠️  Could not load existing words:', error.message);
    }
  }

  // Append new words to JSON file
  appendWordsToJson(newWords) {
    try {
      const fs = require('fs');
      let existingData = [];

      // Read existing data if file exists
      if (fs.existsSync('./japanese_words.json')) {
        existingData = JSON.parse(fs.readFileSync('./japanese_words.json', 'utf8'));
      }

      // Filter out duplicates and append new words
      const newJapaneseWords = new Set(existingData.map(item => item.japanese));
      const trulyNewWords = newWords.filter(word => !newJapaneseWords.has(word.japanese));

      if (trulyNewWords.length > 0) {
        const updatedData = [...existingData, ...trulyNewWords];
        fs.writeFileSync('./japanese_words.json', JSON.stringify(updatedData, null, 2), 'utf8');
        console.log(`✅ Added ${trulyNewWords.length} new words to japanese_words.json`);
        console.log(`📊 Total words in database: ${updatedData.length}`);

        // Update existing words set
        trulyNewWords.forEach(word => this.existingWords.add(word.japanese));
      } else {
        console.log('ℹ️  No new words to add - all words already exist in database');
      }

      return trulyNewWords.length;
    } catch (error) {
      console.error('❌ Error appending words to JSON:', error.message);
      return 0;
    }
  }

  // Fungsi untuk extract Japanese text dari file input.txt
  extractJapaneseText(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Regex untuk mengidentifikasi karakter Japanese
      const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g;
      const matches = content.match(japaneseRegex) || [];

      return matches;
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  // Fungsi untuk extract kata-kata individual menggunakan AI dengan deduplication
  async extractWordsWithAI(textArray) {
    const allText = textArray.join('\n');
    const batchSize = 1000; // Process in chunks to avoid token limits
    const allWords = new Set();

    // Split text into batches
    const batches = [];
    for (let i = 0; i < allText.length; i += batchSize) {
      batches.push(allText.slice(i, i + batchSize));
    }

    console.log(`Processing ${batches.length} batches with AI...`);

    for (let i = 0; i < batches.length; i++) {
      console.log(`Processing batch ${i + 1}/${batches.length}`);

      const words = await this.extractWordsFromBatch(batches[i]);
      words.forEach(word => allWords.add(word));

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Filter out existing words
    const wordsArray = Array.from(allWords);
    const newWords = wordsArray.filter(word => !this.existingWords.has(word));

    console.log(`📊 Total words extracted: ${wordsArray.length}`);
    console.log(`📚 Existing words skipped: ${wordsArray.length - newWords.length}`);
    console.log(`🆕 New words to process: ${newWords.length}`);

    return newWords.sort();
  }

  // Fungsi untuk extract kanji dan kana
  extractKanjiAndKana(text) {
    const kanjiRegex = /[\u4e00-\u9faf]+/g;
    const kanaRegex = /[\u3040-\u309f\u30a0-\u30ff]+/g;
    
    const kanjis = text.match(kanjiRegex);
    const kanas = text.match(kanaRegex);
    
    return {
      kanji: kanjis ? kanjis.join('') : '',
      kana: kanas ? kanas.join('') : text
    };
  }

  // Fungsi untuk extract kata dari satu batch menggunakan AI (DeepSeek)
  async extractWordsFromBatch(text) {
    try {
      const response = await axios.post(
        `${config.OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: config.EXTRACT_MODEL,
          messages: [
            {
              role: 'system',
              content: `Extract all unique Japanese words from the input. Return ONLY a JSON array.

Requirements:
- Extract Japanese words only (Hiragana, Katakana, Kanji)
- Remove duplicates
- Return ONLY: ["word1", "word2", "word3"]
- No explanation, no extra text, just the JSON array

Example input: "こんにちは、みなさん！今日はいい天気ですね。"
Example output: ["こんにちは", "みなさん", "今日", "は", "いい", "天気", "ですね"]`
            },
            {
              role: 'user',
              content: `Extract all unique words from this input in array output format:\n\n${text}`
            }
          ]
        },
        {
          headers: {
            ...config.OPENROUTER_HEADERS,
            'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      console.log('🤖 AI Response:', aiResponse);

      // Try multiple parsing strategies
      let words = [];

      // Strategy 1: Try to parse direct JSON array
      try {
        const directParse = JSON.parse(aiResponse);
        if (Array.isArray(directParse)) {
          words = directParse;
        }
      } catch (e) {
        // Strategy 2: Extract JSON array from text
        const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          try {
            words = JSON.parse(jsonMatch[0]);
          } catch (e2) {
            console.log('⚠️  JSON parsing failed, trying regex extraction');
          }
        }

        // Strategy 3: Parse comma-separated or space-separated words
        if (words.length === 0) {
          // Remove brackets and quotes if present
          let cleanedResponse = aiResponse
            .replace(/[\[\]]/g, '')
            .replace(/"/g, '')
            .trim();

          // Split by common separators
          words = cleanedResponse
            .split(/[,、\s]+/)
            .map(word => word.trim())
            .filter(word => word.length > 0);
        }
      }

      // Filter and validate words
      const validWords = words.filter(word =>
        word &&
        typeof word === 'string' &&
        word.length > 0 &&
        /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(word)
      );

      console.log(`📝 Extracted ${validWords.length} valid words from AI response`);

      if (validWords.length > 0) {
        return [...new Set(validWords)].sort(); // Remove duplicates and sort
      }

      // Fallback: extract with regex if AI parsing fails
      console.log('⚠️  AI extraction failed, using regex fallback');
      return this.extractWordsWithRegex(text);
    } catch (error) {
      console.error('Error extracting words with AI:', error.message);
      // Fallback to regex extraction
      return this.extractWordsWithRegex(text);
    }
  }

  // Fallback method using regex
  extractWordsWithRegex(text) {
    const words = text.match(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g) || [];
    const uniqueWords = [...new Set(words)];

    // Filter out very short words (1 character particles unless they're significant)
    return uniqueWords.filter(word =>
      word.length > 1 ||
      ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'や', 'も', 'の'].includes(word)
    ).sort();
  }

  // Batch processing untuk memanggil OpenRouter API dengan multiple words sekaligus
  async callAIBatch(words) {
    if (words.length === 0) return [];

    console.log(`🚀 Processing batch of ${words.length} words with OpenRouter API...`);

    try {
      const response = await axios.post(
        `${config.OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: config.TRANSLATE_MODEL,
          messages: [
            {
              role: 'system',
              content: `You are a Japanese language expert. For each Japanese word provided, respond with a JSON array containing multiple objects. Each object must have: 1) "japanese" (hiragana/katakana reading only), 2) "kanji" (kanji characters if any, empty string if none), 3) "romaji" (pronunciation), 4) "indonesian" (translation).

Format: [{"japanese": "hiragana/katakana", "kanji": "kanji_if_any", "romaji": "pronunciation", "indonesian": "translation"}]

Examples:
- Input: "今日" -> {"japanese": "きょう", "kanji": "今日", "romaji": "kyou", "indonesian": "hari ini"}
- Input: "こんにちは" -> {"japanese": "こんにちは", "kanji": "", "romaji": "konnichiwa", "indonesian": "selamat siang"}

Process ALL words provided and return them in the same order.`
            },
            {
              role: 'user',
              content: `Please provide information for these Japanese words (return as JSON array): ${words.join(', ')}`
            }
          ]
        },
        {
          headers: {
            ...config.OPENROUTER_HEADERS,
            'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;

      // Parse JSON array dari response
      const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        const results = JSON.parse(jsonMatch[0]);

        // Validasi dan transform hasil
        if (Array.isArray(results) && results.length === words.length) {
          const transformedResults = results.map(item => {
            // Jika AI tidak memberikan format baru, extract manual
            if (!item.kanji) {
              const extracted = this.extractKanjiAndKana(item.japanese || '');
              return {
                japanese: extracted.kana || item.japanese,
                kanji: extracted.kanji || '',
                romaji: item.romaji,
                indonesian: item.indonesian
              };
            }
            return {
              japanese: item.japanese,
              kanji: item.kanji || '',
              romaji: item.romaji,
              indonesian: item.indonesian
            };
          });
          
          console.log(`✅ Successfully processed ${transformedResults.length} words in batch`);
          return transformedResults;
        }
      }

      // Fallback: process individually jika batch gagal
      console.log('⚠️  Batch processing failed, falling back to individual processing...');
      return await this.processWordsIndividually(words);

    } catch (error) {
      console.error('Error in batch processing:', error.message);
      // Fallback: process individually
      return await this.processWordsIndividually(words);
    }
  }

  // Fallback untuk individual processing
  async processWordsIndividually(words) {
    const results = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      console.log(`Processing individually ${i + 1}/${words.length}: ${word}`);

      try {
        const result = await this.callAI(word);
        results.push(result);
      } catch (error) {
        console.error(`Error processing word "${word}":`, error.message);
        // Add fallback result with kanji extraction
        const extracted = this.extractKanjiAndKana(word);
        results.push({
          japanese: extracted.kana || word,
          kanji: extracted.kanji || '',
          romaji: 'unknown',
          indonesian: 'unknown'
        });
      }

      // Delay untuk rate limit
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }

  // Fungsi untuk memanggil OpenRouter API (single word - untuk fallback)
  async callAI(word) {
    try {
      const response = await axios.post(
        `${config.OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: config.TRANSLATE_MODEL,
          messages: [
            {
              role: 'system',
              content: `You are a Japanese language expert. For each Japanese word provided, respond with a JSON object containing: 1) "japanese" (hiragana/katakana reading only), 2) "kanji" (kanji characters if any, empty string if none), 3) "romaji" (pronunciation), 4) "indonesian" (translation).

Format: {"japanese": "hiragana/katakana", "kanji": "kanji_if_any", "romaji": "pronunciation", "indonesian": "translation"}

Examples:
- Input: "今日" -> {"japanese": "きょう", "kanji": "今日", "romaji": "kyou", "indonesian": "hari ini"}
- Input: "こんにちは" -> {"japanese": "こんにちは", "kanji": "", "romaji": "konnichiwa", "indonesian": "selamat siang"}`
            },
            {
              role: 'user',
              content: `Please provide information for this Japanese word: ${word}`
            }
          ]
        },
        {
          headers: {
            ...config.OPENROUTER_HEADERS,
            'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;

      // Parse JSON dari response
      const jsonMatch = aiResponse.match(/\{[^}]+\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Jika AI tidak memberikan format baru, extract manual
        if (!parsed.kanji) {
          const extracted = this.extractKanjiAndKana(parsed.japanese || word);
          return {
            japanese: extracted.kana || parsed.japanese || word,
            kanji: extracted.kanji || '',
            romaji: parsed.romaji || 'unknown',
            indonesian: parsed.indonesian || 'unknown'
          };
        }
        
        return {
          japanese: parsed.japanese || word,
          kanji: parsed.kanji || '',
          romaji: parsed.romaji || 'unknown',
          indonesian: parsed.indonesian || 'unknown'
        };
      }

      // Fallback jika parsing gagal
      const extracted = this.extractKanjiAndKana(word);
      return {
        japanese: extracted.kana || word,
        kanji: extracted.kanji || '',
        romaji: 'unknown',
        indonesian: 'unknown'
      };
    } catch (error) {
      console.error(`Error processing word "${word}":`, error.message);
      const extracted = this.extractKanjiAndKana(word);
      return {
        japanese: extracted.kana || word,
        kanji: extracted.kanji || '',
        romaji: 'unknown',
        indonesian: 'unknown'
      };
    }
  }

  // Fungsi utama untuk parsing dan processing dengan AI dengan deduplication dan batch processing
  async parseAndProcess(filePath = './input.txt') {
    console.log(`🔍 Extracting Japanese text from ${filePath}...`);
    const japaneseTexts = this.extractJapaneseText(filePath);
    console.log(`Found ${japaneseTexts.length} Japanese text segments`);

    console.log('🤖 Extracting words using AI...');
    const words = await this.extractWordsWithAI(japaneseTexts);

    if (words.length === 0) {
      console.log('ℹ️  No new words to process - all words already exist in database');
      return [];
    }

    console.log(`📝 Processing ${words.length} new words with AI for translations using batch processing...`);
    const results = await this.processWordsInBatches(words);

    console.log('💾 Appending new results to JSON file...');
    const addedCount = this.appendWordsToJson(results);

    if (addedCount > 0) {
      console.log(`✅ Successfully added ${addedCount} new words to japanese_words.json`);
    } else {
      console.log('ℹ️  No new words were added to the database');
    }

    return results;
  }

  // Process words in batches untuk optimasi API calls
  async processWordsInBatches(words, batchSize = 20) {
    const allResults = [];

    console.log(`🚀 Starting batch processing with ${Math.ceil(words.length / batchSize)} batches...`);

    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(words.length / batchSize);

      console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} words)...`);

      const batchResults = await this.callAIBatch(batch);
      allResults.push(...batchResults);

      // Delay antar batch untuk menghindari rate limit
      if (i + batchSize < words.length) {
        console.log('⏳ Waiting before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`✅ Completed batch processing. Total processed: ${allResults.length} words`);
    return allResults;
  }

  // Fungsi untuk parsing dari content string (untuk file upload) dengan batch processing
  async parseFromContent(content, filename = 'uploaded_file.txt') {
    console.log(`🔍 Processing uploaded file: ${filename}`);

    // Extract Japanese text from content
    const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g;
    const japaneseTexts = content.match(japaneseRegex) || [];
    console.log(`Found ${japaneseTexts.length} Japanese text segments`);

    // Extract words using AI
    console.log('🤖 Extracting words using AI...');
    const words = await this.extractWordsWithAI(japaneseTexts);
    console.log(`Found ${words.length} unique Japanese words`);

    if (words.length === 0) {
      return {
        words: [],
        totalWords: 0,
        processedWords: 0,
        filename: filename,
        message: 'No new Japanese words found in the uploaded file.'
      };
    }

    console.log(`📝 Processing all ${words.length} words with AI for translations using batch processing...`);
    const results = await this.processWordsInBatches(words);

    return {
      words: results,
      totalWords: words.length,
      processedWords: results.length,
      filename: filename,
      message: `Successfully processed all ${words.length} words using batch processing.`
    };
  }
}

module.exports = JapaneseParser;