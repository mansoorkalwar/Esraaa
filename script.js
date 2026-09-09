const $ = (selector) => document.querySelector(selector);

const screens = [...document.querySelectorAll('.screen')];

function showScreen(id) {
  screens.forEach((screen) => screen.classList.remove('active'));

  const targetScreen = $(`#${id}`);
  targetScreen?.classList.add('active');

  document.querySelectorAll('.nav-tabs button').forEach((button) => {
    button.classList.toggle('active', button.dataset.go === id);
  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

/* ----------------------------------------
   Celebration effects
---------------------------------------- */

function confetti(count = 80) {
  const box = $('#confetti');

  if (!box) return;

  const colors = ['#ff527c', '#ffd36e', '#fff', '#d98cff', '#ff9db5'];

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement('i');

    piece.className = 'conf';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.setProperty('--x', `${(Math.random() - 0.5) * 280}px`);
    piece.style.setProperty('--d', `${2.2 + Math.random() * 2.5}s`);
    piece.style.setProperty('--r', `${Math.random() * 360}deg`);
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];

    box.appendChild(piece);

    setTimeout(() => piece.remove(), 5000);
  }
}

function hearts(count = 25) {
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement('div');

    heart.textContent = Math.random() > 0.2 ? '♥' : '✦';
    heart.style.cssText = `
      position: fixed;
      z-index: 99;
      pointer-events: none;
      left: ${Math.random() * 100}vw;
      top: ${55 + Math.random() * 35}vh;
      color: ${Math.random() > 0.3 ? '#ff5c82' : '#ffe3a8'};
      font-size: ${12 + Math.random() * 24}px;
      transition: transform 2s ease, opacity 2s ease;
    `;

    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `
        translate(${(Math.random() - 0.5) * 260}px, ${-220 - Math.random() * 350}px)
        rotate(${Math.random() * 360}deg)
      `;
      heart.style.opacity = 0;
    });

    setTimeout(() => heart.remove(), 2200);
  }
}

/* ----------------------------------------
   Top navigation
---------------------------------------- */

document.querySelectorAll('.nav-tabs button').forEach((button) => {
  button.addEventListener('click', () => showScreen(button.dataset.go));
});

document.querySelector('.nav-tabs button')?.classList.add('active');

/* ----------------------------------------
   Background music
---------------------------------------- */

const music = $('#bgMusic');
const musicBtn = $('#musicBtn');

musicBtn?.addEventListener('click', async () => {
  try {
    if (music.paused) {
      await music.play();
      musicBtn.classList.add('playing');
    } else {
      music.pause();
      musicBtn.classList.remove('playing');
    }
  } catch (error) {
    alert('Put your music file in the music folder as birthday.mp3, then press Play.');
  }
});

/* ----------------------------------------
   Hero
---------------------------------------- */

$('#heartBtn')?.addEventListener('click', () => {
  hearts(38);

  setTimeout(() => {
    showScreen('letterScreen');
  }, 650);
});

/* ----------------------------------------
   Envelope
---------------------------------------- */

const envelope = $('#envelope');
const seal = $('#seal');
const letterNext = $('#letterNext');

let envelopeOpened = false;

seal?.addEventListener('click', (event) => {
  event.stopPropagation();

  if (envelopeOpened) return;

  envelopeOpened = true;
  envelope.classList.add('open');

  seal.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.35)' },
      { transform: 'scale(0)' },
    ],
    {
      duration: 520,
      easing: 'cubic-bezier(.2,.8,.2,1)',
      fill: 'forwards',
    }
  );

  hearts(18);

  setTimeout(() => {
    letterNext?.classList.remove('hidden');
  }, 1450);
});

envelope?.addEventListener('click', (event) => {
  if (!envelopeOpened && event.target === envelope) {
    seal?.click();
  }
});

letterNext?.addEventListener('click', () => {
  showScreen('cakeScreen');
});

/* ----------------------------------------
   Cake cutting animation
   Restored and made more reliable
---------------------------------------- */

