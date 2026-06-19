/**
 * Client-side image utilities (canvas-based resize / re-encode).
 *
 * Shared by the API layer (compression before upload) and the miniature
 * background-removal preprocess (resize the original before running the model,
 * and shrink an oversized bg-removed PNG).
 */

export type ImageFormat = 'image/jpeg' | 'image/png';

/**
 * Resize an image to fit within `maxDimension` on its longest side and encode it
 * as `format`. PNG output preserves the alpha channel; JPEG flattens it. Returns
 * the original file unchanged when it's already within bounds AND already in the
 * requested format (avoids a needless re-encode).
 */
export async function resizeImage(
  file: File,
  maxDimension = 1024,
  format: ImageFormat = 'image/jpeg',
  quality = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const { naturalWidth: w, naturalHeight: h } = img;
      const scale = Math.min(1, maxDimension / Math.max(w, h));

      // Already small enough and already the right format → keep as-is.
      if (scale === 1 && file.type === format) {
        resolve(file);
        return;
      }

      const targetW = Math.max(1, Math.round(w * scale));
      const targetH = Math.max(1, Math.round(h * scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file); // canvas unavailable — fall back to the original
        return;
      }
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const ext = format === 'image/png' ? 'png' : 'jpg';
      const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext;

      canvas.toBlob(
        (blob) => resolve(blob ? new File([blob], name, { type: format }) : file),
        format,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for resizing'));
    };

    img.src = url;
  });
}

/**
 * Compress an image to JPEG, capped at `maxDimension` px on the longest side.
 * Convenience wrapper over resizeImage for the upload path.
 */
export async function compressImage(file: File, maxDimension = 1024, quality = 0.85): Promise<File> {
  return resizeImage(file, maxDimension, 'image/jpeg', quality);
}
