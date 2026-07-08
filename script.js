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
  // draw base image
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // draw "MATT CAN" (kept as default style) and the user name next to it
  const baseText = 'MATT\nCAN';
  const userText = input.value.trim() || 'ME';

  // font sizing relative to canvas height so text scales with image height
  const fontSize = Math.max(12, Math.floor(canvas.height * 0.04));
  const font = `${fontSize}px Impact, Haettenschweiler, 'Arial Black', sans-serif`;
  ctx.font = font;
  ctx.textBaseline = 'middle';

  // white fill with black stroke to emulate Impact meme text
  ctx.fillStyle = 'white';
  ctx.lineWidth = Math.max(3, Math.floor(fontSize * 0.12));
  ctx.strokeStyle = 'black';

  // approximate positions tuned to sit on the characters' chests
  const xBase = Math.floor(canvas.width * 0.12);
  const y = Math.floor(canvas.height * 0.60);

  // draw base "MATT CAN"
  ctx.strokeText(baseText, xBase, y);
  ctx.fillText(baseText, xBase, y);

  // draw user text a bit to the right of baseText
  const baseWidth = ctx.measureText(baseText).width;
  const gap = Math.max(8, Math.floor(fontSize * 0.3));
  const xUser = xBase + baseWidth + gap;

  ctx.strokeText(userText, xUser, y);
  ctx.fillText(userText, xUser, y);
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