const stage = $('#cakeStage');
const knife = $('#knife');
const cakeWrap = $('#cakeWrap');
const spark = $('#cutSpark');
const cakeLeft = $('#cakeLeft');
const cakeRight = $('#cakeRight');

// The original cake SVG exists in the left half.
// Clone it into the right half so both sides remain visible after the cut.
if (cakeLeft && cakeRight && !cakeRight.querySelector('.cake-svg')) {
  const rightCake = cakeLeft.querySelector('.cake-svg')?.cloneNode(true);

  if (rightCake) {
    cakeRight.appendChild(rightCake);
  }
}

let dragging = false;
let startX = 0;
let cut = false;

function knifeAt(x, y) {
  const rect = stage.getBoundingClientRect();

  knife.style.left = `${x - rect.left}px`;
  knife.style.top = `${y - rect.top}px`;
  knife.style.opacity = 1;
}

function cutCake() {
  if (cut) return;

  cut = true;

  cakeWrap.classList.add('cut');
  spark.classList.add('show');

  spark.style.left = '50%';
  spark.style.top = '42%';

  confetti(110);

  setTimeout(() => {
    $('#cakeNext')?.classList.remove('hidden');
  }, 1000);

  setTimeout(() => {
    spark.classList.remove('show');
  }, 1000);
}

stage?.addEventListener('pointerdown', (event) => {
  dragging = true;
  startX = event.clientX;

  knifeAt(event.clientX, event.clientY);
  stage.setPointerCapture?.(event.pointerId);
});

stage?.addEventListener('pointermove', (event) => {
  if (!dragging) return;

  knifeAt(event.clientX, event.clientY);

  if (event.clientX - startX > 120) {
    cutCake();
  }
});

function hideKnife() {
  dragging = false;
  knife.style.opacity = 0;
}

stage?.addEventListener('pointerup', hideKnife);
stage?.addEventListener('pointercancel', hideKnife);

$('#cakeNext')?.addEventListener('click', () => {
  showScreen('passcodeScreen');
});

/* ----------------------------------------
   Passcode
---------------------------------------- */

let code = '';
const target = '9926';
const dots = [...document.querySelectorAll('#dots span')];

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle('filled', index < code.length);
  });
}

function failPasscode() {
  const page = $('.passcode-page');

  $('#wrong')?.classList.add('show');

  page.classList.remove('shake');
  void page.offsetWidth;
  page.classList.add('shake');

  code = '';
  updateDots();

  setTimeout(() => {
    $('#wrong')?.classList.remove('show');
  }, 1100);
}

function enterKey(key) {
  if (key === 'delete') {
    code = code.slice(0, -1);
    updateDots();
    return;
  }

  if (code.length >= 4) return;

  code += key;
  updateDots();

  if (code.length === 4) {
    if (code === target) {
      $('.passcode-page')?.classList.add('success');
      confetti(90);

      setTimeout(() => {
        showScreen('memoriesScreen');
      }, 900);
    } else {
      setTimeout(failPasscode, 180);
    }
  }
}

$('#keypad')?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-key]');

  if (button) {
    enterKey(button.dataset.key);
  }
});

document.addEventListener('keydown', (event) => {
  if (!$('#passcodeScreen')?.classList.contains('active')) return;

  if (/^[0-9]$/.test(event.key)) {
    enterKey(event.key);
  }

  if (event.key === 'Backspace') {
    enterKey('delete');
  }
});

/* ----------------------------------------
   Replay
---------------------------------------- */

$('#replay')?.addEventListener('click', () => {
  code = '';
  updateDots();

  cut = false;
  cakeWrap?.classList.remove('cut');

  envelope?.classList.remove('open');
  envelopeOpened = false;

  letterNext?.classList.add('hidden');
  $('#cakeNext')?.classList.add('hidden');
  $('.passcode-page')?.classList.remove('success');

  if (seal) {
    seal.style.transform = '';
    seal.getAnimations().forEach((animation) => animation.cancel());
  }

  if (music) {
    music.pause();
    music.currentTime = 0;
  }

  musicBtn?.classList.remove('playing');

  showScreen('hero');
});
