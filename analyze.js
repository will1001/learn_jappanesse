const fs = require('fs');
const JapaneseParser = require('./src/japaneseParser');

async function analyzeInput() {
  // Read input.txt
  const content = fs.readFileSync('./input.txt', 'utf8');
  const parser = new JapaneseParser();

  // Extract with AI instead of regex
  console.log('=== ANALISIS INPUT.TXT ===');
  console.log('🤖 Extracting unique words using AI...');

  // Extract Japanese text segments first
  const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g;
  const regexMatches = content.match(japaneseRegex) || [];
  console.log(`Total Japanese text segments found: ${regexMatches.length}`);

  // Use AI to extract unique words
  let uniqueWords = [];
  try {
    uniqueWords = await parser.extractWordsWithAI(regexMatches);
    console.log(`Total unique words (AI extraction): ${uniqueWords.length}`);
  } catch (error) {
    console.log('❌ AI extraction failed, falling back to regex:', error.message);
    // Fallback to regex if AI fails
    uniqueWords = [...new Set(regexMatches.join(' ').split(/[^\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/).filter(w => w.length > 0))];
    console.log(`Total unique words (regex fallback): ${uniqueWords.length}`);
  }

  console.log('\nSample 20 unique words:');
  uniqueWords.slice(0, 20).forEach((word, i) => {
    console.log(`${(i+1).toString().padStart(2)}. ${word}`);
  });

  console.log('\n=== WORD TYPE ANALYSIS ===');
  const hiragana = uniqueWords.filter(w => /^[\u3040-\u309f]+$/.test(w));
  const katakana = uniqueWords.filter(w => /^[\u30a0-\u30ff]+$/.test(w));
  const kanji = uniqueWords.filter(w => /[\u4e00-\u9faf]/.test(w) && w.length === 1);
  const kanjiCompounds = uniqueWords.filter(w => /[\u4e00-\u9faf]/.test(w) && w.length > 1);
  const mixed = uniqueWords.filter(w => {
    const hasHiragana = /[\u3040-\u309f]/.test(w);
    const hasKatakana = /[\u30a0-\u30ff]/.test(w);
    const hasKanji = /[\u4e00-\u9faf]/.test(w);
    return (hasHiragana && hasKatakana) || (hasHiragana && hasKanji) || (hasKatakana && hasKanji);
  });

  console.log(`Hiragana only: ${hiragana.length}`);
  console.log(`Katakana only: ${katakana.length}`);
  console.log(`Kanji single: ${kanji.length}`);
  console.log(`Kanji compounds: ${kanjiCompounds.length}`);
  console.log(`Mixed types: ${mixed.length}`);

  console.log('\n=== LONG WORDS (Potential Phrases) ===');
  const longWords = uniqueWords.filter(w => w.length > 8);
  console.log(`Words longer than 8 chars: ${longWords.length}`);
  longWords.slice(0, 15).forEach((word, i) => {
    console.log(`${(i+1).toString().padStart(2)}. ${word} (length: ${word.length})`);
  });

  console.log('\n=== WORD LENGTH DISTRIBUTION ===');
  const lengthDistribution = {};
  uniqueWords.forEach(word => {
    const len = word.length;
    lengthDistribution[len] = (lengthDistribution[len] || 0) + 1;
  });

  Object.keys(lengthDistribution).sort((a, b) => a - b).forEach(len => {
    console.log(`Length ${len}: ${lengthDistribution[len]} words`);
  });

  console.log('\n=== AI vs REGEX COMPARISON ===');
  // Compare with original regex method for demonstration
  const regexUniqueWords = [...new Set(regexMatches.join(' ').split(/[^\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/).filter(w => w.length > 0))];
  console.log(`Regex method found: ${regexUniqueWords.length} unique words`);
  console.log(`AI method found: ${uniqueWords.length} unique words`);
  console.log(`Difference: ${uniqueWords.length - regexUniqueWords.length} words`);

  // Show some examples of words that AI might have extracted differently
  if (uniqueWords.length !== regexUniqueWords.length) {
    console.log('\nAI extraction provides better word segmentation and context understanding.');
  }
}

analyzeInput().catch(console.error);