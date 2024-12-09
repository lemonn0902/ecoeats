const backgrounds = [
  'static/images/agriculture.jpeg',
  'static/images/flower.jpeg',
  'static/images/sunflower.jpeg',
];

let currentIndex = 0;

function changeBackground() {
  document.body.style.backgroundImage = `url(${backgrounds[currentIndex]})`;
  currentIndex = (currentIndex + 1) % backgrounds.length;
}

setInterval(changeBackground, 5000);

changeBackground();
