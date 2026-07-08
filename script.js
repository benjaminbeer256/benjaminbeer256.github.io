// Load the base image (save the attachment as "mattcan.png" in the same folder)
const IMG_SRC = 'mattcan.png';

const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('nameInput');
const updateBtn = document.getElementById('updateBtn');

let img = new Image();
let imgLoaded = false;

img.onload = () => {
  imgLoaded = true;
  resizeCanvasToImage();
  draw();
};
img.onerror = () => {
  // If image isn't found, show a simple placeholder message
  const w = 700, h = 450;
  canvas.width = w; canvas.height = h;
  ctx.fillStyle = '#ddd'; ctx.fillRect(0,0,w,h);
  ctx.fillStyle = '#444'; ctx.font = '20px Arial';
  ctx.fillText('Please save the attached image as "mattcan.png" in this folder', 16, 40);
};
img.src = IMG_SRC;

function resizeCanvasToImage(){
  // Target height is 75% of the viewport height
  const targetH = Math.max(50, Math.floor(window.innerHeight * 0.75));
  // Start with scale based on target height
  let scale = targetH / img.height;
  let w = Math.floor(img.width * scale);
  const containerWidth = document.querySelector('.canvas-wrap').clientWidth;
  // if the resulting width is wider than the container, scale down to fit container
  if (w > containerWidth) {
    scale = containerWidth / img.width;
    w = Math.floor(img.width * scale);
  }
  canvas.width = w;
  canvas.height = Math.floor(img.height * scale);
}

function draw(){
  if(!imgLoaded) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const baseText = 'MATT\nCAN';
  const userText = input.value.trim() || 'ME';

  const fontSize = Math.max(12, Math.floor(canvas.height * 0.04));
  ctx.font = `${fontSize}px Impact, Haettenschweiler, 'Arial Black', sans-serif`;
  ctx.textBaseline = 'middle';

  ctx.fillStyle = 'white';
  ctx.lineWidth = Math.max(3, Math.floor(fontSize * 0.12));
  ctx.strokeStyle = 'black';

  const xBase = Math.floor(canvas.width * 0.3);
  const y = Math.floor(canvas.height * 0.55);
  const lineHeight = fontSize * 1.2; 

  // 1. Draw Base Text
  ctx.textAlign = 'left'; // Reset to left for manual centering calculations
  const lines = baseText.split('\n');
  const lineWidths = lines.map(line => ctx.measureText(line).width);
  const maxLineWidth = Math.max(...lineWidths);

  lines.forEach((line, index) => {
    const currentY = y + (index * lineHeight);
    const xOffset = (maxLineWidth - lineWidths[index]) / 2;
    const currentX = xBase + xOffset;

    ctx.strokeText(line, currentX, currentY);
    ctx.fillText(line, currentX, currentY);
  });

  // 2. Format and Draw User Text
  ctx.textAlign = 'center'; // Forces text to expand left and right from the coordinate
  
  // Center point is 3 font sizes from the right edge of base text
  const xUser = xBase + maxLineWidth + (fontSize * 2.7);

  // Measure approximate width of 6 characters
  const maxUserWidth = ctx.measureText('W'.repeat(6)).width;
  const words = userText.split(' ');
  const userLines = [];
  let currentLine = '';

  // Wrap logic
  words.forEach(word => {
    // Force split if a single word is excessively long
    if (ctx.measureText(word).width > maxUserWidth) {
      const chunks = word.match(/.{1,6}/g) || [];
      chunks.forEach(chunk => {
        if (currentLine) { 
          userLines.push(currentLine.trim()); 
          currentLine = ''; 
        }
        userLines.push(chunk);
      });
    } else {
      const testLine = currentLine + word + ' ';
      if (ctx.measureText(testLine).width > maxUserWidth && currentLine) {
        userLines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    }
  });
  if (currentLine) userLines.push(currentLine.trim());

  // Draw wrapped user text lines
  userLines.forEach((line, index) => {
    const currentY = y + (index * lineHeight);
    ctx.strokeText(line, xUser, currentY);
    ctx.fillText(line, xUser, currentY);
  });
}

updateBtn.addEventListener('click', (e) => {
  e.preventDefault();
  draw();
});

// keep canvas responsive on resize but only redraw when image is loaded
window.addEventListener('resize', () => {
  if(!imgLoaded) return;
  resizeCanvasToImage();
  draw();
});
