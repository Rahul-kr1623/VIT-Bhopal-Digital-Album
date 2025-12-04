/* --------------------- */
/* Draggable Logic       */
/* --------------------- */
const pictures = document.querySelectorAll('.Picture');
var previousTouch = undefined;

function updateElementPosition(element, event) {
  var movementX, movementY;
  element.isDragging = true; // Flag: we are dragging

  if (event.type === 'touchmove') {
    const touch = event.touches[0];
    movementX = previousTouch ? touch.clientX - previousTouch.clientX : 0;
    movementY = previousTouch ? touch.clientY - previousTouch.clientY : 0;
    previousTouch = touch;
  } else {
    movementX = event.movementX;
    movementY = event.movementY;
  }

  const elementY = parseInt(element.style.top || 0) + movementY;
  const elementX = parseInt(element.style.left || 0) + movementX;

  element.style.top = elementY + "px";
  element.style.left = elementX + "px";
}

function startDrag(element, event) {
  event.preventDefault();
  element.isDragging = false; // Reset flag

  const updateFunction = (event) => updateElementPosition(element, event);
  const stopFunction = () => stopDrag({ update: updateFunction, stop: stopFunction });

  document.addEventListener("mousemove", updateFunction);
  document.addEventListener("touchmove", updateFunction, { passive: false });
  document.addEventListener("mouseup", stopFunction);
  document.addEventListener("touchend", stopFunction);
}

function stopDrag(functions) {
  previousTouch = undefined;
  document.removeEventListener("mousemove", functions.update);
  document.removeEventListener("touchmove", functions.update);
  document.removeEventListener("mouseup", functions.stop);
  document.removeEventListener("touchend", functions.stop);
}

// Helper function to randomly position elements
function randomizePosition(element) {
  const range = 100; 
  const randomX = Math.random() * (range * 2) - range;
  const randomY = Math.random() * (range * 2) - range;
  const randomRotate = Math.random() * (range / 2) - range / 4;
  
  element.style.top = `${randomY}px`;
  element.style.left = `${randomX}px`;
  element.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;
}

/* --------------------- */
/* Initialize Cards      */
/* --------------------- */
pictures.forEach(picture => {
  randomizePosition(picture);
  
  const startFunction = (event) => startDrag(picture, event);
  picture.addEventListener("mousedown", startFunction);
  picture.addEventListener("touchstart", startFunction, { passive: false });

  picture.addEventListener("click", (event) => {
    if (picture.isDragging) {
      picture.isDragging = false;
      return;
    }
    
    const img = picture.querySelector('.Picture-img');
    const note = picture.querySelector('.Picture-note span'); 
    
    const imgSrc = img.src;
    const imgAlt = img.alt;
    const captionText = note ? note.innerText : ""; 

    lightboxImg.src = imgSrc;
    lightboxCaption.innerText = captionText;
    downloadBtn.href = imgSrc;

    const downloadName = (imgAlt || 'image').replace(/ /g, '-') + '.jpg';
    downloadBtn.setAttribute('download', downloadName);
    
    lightbox.classList.add('active');
  });
});

/* --------------------- */
/* Shuffle Function      */
/* --------------------- */
const shuffleBtn = document.getElementById('shuffle-btn');
shuffleBtn.addEventListener('click', () => {
  pictures.forEach(picture => {
    randomizePosition(picture);
  });
});

/* --------------------- */
/* Music Function        */
/* --------------------- */
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');

musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.innerText = "Pause Music ⏸️";
  } else {
    bgMusic.pause();
    musicBtn.innerText = "Play Music 🎵";
  }
});

/* --------------------- */
/* Welcome Box Logic     */
/* --------------------- */
window.addEventListener('load', () => {
  const welcomeBox = document.getElementById('welcome-box');
  setTimeout(() => {
    welcomeBox.classList.add('hidden');
  }, 5000);
});

/* --------------------- */
/* Lightbox Logic        */
/* --------------------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption'); 
const downloadBtn = document.getElementById('download-btn');
const closeBtn = document.querySelector('.close-btn');

function closeLightbox() {
  lightbox.classList.remove('active');
  setTimeout(() => { lightboxImg.src = ''; }, 200); 
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});