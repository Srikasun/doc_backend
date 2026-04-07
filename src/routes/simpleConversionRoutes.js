/**
 * Simple Conversion Routes - Direct file upload for conversions
 * No MongoDB, no authentication - just simple conversions
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads with larger limits
const upload = multer({
  dest: 'uploads/temp/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// Import conversion services
const documentService = require('../services/documentService');
const pdfService = require('../services/pdfService');
const imageService = require('../services/imageService');
const videoService = require('../services/videoService');

/**
 * POST /api/simple-convert/docx-to-pdf
 * Convert DOCX to PDF - accepts file upload directly
 */
router.post('/docx-to-pdf', upload.single('file'), async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' },
      });
    }

    inputPath = req.file.path;
    console.log('📄 Converting DOCX to PDF:', req.file.originalname);

    // Convert DOCX to PDF
    const tempOutput = path.join('uploads/temp', `converted_${Date.now()}.pdf`);
    await documentService.docxToPdf(inputPath, tempOutput);
    outputPath = tempOutput;

    // Send the PDF file
    res.download(outputPath, req.file.originalname.replace(/\.(docx?|DOCX?)$/, '.pdf'), (err) => {
      // Cleanup files after download
      if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      
      if (err) {
        console.error('❌ Download error:', err);
      }
    });
  } catch (error) {
    console.error('❌ DOCX to PDF conversion failed:', error);
    
    // Cleanup on error
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'DOCX to PDF conversion failed',
        code: 'CONVERSION_ERROR',
      },
    });
  }
});

/**
 * POST /api/simple-convert/pptx-to-pdf
 * Convert PPTX to PDF - accepts file upload directly
 */
router.post('/pptx-to-pdf', upload.single('file'), async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' },
      });
    }

    inputPath = req.file.path;
    console.log('📄 Converting PPTX to PDF:', req.file.originalname);

    // Convert PPTX to PDF
    const tempOutput = path.join('uploads/temp', `converted_${Date.now()}.pdf`);
    await documentService.pptxToPdf(inputPath, tempOutput);
    outputPath = tempOutput;

    // Send the PDF file
    res.download(outputPath, req.file.originalname.replace(/\.(pptx?|PPTX?)$/, '.pdf'), (err) => {
      // Cleanup files after download
      if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      
      if (err) {
        console.error('❌ Download error:', err);
      }
    });
  } catch (error) {
    console.error('❌ PPTX to PDF conversion failed:', error);
    
    // Cleanup on error
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'PPTX to PDF conversion failed',
        code: 'CONVERSION_ERROR',
      },
    });
  }
});

/**
 * POST /api/simple-convert/pdf-to-docx
 * Convert PDF to DOCX - accepts file upload directly
 */
router.post('/pdf-to-docx', upload.single('file'), async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' },
      });
    }

    inputPath = req.file.path;
    console.log('📄 Converting PDF to DOCX:', req.file.originalname);

    // Convert PDF to DOCX
    const tempOutput = path.join('uploads/temp', `converted_${Date.now()}.docx`);
    await documentService.pdfToDocx(inputPath, tempOutput);
    outputPath = tempOutput;

    // Send the DOCX file
    res.download(outputPath, req.file.originalname.replace(/\.pdf$/i, '.docx'), (err) => {
      // Cleanup files after download
      if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      
      if (err) {
        console.error('❌ Download error:', err);
      }
    });
  } catch (error) {
    console.error('❌ PDF to DOCX conversion failed:', error);
    
    // Cleanup on error
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'PDF to DOCX conversion failed',
        code: 'CONVERSION_ERROR',
      },
    });
  }
});

/**
 * POST /api/simple-convert/pdf-to-pptx
 * Convert PDF to PPTX - accepts file upload directly
 */
router.post('/pdf-to-pptx', upload.single('file'), async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' },
      });
    }

    inputPath = req.file.path;
    console.log('📄 Converting PDF to PPTX:', req.file.originalname);

    // Convert PDF to PPTX
    const tempOutput = path.join('uploads/temp', `converted_${Date.now()}.pptx`);
    await documentService.pdfToPptx(inputPath, tempOutput);
    outputPath = tempOutput;

    // Send the PPTX file
    res.download(outputPath, req.file.originalname.replace(/\.pdf$/i, '.pptx'), (err) => {
      // Cleanup files after download
      if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      
      if (err) {
        console.error('❌ Download error:', err);
      }
    });
  } catch (error) {
    console.error('❌ PDF to PPTX conversion failed:', error);
    
    // Cleanup on error
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'PDF to PPTX conversion failed',
        code: 'CONVERSION_ERROR',
      },
    });
  }
});

/**
 * POST /api/simple-convert/pdf-compress
 * Compress PDF - accepts file upload directly
 */
