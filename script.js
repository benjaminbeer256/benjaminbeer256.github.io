// Load the base image; embedded data URI avoids file:// security issues
const IMG_SRC = typeof EMBEDDED_IMG_SRC !== 'undefined' ? EMBEDDED_IMG_SRC : 'mattcan.jpg';

const preview = document.getElementById('memePreview');
const input = document.getElementById('nameInput');
const updateBtn = document.getElementById('updateBtn');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let img = new Image();
let imgLoaded = false;
let lastSize = { width: 0, height: 0 };

img.onload = () => {
  imgLoaded = true;
  preview.alt = 'Generated meme preview';
  resizeCanvasToImage();
  draw();
};
img.onerror = () => {
  // if image isn't found, show a simple placeholder image
  preview.alt = 'Please save mattcan.png in this folder';
  preview.style.background = '#eee';
  preview.style.width = '100%';
  preview.style.height = '280px';
  preview.src = '';
};

preview.src = IMG_SRC;
img.src = IMG_SRC;

function resizeCanvasToImage(){
  const containerWidth = document.querySelector('.canvas-wrap').clientWidth;
  const maxHeight = Math.max(50, Math.floor(window.innerHeight * 0.75));
  const nativeWidth = img.naturalWidth || img.width;
  const nativeHeight = img.naturalHeight || img.height;
  const scale = Math.min(1, containerWidth / nativeWidth, maxHeight / nativeHeight);

  const targetWidth = Math.round(nativeWidth * scale);
  const targetHeight = Math.round(nativeHeight * scale);

  const dpr = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = Math.floor(targetWidth * dpr);
  canvas.height = Math.floor(targetHeight * dpr);
  canvas.style.width = `${targetWidth}px`;
  canvas.style.height = `${targetHeight}px`;

  preview.width = targetWidth;
  preview.height = targetHeight;
  preview.style.width = `${targetWidth}px`;
  preview.style.height = `${targetHeight}px`;

  lastSize = { width: targetWidth, height: targetHeight, dpr, scale };
}

function draw(){
  if (!imgLoaded) return;

  if (lastSize.width === 0 || lastSize.height === 0) {
    resizeCanvasToImage();
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, lastSize.width * lastSize.dpr, lastSize.height * lastSize.dpr);
  ctx.scale(lastSize.dpr, lastSize.dpr);
  ctx.drawImage(img, 0, 0, lastSize.width, lastSize.height);

  const overlayText = (input.value.trim() || 'me').toUpperCase();

  const fontSize = Math.max(12, Math.floor(lastSize.height * 0.03));
  ctx.font = `${fontSize}px Impact, Haettenschweiler, 'Arial Black', sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = Math.max(3, Math.floor(fontSize * 0.12));

  const xCenter = lastSize.width / 2 + lastSize.width * 0.24;
  const yBase = Math.floor(lastSize.height * 0.56);
  const lineHeight = fontSize * 1.1;

  const words = overlayText.split(' ');
  const wrappedLines = [];
  let currentLine = '';
  const maxLineWidth = lastSize.width * 0.7;

  words.forEach((word) => {
    const wordText = word;
    if (wordText.length > 6) {
      const broken = wordText.match(/.{1,6}/g) || [wordText];
      broken.forEach((chunk) => {
        if (currentLine) {
          wrappedLines.push(currentLine.trim());
          currentLine = '';
        }
        wrappedLines.push(chunk);
      });
      return;
    }

    const testLine = currentLine ? `${currentLine} ${wordText}` : wordText;
    if (ctx.measureText(testLine).width > maxLineWidth && currentLine) {
      wrappedLines.push(currentLine.trim());
      currentLine = wordText;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) wrappedLines.push(currentLine.trim());

  let currentY = yBase - ((wrappedLines.length - 1) * lineHeight) / 2;
  wrappedLines.forEach((line) => {
    ctx.strokeText(line, xCenter, currentY);
    ctx.fillText(line, xCenter, currentY);
    currentY += lineHeight;
  });

  try {
    preview.src = canvas.toDataURL('image/png');
  } catch (error) {
    console.warn('Canvas export blocked by browser security:', error);
    preview.src = img.src;
  }
}

updateBtn.addEventListener('click', (e) => {
  e.preventDefault();
  draw();
});

window.addEventListener('resize', () => {
  if (!imgLoaded) return;
  resizeCanvasToImage();
  draw();
});
