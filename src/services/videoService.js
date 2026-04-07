/**
 * Video Processing Service
 * Uses FFmpeg for video compression and manipulation
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { promisify } = require('util');
const { execFile } = require('child_process');
const { getTempPath } = require('../utils/tempPath');
const AppError = require('../utils/AppError');

const execFileAsync = promisify(execFile);

class VideoService {
  /**
   * Check if FFmpeg is available
   * @returns {Promise<boolean>}
   */
  async isFFmpegAvailable() {
    try {
      const ffmpegCandidates = process.platform === 'win32'
        ? ['ffmpeg.exe', 'ffmpeg']
        : ['ffmpeg'];

      for (const binary of ffmpegCandidates) {
        try {
          await execFileAsync(binary, ['-version']);
          console.log(`✅ FFmpeg found: ${binary}`);
          return true;
        } catch (_) {
          // Try next
        }
      }
      return false;
    } catch (error) {
      console.error('❌ FFmpeg check failed:', error.message);
      return false;
    }
  }

  /**
   * Get video information (duration, resolution, codec)
   * @param {string} videoPath - Path to video file
   * @returns {Promise<Object>} Video info
   */
  async getVideoInfo(videoPath) {
    try {
      const { stdout } = await execFileAsync('ffprobe', [
        '-v', 'error',
        '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height,r_frame_rate,duration',
        '-of', 'default=noprint_wrappers=1:nokey=1:noescaping=1',
        videoPath,
      ]);

      const info = stdout.trim().split('\n');
      return {
        width: parseInt(info[0]),
        height: parseInt(info[1]),
        fps: info[2],
        duration: parseFloat(info[3]),
      };
    } catch (error) {
      console.warn('⚠️ Could not get video info:', error.message);
      return null;
    }
  }

  /**
   * Compress video using FFmpeg
   * @param {string} inputPath - Path to input video
   * @param {string} outputPath - Path to output video
   * @param {Object} options - Compression options
   * @returns {Promise<{path: string, originalSize: number, compressedSize: number, reduction: number}>}
   */
  async compressVideo(inputPath, outputPath, options = {}) {
    let output = null;

    try {
      const { quality = 'medium' } = options;

      // Validate input file exists
      if (!fsSync.existsSync(inputPath)) {
        throw new Error(`Input video file not found: ${inputPath}`);
      }

      const originalStats = await fs.stat(inputPath);
      console.log(`📹 Video size before compression: ${this._formatFileSize(originalStats.size)}`);

      // Quality presets
      const qualityPresets = {
        low: {
          crf: 28,
          preset: 'fast',
          resolution: '854x480',
          bitrate: '500k',
          maxrate: '600k',
          bufsize: '1200k',
        },
        medium: {
          crf: 23,
          preset: 'medium',
          resolution: '1280x720',
          bitrate: '1000k',
          maxrate: '1200k',
          bufsize: '2400k',
        },
        high: {
          crf: 18,
          preset: 'slow',
          resolution: '1920x1080',
          bitrate: '2500k',
          maxrate: '3000k',
          bufsize: '6000k',
        },
      };

      const preset = qualityPresets[quality] || qualityPresets.medium;

      console.log(`🎬 Starting video compression with ${quality} quality preset`);
      console.log(`   CRF: ${preset.crf}, Preset: ${preset.preset}, Resolution: ${preset.resolution}`);

      // Build FFmpeg command
      const ffmpegArgs = [
        '-i', inputPath,
        '-c:v', 'libx264',
        '-preset', preset.preset,
        '-crf', preset.crf.toString(),
        '-vf', `scale=${preset.resolution}:force_original_aspect_ratio=decrease,pad=${preset.resolution}:0:0`,
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        '-y', // Overwrite output file
        outputPath,
      ];

      // Execute FFmpeg
      await execFileAsync('ffmpeg', ffmpegArgs);

      // Verify output file exists
      if (!fsSync.existsSync(outputPath)) {
        throw new Error('FFmpeg did not create output file');
      }

      const compressedStats = await fs.stat(outputPath);
      const reduction = Math.round((1 - compressedStats.size / originalStats.size) * 100);

      console.log(`✅ Video compression completed`);
      console.log(`   Compressed size: ${this._formatFileSize(compressedStats.size)}`);
      console.log(`   Reduction: ${reduction}%`);

      return {
        path: outputPath,
        originalSize: originalStats.size,
        compressedSize: compressedStats.size,
        reduction,
        method: 'ffmpeg:libx264',
      };
    } catch (error) {
      // Cleanup output on error
      if (output && fsSync.existsSync(output)) {
        try {
          fsSync.unlinkSync(output);
        } catch (_) {}
      }

      console.error('❌ Video compression error:', error.message);
      throw AppError.internal(`Video compression failed: ${error.message}`);
    }
  }

  /**
   * Convert video to different format
   * @param {string} inputPath - Source video path
   * @param {string} format - Target format (mp4, webm, mkv, etc.)
   * @param {Object} options - Conversion options
   * @returns {Promise<string>} Output file path
   */
  async convertFormat(inputPath, format, options = {}) {
    try {
      const { quality = 'medium' } = options;
      const outputPath = getTempPath(`.${format}`);

      const qualityMap = {
        low: 28,
        medium: 23,
        high: 18,
      };
      const crf = qualityMap[quality] || 23;

      const codec = format === 'webm' ? 'libvpx-vp9' : 'libx264';
      const audioCodec = format === 'webm' ? 'libopus' : 'aac';

      await execFileAsync('ffmpeg', [
        '-i', inputPath,
        '-c:v', codec,
        '-crf', crf.toString(),
        '-c:a', audioCodec,
        '-y',
        outputPath,
      ]);

      return outputPath;
    } catch (error) {
      throw AppError.internal(`Video format conversion failed: ${error.message}`);
    }
  }

  /**
   * Extract thumbnail from video
   * @param {string} videoPath - Path to video
   * @param {Object} options - Thumbnail options (time, width, height)
   * @returns {Promise<string>} Path to thumbnail image
   */
  async extractThumbnail(videoPath, options = {}) {
    try {
      const { time = '00:00:01', width = 320, height = 240 } = options;
      const outputPath = getTempPath('.jpg');

      await execFileAsync('ffmpeg', [
        '-i', videoPath,
        '-ss', time,
        '-vframes', '1',
        '-vf', `scale=${width}:${height}`,
        '-y',
        outputPath,
      ]);

      return outputPath;
    } catch (error) {
      throw AppError.internal(`Thumbnail extraction failed: ${error.message}`);
    }
  }

  /**
   * Format file size for display
   * @private
   */
  _formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

module.exports = new VideoService();