router.post('/pdf-compress', upload.single('file'), async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' },
      });
    }

    // Ensure temp directory exists
    const tempDir = 'uploads/temp';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    inputPath = req.file.path;
    const quality = req.body?.quality || 'medium';
    console.log('📄 Compressing PDF:', req.file.originalname, `(quality: ${quality})`);

    const tempOutput = path.join(tempDir, `compressed_${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`);
    const compressionResult = await pdfService.compressPdf(inputPath, tempOutput, { quality });
    outputPath = tempOutput;

    console.log(`✅ Compression complete: ${compressionResult.originalSize} → ${compressionResult.compressedSize} bytes (${compressionResult.reduction}% reduction) using ${compressionResult.method}`);

    // Set response headers for file download
    const compressedFilename = req.file.originalname.replace(/\.pdf$/i, '_compressed.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${compressedFilename}"`);
    res.setHeader('Content-Length', compressionResult.compressedSize);
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Keep-Alive', 'timeout=5, max=100');

    // Use pipe to stream file to avoid buffering issues and connection resets
    const fileStream = fs.createReadStream(path.resolve(outputPath), { highWaterMark: 64 * 1024 });
    let streamEnded = false;

    fileStream.on('error', (err) => {
      console.error('❌ Stream read error:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: { message: 'Failed to read compressed file' } });
      } else if (!streamEnded) {
        res.end();
      }
    });

    res.on('finish', () => {
      streamEnded = true;
      // Cleanup files after sending
      if (inputPath && fs.existsSync(inputPath)) {
        try { fs.unlinkSync(inputPath); } catch (e) {}
      }
      if (outputPath && fs.existsSync(outputPath)) {
        try { fs.unlinkSync(outputPath); } catch (e) {}
      }
    });

    res.on('close', () => {
      streamEnded = true;
      // Cleanup if client closes early
      if (inputPath && fs.existsSync(inputPath)) {
        try { fs.unlinkSync(inputPath); } catch (e) {}
      }
      if (outputPath && fs.existsSync(outputPath)) {
        try { fs.unlinkSync(outputPath); } catch (e) {}
      }
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error('❌ PDF compression failed:', error.message);
    console.error('   Stack:', error.stack);

    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'PDF compression failed',
        code: 'COMPRESSION_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    });
  }
})

/**
 * POST /api/simple-convert/pdf-extract-images
 * Extract images from PDF - accepts file upload directly
 */
router.post('/pdf-extract-images', upload.single('file'), async (req, res) => {
  let inputPath = null;
  let imagePaths = [];

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' },
      });
    }

    inputPath = req.file.path;
    console.log('📄 Extracting images from PDF:', req.file.originalname);

    // Extract images from PDF
    const outputDir = 'uploads/temp';
    imagePaths = await pdfService.extractImages(inputPath, outputDir);

    if (imagePaths.length === 0) {
      return res.json({
        success: true,
        data: {
          images: [],
          count: 0,
          message: 'No images found in PDF',
        },
      });
    }

    // Return image paths (in production, you'd return URLs or base64)
    res.json({
      success: true,
      data: {
        images: imagePaths,
        count: imagePaths.length,
        message: `Extracted ${imagePaths.length} images`,
      },
    });

    // Cleanup input file
    if (inputPath && fs.existsSync(inputPath)) {
      setTimeout(() => fs.unlinkSync(inputPath), 5000); // Delay cleanup
    }
  } catch (error) {
    console.error('❌ PDF extract images failed:', error);
    
    // Cleanup on error
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    imagePaths.forEach(img => {
      if (fs.existsSync(img)) fs.unlinkSync(img);
    });

    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Failed to extract images from PDF',
        code: 'EXTRACTION_ERROR',
      },
    });
  }
});

/**
 * POST /api/simple-convert/image-compress
 * Compress image (JPG, PNG, WEBP, etc.) - accepts file upload directly
 */
router.post('/image-compress', upload.single('file'), async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' },
      });
    }

    inputPath = req.file.path;
    const quality = Number(req.body?.quality || 60); // 0-100
    const maxWidth = Number(req.body?.maxWidth || 1920);
    const maxHeight = Number(req.body?.maxHeight || 1080);
    
    console.log('🖼️ Compressing image:', req.file.originalname);

    const tempOutput = path.join('uploads/temp', `compressed_${Date.now()}.jpg`);
    
    // Resize and compress image
    const result = await imageService.resize(inputPath, {
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      format: 'jpeg',
      quality,
    });

    outputPath = result;

    // Get file sizes for response
    const originalStats = await require('fs').promises.stat(inputPath);
    const compressedStats = await require('fs').promises.stat(outputPath);

    res.download(outputPath, req.file.originalname.replace(/\.[^.]+$/, '_compressed.jpg'), (err) => {
      if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

      if (err) {
        console.error('❌ Download error:', err);
      }
    });
  } catch (error) {
    console.error('❌ Image compression failed:', error);

    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Image compression failed',
        code: 'COMPRESSION_ERROR',
      },
    });
  }
});

