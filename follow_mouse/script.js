"use strict";

const { PI, cos, sin, abs } = Math;
const HALF_PI = 0.5 * PI;
const TAU = 2 * PI;
const TO_RAD = PI / 180;
const fadeInOut = (t, m) => {
  let hm = 0.5 * m;
  return abs((t + hm) % m - hm) / hm;
};

let canvas;
let ctx;
let circles;
let origin;
let tick;

function setup() {
  canvas = {
    a: document.createElement('canvas'),
    b: document.createElement('canvas') };

  ctx = {
    a: canvas.a.getContext('2d'),
    b: canvas.b.getContext('2d') };

  canvas.b.style = `
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	`;
  document.body.appendChild(canvas.b);

  circles = [];
  origin = { x: 0, y: 0 };
  tick = 0;
  resize();
  draw();
}

function resize() {
  canvas.a.width = canvas.b.width = window.innerWidth;
  canvas.a.height = canvas.b.height = window.innerHeight;
}

function getCircle(x, y, tick) {
  return {
    position: { x, y },
    hue: -tick * 0.5,
    size: 2,
    ttl: 200,
    life: 0,
    destroy: false,
    update() {
      this.destroy = this.life++ > this.ttl;

      this.size *= 1.035;
    },
    draw() {
      this.update();

      ctx.a.beginPath();
      ctx.a.lineWidth = 2;
      ctx.a.strokeStyle = `hsla(${this.hue},100%,50%,${fadeInOut(this.life, this.ttl)})`;
      ctx.a.arc(this.position.x, this.position.y, this.size, 0, TAU);
      ctx.a.stroke();
      ctx.a.closePath();
    } };

}

function draw() {
  tick++;

  ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
  ctx.b.clearRect(0, 0, canvas.b.width, canvas.b.height);

  origin.x = window.innerWidth * 0.5 + cos(tick * 0.025) * window.innerWidth * 0.25;
  origin.y = window.innerHeight * 0.5 + sin(tick * 0.05) * window.innerHeight * 0.125;

  circles.push(getCircle(origin.x, origin.y, tick));
  for (let i = circles.length - 1; i >= 0; i--) {
    circles[i].draw();
    if (circles[i].destroy) circles.splice(i, 1);
  }

  ctx.b.save();
  ctx.b.filter = "blur(5px) saturate(200%) contrast(200%)";
  ctx.b.drawImage(canvas.a, 0, 0, canvas.b.width, canvas.b.height);
  ctx.b.restore();

  ctx.b.save();
  ctx.b.drawImage(canvas.a, 0, 0, canvas.b.width, canvas.b.height);
  ctx.b.restore();

  window.requestAnimationFrame(draw);
}

window.addEventListener("load", setup);
window.addEventListener("resize", resize);