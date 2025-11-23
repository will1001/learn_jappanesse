#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌸 Japanese Text Parser - Setup');
console.log('=' .repeat(40));

// Check if config.js exists
if (fs.existsSync('./src/config.js')) {
  console.log('⚠️  Config file already exists.');
  rl.question('Do you want to update the API key? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      setupApiKey();
    } else {
      console.log('✅ Setup completed. You can run "npm start" to parse text.');
      rl.close();
    }
  });
} else {
  setupApiKey();
}

function setupApiKey() {
  console.log('\n📝 Getting OpenRouter API Key');
  console.log('1. Visit https://openrouter.ai/keys');
  console.log('2. Sign up or login');
  console.log('3. Generate a new API key');
  console.log('4. Copy the API key\n');

  rl.question('Enter your OpenRouter API Key: ', (apiKey) => {
    if (!apiKey || apiKey.trim() === '') {
      console.log('❌ API Key is required!');
      rl.close();
      return;
    }

    // Create config.js file
    const configContent = `// Configuration untuk API OpenRouter
const config = {
  // Ganti dengan API key Anda dari OpenRouter
  OPENROUTER_API_KEY: '${apiKey.trim()}',

  // Model yang akan digunakan
  MODEL: 'openai/gpt-4o-mini',

  // Base URL untuk OpenRouter API
  BASE_URL: 'https://openrouter.ai/api/v1',

  // Headers untuk API request
  HEADERS: {
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://localhost:3000',
    'X-Title': 'Japanese Text Parser'
  }
};

module.exports = config;
`;

    fs.writeFileSync('./src/config.js', configContent);
    console.log('✅ API Key saved to src/config.js');

    // Create .env file for additional security
    const envContent = `# OpenRouter API Configuration
OPENROUTER_API_KEY=${apiKey.trim()}

# Model Configuration
MODEL=openai/gpt-4o-mini
`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ Environment file created (.env)');

    console.log('\n🎉 Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure input.txt contains Japanese text');
    console.log('2. Run: npm start     (to parse text)');
    console.log('3. Run: npm run dev   (to view GUI)');
    console.log('\n📖 For more info, read README.md');

    rl.close();
  });
}