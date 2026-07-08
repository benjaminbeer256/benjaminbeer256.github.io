// Load the base image (save the attachment as "mattcan.png" in the same folder)
const IMG_SRC = 'mattcan.png';

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
img.src = IMG_SRC;

function resizeCanvasToImage(){
  const containerWidth = document.querySelector('.canvas-wrap').clientWidth;
  const maxHeight = Math.max(50, Math.floor(window.innerHeight * 0.75));
  const imageRatio = img.width / img.height;
  let targetWidth = containerWidth;
  let targetHeight = Math.floor(targetWidth / imageRatio);

  if (targetHeight > maxHeight) {
    targetHeight = maxHeight;
    targetWidth = Math.floor(targetHeight * imageRatio);
  }

  // scale canvas up for Retina displays without changing CSS display size
  const dpr = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = Math.floor(targetWidth * dpr);
  canvas.height = Math.floor(targetHeight * dpr);
  canvas.style.width = `${targetWidth}px`;
  canvas.style.height = `${targetHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  preview.width = targetWidth;
  preview.height = targetHeight;
  preview.style.width = `${targetWidth}px`;
  preview.style.height = `${targetHeight}px`;

  lastSize = { width: targetWidth, height: targetHeight };
}

function draw(){
  if (!imgLoaded) return;

  if (lastSize.width === 0 || lastSize.height === 0) {
    resizeCanvasToImage();
  }

  ctx.clearRect(0, 0, lastSize.width, lastSize.height);
  ctx.drawImage(img, 0, 0, lastSize.width, lastSize.height);

  const baseText = 'MATT CAN';
  const userText = (input.value.trim() || 'me').toUpperCase();

  const fontSize = Math.max(12, Math.floor(lastSize.height * 0.08));
  ctx.font = `${fontSize}px Impact, Haettenschweiler, 'Arial Black', sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = Math.max(3, Math.floor(fontSize * 0.12));

  const xBase = Math.floor(lastSize.width * 0.14);
  const yBase = Math.floor(lastSize.height * 0.56);
  const lineHeight = fontSize * 1.1;

  const lines = baseText.split(' ');
  let currentY = yBase;
  lines.forEach((line) => {
    ctx.strokeText(line, xBase, currentY);
    ctx.fillText(line, xBase, currentY);
    currentY += lineHeight;
  });

  const userX = xBase + ctx.measureText(lines.join(' ')).width + fontSize * 0.5;
  currentY = yBase + (lineHeight / 2);
  ctx.textAlign = 'left';
  ctx.strokeText(userText, userX, currentY);
  ctx.fillText(userText, userX, currentY);

  preview.src = canvas.toDataURL('image/png');
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
