import QRCode from 'qrcode';

interface QRCodeOptions {
  text: string;
  // Legacy options
  fgColor?: string;
  bgColor?: string;
  gradient?: {
    start: string;
    end: string;
  };
  logo?: 'whatsapp' | 'none';
  
  // New unified options from DB
  qr_options?: any;
}

export async function generateCustomQRCode(options: QRCodeOptions): Promise<string> {
  const { text, qr_options } = options;

  // Resolve design state
  let colorMode = 'solid';
  let fgColor1 = options.fgColor || '#6c47ff';
  let fgColor2 = '#ec4899';
  let bgColor = options.bgColor || '#ffffff';
  let isTransparentBg = false;
  let logoMode = options.logo === 'none' ? 'none' : 'center';

  if (options.gradient) {
    colorMode = 'gradient';
    fgColor1 = options.gradient.start;
    fgColor2 = options.gradient.end;
  }

  if (qr_options) {
    if (qr_options.colorMode) colorMode = qr_options.colorMode;
    if (qr_options.fgColor1) fgColor1 = qr_options.fgColor1;
    if (qr_options.fgColor2) fgColor2 = qr_options.fgColor2;
    if (qr_options.bgColor) bgColor = qr_options.bgColor;
    if (typeof qr_options.isTransparentBg === 'boolean') isTransparentBg = qr_options.isTransparentBg;
    if (qr_options.logoMode) logoMode = qr_options.logoMode;
  }

  const qrData = QRCode.create(text, { errorCorrectionLevel: 'H' });
  const modules = qrData.modules;
  const gridSize = modules.size;
  const marginCells = 2;
  const totalCells = gridSize + marginCells * 2;
  const centerMin = Math.floor(gridSize * 0.38);
  const centerMax = Math.ceil(gridSize * 0.62);

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalCells} ${totalCells}" width="100%" height="100%">\n`;

  if (colorMode === 'gradient') {
    svgContent += `  <defs>\n    <linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%">\n      <stop offset="0%" stop-color="${fgColor1}" />\n      <stop offset="100%" stop-color="${fgColor2}" />\n    </linearGradient>\n  </defs>\n`;
  }

  if (!isTransparentBg) {
    svgContent += `  <rect width="${totalCells}" height="${totalCells}" fill="${bgColor}" rx="2" ry="2" />\n`;
  }

  const fillAttr = colorMode === 'gradient' ? 'url(#qrGrad)' : fgColor1;

  let paths = '';
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!modules.get(x, y)) continue;
      if (logoMode === 'center' && x >= centerMin && x <= centerMax && y >= centerMin && y <= centerMax) {
        continue;
      }
      paths += `  <rect x="${x + marginCells}" y="${y + marginCells}" width="1.05" height="1.05" rx="0.3" fill="${fillAttr}" />\n`;
    }
  }
  
  svgContent += paths;

  if (logoMode === 'center') {
    const cx = totalCells / 2;
    const cy = totalCells / 2;
    const logoBgColor = isTransparentBg ? '#ffffff' : bgColor;
    svgContent += `  <circle cx="${cx}" cy="${cy}" r="${(gridSize * 0.26) / 2}" fill="${logoBgColor}" />\n`;
    svgContent += `  <circle cx="${cx}" cy="${cy}" r="${(gridSize * 0.22) / 2}" fill="${fgColor1}" />\n`;
  }

  svgContent += `</svg>`;

  return svgContent;
}