/**
 * POST /api/simple-convert/video-compress
 * Compress video - accepts file upload directly
 * Note: Requires ffmpeg to be installed on server
 */
router.post('/video-compress', upload.single('file'), async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' },
      });
    }

    // Check if FFmpeg is available first
    const ffmpegAvailable = await videoService.isFFmpegAvailable();
    if (!ffmpegAvailable) {
      return res.status(503).json({
        success: false,
        error: {
          message: 'FFmpeg not installed on server. Cannot process video compression.',
          code: 'FFMPEG_NOT_AVAILABLE',
          requirement: 'Install ffmpeg: apt-get install -y ffmpeg ffprobe',
          localTesting: 'Install FFmpeg locally: https://ffmpeg.org/download.html',
        },
      });
    }

    inputPath = req.file.path;
    const quality = req.body?.quality || 'medium'; // 'low', 'medium', 'high'
    
    console.log('🎥 Compressing video:', req.file.originalname, 'with quality:', quality);

    const tempOutput = path.join('uploads/temp', `compressed_${Date.now()}.mp4`);

    // Compress video using FFmpeg
    const result = await videoService.compressVideo(inputPath, tempOutput, { quality });

    outputPath = result.path;

    // Send the compressed video file
    res.download(outputPath, req.file.originalname.replace(/\.[^.]+$/, '_compressed.mp4'), (err) => {
      if (inputPath && fs.existsSync(inputPath)) {
        try { fs.unlinkSync(inputPath); } catch (_) {}
      }
      if (outputPath && fs.existsSync(outputPath)) {
        try { fs.unlinkSync(outputPath); } catch (_) {}
      }

      if (err) {
        console.error('❌ Download error:', err);
      }
    });
  } catch (error) {
    console.error('❌ Video compression failed:', error);

    if (inputPath && fs.existsSync(inputPath)) {
      try { fs.unlinkSync(inputPath); } catch (_) {}
    }
    if (outputPath && fs.existsSync(outputPath)) {
      try { fs.unlinkSync(outputPath); } catch (_) {}
    }

    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Video compression failed',
        code: 'COMPRESSION_ERROR',
      },
    });
  }
});

/**
 * GET /api/simple-convert/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Simple conversion service is running',
    features: [
      'DOCX → PDF',
      'PPTX → PDF',
      'PDF → DOCX',
      'PDF → PPTX',
      'PDF → Compress',
      'PDF → Extract Images',
      'Image → Compress',
      'Video → Compress',
    ],
  });
});

/**
 * GET /api/simple-convert/diagnostics
 * Diagnostics endpoint to check tool availability and temp directory
 */
router.get('/diagnostics', async (req, res) => {
  try {
    const { execFile } = require('child_process');
    const { promisify } = require('util');
    const execFileAsync = promisify(execFile);
    const fsSync = require('fs');
    const path = require('path');

    // Check Ghostscript
    let gsStatus = { available: false, binary: null, version: null };
    for (const binary of ['gs', 'ghostscript', 'gswin64c']) {
      try {
        const { stdout } = await execFileAsync(binary, ['-version']);
        gsStatus = { 
          available: true, 
          binary,
          version: stdout.split('\n')[0],
        };
        break;
      } catch (_) {}
    }

    // Check FFmpeg
    let ffmpegStatus = { available: false, version: null };
    try {
      const { stdout } = await execFileAsync('ffmpeg', ['-version']);
      ffmpegStatus = { 
        available: true,
        version: stdout.split('\n')[0],
      };
    } catch (_) {}

    // Check temp directory
    const tempDir = 'uploads/temp';
    const tempExists = fsSync.existsSync(tempDir);
    let tempWritable = false;
    if (tempExists) {
      try {
        const testFile = path.join(tempDir, `.test_${Date.now()}`);
        fsSync.writeFileSync(testFile, 'test');
        fsSync.unlinkSync(testFile);
        tempWritable = true;
      } catch (_) {}
    }

    res.json({
      success: true,
      diagnostics: {
        ghostscript: gsStatus,
        ffmpeg: ffmpegStatus,
        tempDirectory: {
          path: tempDir,
          exists: tempExists,
          writable: tempWritable,
        },
        nodejs: {
          version: process.version,
          platform: process.platform,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Diagnostics check failed',
        details: error.message,
      },
    });
  }
});

module.exports = router;
