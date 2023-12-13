let canvas;
let ctx;
let x = 0;
document.addEventListener('DOMContentLoaded', function() {
  canvas = document.getElementById('mycanvas');
  if (!canvas) {
    console.error("Canvas element with ID 'canvas' not found.");
    return;
  }

  canvas.width = 600;
  canvas.height = 500;

  ctx = canvas.getContext('2d');
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
});

function tatuoClick() {
  angry.play();
}

function draw() {
  console.log("on draw");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(x+=10, 50, 100, 100);
}

// angry変数を定義
const angry = new Audio('./asset/audio/choo_heart.wav');
