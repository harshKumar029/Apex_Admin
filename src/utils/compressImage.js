// src/utils/compressImage.js

import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file to ensure it's below the specified size.
 *
 * @param {File} imageFile - The original image file to compress.
 * @param {number} maxSizeKB - The maximum allowed size in kilobytes.
 * @returns {Promise<File>} - A promise that resolves to the compressed image file.
 */
export const compressImage = async (imageFile, maxSizeKB = 150) => {
  // Use more aggressive compression settings to ensure the final size is below 150KB.
  const options = {
    maxSizeMB: maxSizeKB / 1024, // Convert KB to MB
    maxWidthOrHeight: 600, // Reduce dimensions to speed up and ensure smaller file size
    useWebWorker: true,
    initialQuality: 0.6, // Lower initial quality for more compression
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error;
  }
};
