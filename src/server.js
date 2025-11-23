const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const JapaneseParser = require('./japaneseParser');

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept text files
    if (file.mimetype === 'text/plain' ||
        file.originalname.endsWith('.txt') ||
        file.originalname.endsWith('.md')) {
      cb(null, true);
    } else {
      cb(new Error('Only text files (.txt, .md) are allowed'), false);
    }
  }
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Japanese Text Parser API',
    version: '1.0.0',
    endpoints: {
      'POST /api/upload': 'Upload and parse a text file',
      'GET /api/status': 'Get server status'
    }
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// File upload and parsing endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a text file to upload'
      });
    }

    const filePath = req.file.path;
    const filename = req.file.originalname;

    console.log(`📁 Processing uploaded file: ${filename}`);

    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');

    // Create parser and process content
    const parser = new JapaneseParser();

    // Process all file content with batch processing (no limits)
    console.log('🚀 Starting batch processing - no word limits');
    const result = await parser.parseFromContent(content, filename);

    // Save new words to JSON file (skipping duplicates automatically)
    console.log('💾 Saving processed words to database...');
    const addedCount = parser.appendWordsToJson(result.words);

    // Update result message with storage info
    if (addedCount > 0) {
      result.message = `${result.message} Added ${addedCount} new words to database.`;
    } else {
      result.message = `${result.message} No new words added (all already exist in database).`;
    }
    result.addedToDatabase = addedCount;

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    console.log(`✅ Processing completed: ${result.processedWords} words processed, ${addedCount} words added to database`);

    res.json({
      success: true,
      data: result,
      message: result.message
    });

  } catch (error) {
    console.error('Error processing upload:', error);

    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Processing failed',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Maximum file size is 10MB'
      });
    }
  }

  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong while processing your request'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Japanese Text Parser API Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload endpoint: POST http://localhost:${PORT}/api/upload`);
  console.log(`🔍 Status endpoint: GET http://localhost:${PORT}/api/status`);
});

module.exports = app;