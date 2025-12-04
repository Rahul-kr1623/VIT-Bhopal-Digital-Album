/* --------------------- */
/* Draggable Logic       */
/* --------------------- */
const pictures = document.querySelectorAll('.Picture');
const isMobile = window.innerWidth <= 768;
let previousTouch = undefined;

function updateElementPosition(element, event) {
  let movementX, movementY;
  element.isDragging = true;

  if (event.type === 'touchmove') {
    const touch = event.touches[0];
    movementX = previousTouch ? touch.clientX - previousTouch.clientX : 0;
    movementY = previousTouch ? touch.clientY - previousTouch.clientY : 0;
    previousTouch = touch;
  } else {
    movementX = event.movementX;
    movementY = event.movementY;
  }

  let elementY = parseInt(element.style.top || 0) + movementY;
  let elementX = parseInt(element.style.left || 0) + movementX;

  // SAFETY LIMIT: Keeps photos within reasonable area
  const limitX = window.innerWidth / 1.5;
  const limitY = window.innerHeight / 1.5;

  if (elementX > limitX) elementX = limitX;
  if (elementX < -limitX) elementX = -limitX;
  if (elementY > limitY) elementY = limitY;
  if (elementY < -limitY) elementY = -limitY;

  element.style.top = elementY + 'px';
  element.style.left = elementX + 'px';
}

function startDrag(element, event) {
  // Allow clicking links/buttons inside without triggering drag
  if (event.target.closest('a') || event.target.closest('button')) return;

  event.preventDefault();
  element.isDragging = false;

  const updateFunction = (event) => updateElementPosition(element, event);
  const stopFunction = () => stopDrag({ update: updateFunction, stop: stopFunction });

  document.addEventListener('mousemove', updateFunction);
  document.addEventListener('touchmove', updateFunction, { passive: false });
  document.addEventListener('mouseup', stopFunction);
  document.addEventListener('touchend', stopFunction);
}

function stopDrag(functions) {
  previousTouch = undefined;
  document.removeEventListener('mousemove', functions.update);
  document.removeEventListener('touchmove', functions.update);
  document.removeEventListener('mouseup', functions.stop);
  document.removeEventListener('touchend', functions.stop);
}

// Random scatter logic
function randomizePosition(element) {
  if (isMobile) {
    // Upward bias for mobile to avoid footer
    const rangeX = 40;
    const randomY = -(30 + Math.random() * 60); // between -30 and -90
    const randomX = Math.random() * (rangeX * 2) - rangeX; // -40 to 40
    const randomRotate = Math.random() * 20 - 10;

    element.style.top = `${randomY}px`;
    element.style.left = `${randomX}px`;
    element.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;
  } else {
    const range = 100;
    const randomX = Math.random() * (range * 2) - range;
    const randomY = Math.random() * (range * 2) - range;
    const randomRotate = Math.random() * (range / 2) - range / 4;

    element.style.top = `${randomY}px`;
    element.style.left = `${randomX}px`;
    element.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;
  }
}

/* --------------------- */
/* Lightbox Setup        */
/* --------------------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const downloadBtn = document.getElementById('download-btn');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0;

function showImage(index) {
  if (pictures.length === 0) return;

  if (index < 0) index = pictures.length - 1;
  else if (index >= pictures.length) index = 0;

  currentIndex = index;

  const picture = pictures[currentIndex];
  const img = picture.querySelector('.Picture-img');
  if (!img) return;

  const note = picture.querySelector('.Picture-note span');
  const imgSrc = img.src;
  const imgAlt = img.alt || 'image';
  const captionText = note ? note.innerText : imgAlt;

  lightboxImg.src = imgSrc;
  lightboxImg.alt = imgAlt;
  lightboxCaption.innerText = captionText;

  downloadBtn.href = imgSrc;
  const downloadName = imgAlt.replace(/ /g, '-') + '.jpg';
  downloadBtn.setAttribute('download', downloadName);

  lightbox.classList.add('active');
}

function showNext() { showImage(currentIndex + 1); }
function showPrev() { showImage(currentIndex - 1); }

/* --------------------- */
/* Initialize Cards      */
/* --------------------- */
pictures.forEach((picture, index) => {
  randomizePosition(picture);

  const startFunction = (event) => startDrag(picture, event);
  picture.addEventListener('mousedown', startFunction);
  picture.addEventListener('touchstart', startFunction, { passive: false });

  picture.addEventListener('click', (e) => {
    if (picture.isDragging) {
      picture.isDragging = false;
      return;
    }
    if (e.target.closest('.Network')) return; // Don't open lightbox when clicking IG link

    showImage(index);
  });
});

/* --------------------- */
/* Controls & Logic      */
/* --------------------- */
const shuffleBtn = document.getElementById('shuffle-btn');
shuffleBtn.addEventListener('click', () => {
  pictures.forEach(picture => {
    randomizePosition(picture);
    // subtle glow animation on shuffle
    picture.classList.add('shuffle-anim');
    setTimeout(() => picture.classList.remove('shuffle-anim'), 350);
  });
});

const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');

musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.innerText = 'Pause Music ⏸️';
  } else {
    bgMusic.pause();
    musicBtn.innerText = 'Play Music 🎵';
  }
});

window.addEventListener('load', () => {
  const welcomeBox = document.getElementById('welcome-box');
  setTimeout(() => { welcomeBox.classList.add('hidden'); }, 5000);
});

function closeLightbox() {
  lightbox.classList.remove('active');
  setTimeout(() => { lightboxImg.src = ''; }, 200);
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowRight') showNext();
  else if (e.key === 'ArrowLeft') showPrev();
});
