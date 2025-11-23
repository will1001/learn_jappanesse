const JapaneseParser = require('./japaneseParser');
const fs = require('fs');

async function main() {
  console.log('🌸 Japanese Text Parser - AI Powered Translation & Romaji');
  console.log('=' .repeat(60));

  // Check if API key is set
  const config = require('./config');
  if (config.OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY') {
    console.log('❌ Error: Please set your OpenRouter API key in src/config.js');
    console.log('   Get your API key from: https://openrouter.ai/keys');
    process.exit(1);
  }

  // Check if input.txt exists
  if (!fs.existsSync('./input.txt')) {
    console.log('❌ Error: input.txt file not found in the current directory');
    process.exit(1);
  }

  const parser = new JapaneseParser();
  try {
    const results = await parser.parseAndProcess();

    console.log('\n🎉 Processing completed!');
    console.log(`📊 Total words processed: ${results.length}`);
    console.log('\n📂 Files created:');
    console.log('   - japanese_words.json (Word data)');
    console.log('\n🌐 To view the GUI, run: npm run dev');

  } catch (error) {
    console.error('❌ Error during processing:', error);
    process.exit(1);
  }
}

// Run the parser
main();