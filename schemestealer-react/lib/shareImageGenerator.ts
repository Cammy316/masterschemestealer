interface GenerateShareImageOptions {
  mode: 'miniature' | 'inspiration';
  data: {
    colors: Array<{
      hex: string;
      name: string;
      percentage: number;
    }>;
    imageUrl?: string;
    paints?: Array<{
      name: string;
      brand: string;
      hex: string;
    }>;
  };
  size: 'instagram' | 'hd';
}

export async function generateShareImage(options: GenerateShareImageOptions): Promise<string> {
  const { mode, data, size } = options;

  // Canvas dimensions
  const dimensions = size === 'instagram'
    ? { width: 1080, height: 1080 }
    : { width: 1920, height: 1080 };

  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  if (mode === 'miniature') {
    await drawMiniscanShareImage(ctx, canvas, data);
  } else {
    await drawInspirationShareImage(ctx, canvas, data);
  }

  // Add watermark
  addWatermark(ctx, canvas.width, canvas.height);

  return canvas.toDataURL('image/png');
}

async function drawMiniscanShareImage(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  data: any
) {
  const width = canvas.width;
  const height = canvas.height;

  // Background - dark Imperial theme
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);

  // Border with corner brackets
  ctx.strokeStyle = '#00FF66';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Draw corner brackets
  drawCornerBrackets(ctx, 40, 40, width - 80, height - 80, '#00FF66', 40);

  // Split view - Image on left, Results on right
  const splitX = width / 2;

  // Left side - Miniature image (if available)
  if (data.imageUrl) {
    try {
      const img = await loadImage(data.imageUrl);
      const imgHeight = height - 80;
      const imgWidth = splitX - 60;
      const imgX = 60;
      const imgY = 60;

      // Draw with aspect ratio preservation
      const aspectRatio = img.width / img.height;
      let drawWidth = imgWidth;
      let drawHeight = imgHeight;

      if (aspectRatio > 1) {
        drawHeight = drawWidth / aspectRatio;
      } else {
        drawWidth = drawHeight * aspectRatio;
      }

      const offsetX = imgX + (imgWidth - drawWidth) / 2;
      const offsetY = imgY + (imgHeight - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  }

  // Vertical divider
  ctx.strokeStyle = '#00FF66';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(splitX, 60);
  ctx.lineTo(splitX, height - 60);
  ctx.stroke();

  // Right side - Color swatches and info
  const rightX = splitX + 40;
  let currentY = 100;

  // Title
  ctx.fillStyle = '#00FF66';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('SCAN COMPLETE', rightX, currentY);

  currentY += 60;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '24px sans-serif';
  ctx.fillText(`${data.colors.length} Colors Detected`, rightX, currentY);

  currentY += 80;

  // Color swatches
  const swatchSize = 80;
  const swatchGap = 20;

  data.colors.slice(0, 5).forEach((color: any) => {
    // Swatch
    ctx.fillStyle = color.hex;
    ctx.fillRect(rightX, currentY, swatchSize, swatchSize);

    // Border
    ctx.strokeStyle = '#00FF66';
    ctx.lineWidth = 2;
    ctx.strokeRect(rightX, currentY, swatchSize, swatchSize);

    // Color info
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(color.name || 'Color', rightX + swatchSize + 20, currentY + 30);

    ctx.font = '18px monospace';
    ctx.fillStyle = '#00FF66';
    ctx.fillText(color.hex, rightX + swatchSize + 20, currentY + 55);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#888888';
    ctx.fillText(`${color.percentage.toFixed(1)}%`, rightX + swatchSize + 20, currentY + 75);

    currentY += swatchSize + swatchGap;
  });
}

async function drawInspirationShareImage(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  data: any
) {
  const width = canvas.width;
  const height = canvas.height;

  // Background - dark Warp theme with gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#1a0a2e');
  gradient.addColorStop(1, '#0a0a1a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Split view - Image on left, Palette on right
  const splitX = width / 2;

  // Left side - Source image (if available)
  if (data.imageUrl) {
    try {
      const img = await loadImage(data.imageUrl);
      const imgHeight = height - 80;
      const imgWidth = splitX - 60;
      const imgX = 60;
      const imgY = 60;

      // Draw with aspect ratio preservation
      const aspectRatio = img.width / img.height;
      let drawWidth = imgWidth;
      let drawHeight = imgHeight;

      if (aspectRatio > 1) {
        drawHeight = drawWidth / aspectRatio;
      } else {
        drawWidth = drawHeight * aspectRatio;
      }

      const offsetX = imgX + (imgWidth - drawWidth) / 2;
      const offsetY = imgY + (imgHeight - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  }

  // Vertical divider with glow
  const dividerGradient = ctx.createLinearGradient(splitX - 50, 0, splitX + 50, 0);
  dividerGradient.addColorStop(0, 'transparent');
  dividerGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.5)');
  dividerGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = dividerGradient;
  ctx.fillRect(splitX - 2, 60, 4, height - 120);

  // Right side - Color palette
  const rightX = splitX + 40;
  let currentY = 100;

  // Title
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('EXTRACTED ESSENCE', rightX, currentY);

  currentY += 80;

  // Color swatches (larger, stacked vertically)
  const swatchWidth = width - splitX - 120;
  const swatchHeight = 100;
  const swatchGap = 20;

  data.colors.slice(0, 6).forEach((color: any) => {
    // Swatch with glow
    ctx.shadowBlur = 30;
    ctx.shadowColor = color.hex;
    ctx.fillStyle = color.hex;
    ctx.fillRect(rightX, currentY, swatchWidth, swatchHeight);
    ctx.shadowBlur = 0;

    // Subtle inner border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(rightX, currentY, swatchWidth, swatchHeight);

    // Color info overlay (on swatch)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(rightX, currentY + swatchHeight - 35, swatchWidth, 35);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(color.name || 'Color', rightX + 15, currentY + swatchHeight - 10);

    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#c084fc';
    ctx.textAlign = 'right';
    ctx.fillText(color.hex, rightX + swatchWidth - 15, currentY + swatchHeight - 10);

    currentY += swatchHeight + swatchGap;
  });
}

function drawCornerBrackets(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  size: number
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(x + size, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + size);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(x + width - size, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + size);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x, y + height - size);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x + size, y + height);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x + width, y + height - size);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x + width - size, y + height);
  ctx.stroke();
}

function addWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('SCHEMESTEALER', width - 20, height - 20);
  ctx.restore();
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
