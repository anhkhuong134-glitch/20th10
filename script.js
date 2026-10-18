/**
 * 20/10 Special Gift for Thu Phương
 * - Year 3 Accounting Student
 * - Cat Lover 🐱 & Radiant Smile
 * - Gatekeeper Name Verification Lock Screen, Interactive Coder Intro, Minigame, Accounting Quiz, 3D Polaroid Album & Letter
 */

// ========================================================
// 1. PROCEDURAL SOUND SYNTHESIZER (Web Audio API)
// ========================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.isMusicPlaying = false;
    this.musicTimer = null;
    this.melodyIndex = 0;

    // Romantic music box melody (frequencies in Hz)
    this.melody = [
      { f: 349.23, d: 0.45 }, // F4
      { f: 440.00, d: 0.45 }, // A4
      { f: 523.25, d: 0.65 }, // C5
      { f: 659.25, d: 0.85 }, // E5
      { f: 587.33, d: 0.50 }, // D5
      { f: 440.00, d: 0.35 }, // A4
      { f: 523.25, d: 0.70 }, // C5
      { f: 392.00, d: 0.50 }, // G4
      { f: 440.00, d: 0.45 }, // A4
      { f: 523.25, d: 0.45 }, // C5
      { f: 587.33, d: 0.55 }, // D5
      { f: 659.25, d: 0.95 }, // E5
      { f: 523.25, d: 0.45 }, // C5
      { f: 440.00, d: 0.45 }, // A4
      { f: 392.00, d: 0.85 }, // G4
      { f: 349.23, d: 1.10 }  // F4
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a music box chime
  playNote(freq, duration) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 1.3);
    osc2.stop(now + duration + 1.3);
  }

  // Cute kitten meow sound 🐱
  playMeow() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  // Sparkle chime sound
  playSparkle() {
    this.init();
    if (!this.ctx) return;
    const notes = [587.33, 783.99, 880.0, 1174.66];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playNote(f, 0.3), idx * 70);
    });
  }

  // Gentle buzz for wrong input
  playBuzz() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.2);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Background Music loop
  startMusic() {
    this.init();
    this.isMusicPlaying = true;
    this.stepMusic();
  }

  stepMusic() {
    if (!this.isMusicPlaying) return;
    const note = this.melody[this.melodyIndex];
    this.playNote(note.f, note.d);
    this.melodyIndex = (this.melodyIndex + 1) % this.melody.length;
    const delay = (note.d + 0.28) * 1000;
    this.musicTimer = setTimeout(() => this.stepMusic(), delay);
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) clearTimeout(this.musicTimer);
  }

  toggleMusic() {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }
}

const soundFX = new SoundFX();

// Helper to remove Vietnamese diacritics for flexible matching
function removeDiacritics(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// ========================================================
// 2. STAGE 0: GATEKEEPER NAME VERIFICATION
// ========================================================
const lockScreen = document.getElementById('lock-screen');
const stepInfo = document.getElementById('step-info');
const stepQuiz = document.getElementById('step-quiz');
const infoForm = document.getElementById('info-form');
const nameInput = document.getElementById('user-name-input');
const dobInput = document.getElementById('user-dob-input');
const lockErrorMsg = document.getElementById('lock-error-msg');
const btnToggleHint = document.getElementById('btn-toggle-hint');
const lockHintText = document.getElementById('lock-hint-text');

const quizStepIndicator = document.getElementById('quiz-step-indicator');
const quizQ1 = document.getElementById('quiz-q1');
const quizQ2 = document.getElementById('quiz-q2');
const quizFeedback = document.getElementById('quiz-feedback');
const btnBackToInfo = document.getElementById('btn-back-to-info');
const btnDownloadRecord = document.getElementById('btn-download-record');

// Check name validity: "Nguyễn Thu Phương", "Thu Phương", "Phương Thu", etc.
function isNameValid(val) {
  const raw = val.toLowerCase().trim();
  const normalized = removeDiacritics(raw);

  const validKeywords = [
    'nguyen thu phuong',
    'nguyễn thu phương',
    'thu phuong',
    'thu phương',
    'nguyen phuong thu',
    'nguyễn phương thu',
    'phuong thu',
    'phương thu',
    'thu',
    'phương',
    'phuong'
  ];

  return validKeywords.some(keyword => {
    return normalized.includes(removeDiacritics(keyword));
  });
}

function recordUserData(fullName, dob) {
  const timeStr = new Date().toLocaleString('vi-VN');
  const txtContent = `============================================================\n` +
    `🌸 THÔNG TIN BẠN NỮ NHẬP VÀO HỆ THỐNG 20/10\n` +
    `⏰ Thời gian: ${timeStr}\n` +
    `👤 Họ và tên: ${fullName}\n` +
    `🎂 Ngày tháng năm sinh: ${dob}\n` +
    `📱 Thiết bị/Trình duyệt: ${navigator.userAgent}\n` +
    `============================================================\n`;

  const recordObj = { fullName, dob, timeStr, txtContent };
  localStorage.setItem('saved_thu_phuong_info', JSON.stringify(recordObj));

  fetch('/api/save-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, dob, timeStr })
  })
  .then(res => res.json())
  .then(data => console.log('[RECORD-SAVED]', data))
  .catch(err => console.warn('[SERVERLESS / OFFLINE BACKUP MODE]', err));
}

function triggerFileDownload(content, filename = 'thong_tin_thu_phuong.txt') {
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (err) {
    console.error('Download error:', err);
  }
}

function handleInfoSubmit() {
  const enteredName = nameInput.value.trim();
  const enteredDob = dobInput.value.trim();

  if (!enteredName) {
    showLockError("Cậu chưa nhập họ và tên kìa! Nhập vào đây nhé 😊");
    nameInput.focus();
    return;
  }

  if (!isNameValid(enteredName)) {
    soundFX.playBuzz();
    showLockError("Ủa ai dợ? Món quà này chỉ dành riêng cho Nguyễn Thu Phương thôi ó! Thử nhập lại tên nha 🐾");
    nameInput.focus();
    return;
  }

  if (!enteredDob) {
    showLockError("Cậu chưa điền ngày tháng năm sinh nè! Điền vào nhé 🎂");
    dobInput.focus();
    return;
  }

  soundFX.playSparkle();
  triggerConfetti(40);
  if (lockErrorMsg) lockErrorMsg.classList.add('hidden');

  recordUserData(enteredName, enteredDob);
  showToast("💌 Đã ghi nhận thông tin của Thu Phương! Tiếp tục làm mini quiz nhé ✨");

  if (stepInfo) stepInfo.classList.add('hidden');
  if (stepQuiz) {
    stepQuiz.classList.remove('hidden');
    initQuizStep();
  }
}

function showLockError(msg) {
  if (lockErrorMsg) {
    lockErrorMsg.textContent = msg;
    lockErrorMsg.classList.remove('hidden');
  }
}

function initQuizStep() {
  if (quizStepIndicator) quizStepIndicator.textContent = "✨ Câu hỏi 1 / 2";
  if (quizQ1) quizQ1.classList.remove('hidden');
  if (quizQ2) quizQ2.classList.add('hidden');
  if (quizFeedback) quizFeedback.classList.add('hidden');

  document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
    btn.classList.remove('correct-choice', 'wrong-choice');
    btn.disabled = false;
  });

  setupQuizHandlers();
}

function setupQuizHandlers() {
  if (quizQ1) {
    const q1Buttons = quizQ1.querySelectorAll('.quiz-opt-btn');
    q1Buttons.forEach(btn => {
      btn.onclick = () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        if (isCorrect) {
          soundFX.playSparkle();
          triggerConfetti(45);
          btn.classList.add('correct-choice');
          q1Buttons.forEach(b => b.disabled = true);

          if (quizFeedback) {
            quizFeedback.className = 'quiz-feedback success';
            quizFeedback.textContent = "✨ Chuẩn đét luôn! Ngày 20/10 rực rỡ nè... Tiếp câu 2 nha! 🌸";
            quizFeedback.classList.remove('hidden');
          }

          setTimeout(() => {
            if (quizFeedback) quizFeedback.classList.add('hidden');
            if (quizQ1) quizQ1.classList.add('hidden');
            if (quizQ2) quizQ2.classList.remove('hidden');
            if (quizStepIndicator) quizStepIndicator.textContent = "✨ Câu hỏi 2 / 2";
          }, 900);
        } else {
          soundFX.playBuzz();
          btn.classList.add('wrong-choice');
          setTimeout(() => btn.classList.remove('wrong-choice'), 600);

          if (quizFeedback) {
            quizFeedback.className = 'quiz-feedback retry';
            quizFeedback.textContent = "Hehe mai không phải ngày này âu, chọn lại thử xem nè 🐾";
            quizFeedback.classList.remove('hidden');
          }
        }
      };
    });
  }

  if (quizQ2) {
    const q2Buttons = quizQ2.querySelectorAll('.quiz-opt-btn');
    q2Buttons.forEach(btn => {
      btn.onclick = () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        if (isCorrect) {
          soundFX.playSparkle();
          triggerConfetti(80);
          btn.classList.add('correct-choice');
          q2Buttons.forEach(b => b.disabled = true);

          if (quizFeedback) {
            quizFeedback.className = 'quiz-feedback success';
            quizFeedback.textContent = "🎉 100 ĐIỂM! Món quà chính thức đang bung nở cho Thu Phương nè... 💐💖";
            quizFeedback.classList.remove('hidden');
          }

          if (typeof playRealSong === 'function') playRealSong();

          setTimeout(() => {
            if (lockScreen) lockScreen.classList.remove('active');
            setTimeout(() => {
              const giftScreen = document.getElementById('gift-screen');
              if (giftScreen) giftScreen.classList.add('active');
              triggerConfetti(70);
              if (typeof startRoseAnimation === 'function') startRoseAnimation();
              if (typeof initAlbumSlider === 'function') initAlbumSlider();
              showToast("✨ Chúc mừng 20/10 Nguyễn Thu Phương xinh đẹp nhất trần đời! 🌸");
            }, 350);
          }, 1100);
        } else {
          soundFX.playBuzz();
          btn.classList.add('wrong-choice');
          setTimeout(() => btn.classList.remove('wrong-choice'), 600);

          if (quizFeedback) {
            quizFeedback.className = 'quiz-feedback retry';
            quizFeedback.textContent = "Ủa chưa đúng nà! Mai là ngày siêu ý nghĩa cơ mà, đoán lại nà 🤭";
            quizFeedback.classList.remove('hidden');
          }
        }
      };
    });
  }
}

if (btnBackToInfo) {
  btnBackToInfo.addEventListener('click', () => {
    if (stepQuiz) stepQuiz.classList.add('hidden');
    if (stepInfo) stepInfo.classList.remove('hidden');
    if (nameInput) nameInput.focus();
  });
}

if (btnDownloadRecord) {
  btnDownloadRecord.addEventListener('click', () => {
    const raw = localStorage.getItem('saved_thu_phuong_info');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        triggerFileDownload(parsed.txtContent || raw);
        showToast("💾 Đã tải file thông tin về máy của bạn!");
      } catch (e) {
        triggerFileDownload(raw);
      }
    } else {
      showToast("ℹ️ Chưa có thông tin nào được lưu! Hãy điền form trước nhé.");
    }
  });
}

if (infoForm) {
  infoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleInfoSubmit();
  });
}

if (btnToggleHint) {
  btnToggleHint.addEventListener('click', () => {
    if (lockHintText) lockHintText.classList.toggle('hidden');
  });
}

// ========================================================
// 3. STAGE 1: TERMINAL INTRO (Accounting & Cat Target Scan)
// ========================================================
const terminalContent = document.getElementById('terminal-content');
const btnStartGame = document.getElementById('btn-start-game');
const btnSkipTyping = document.getElementById('btn-skip-typing');
const terminalScreen = document.getElementById('terminal-screen');
const minigameScreen = document.getElementById('minigame-screen');
const giftScreen = document.getElementById('gift-screen');

const terminalLines = [
  { text: "> [SYSTEM SCAN]: Quét mục tiêu trên máy chủ...", cls: "comment" },
  { text: "> Target: Nguyễn Thu Phương | Sinh viên Năm 3 Kế Toán", cls: "keyword" },
  { text: "> Sở thích phát hiện: Boss mèo 🐱, cún cưng 🐶, trà sữa, hoa tươi 🌸", cls: "string" },
  { text: "> Cảnh báo hệ thống: Chỉ số mệt mỏi vì Bảng Cân Đối & Báo Cáo Tài Chính đang cao!", cls: "func" },
  { text: "> Khởi chạy giao thức: 'GiaiCuuBossMeo_20_10.sh'...", cls: "keyword" },
  { text: "> Nạp module: NuCuoiRangRo.dll & AutoQuaMon.pkg... [100% SUCCESS]", cls: "success" },
  { text: "> Mục tiêu: Hoàn thành mini-game để cân đối Bảng Hạnh Phúc cho Thu Phương!", cls: "string" },
  { text: "> Sẵn sàng! Nhấn nút bên dưới để giải cứu Boss Mèo & xem quà 20/10 ✨", cls: "highlight" }
];

let termLineIdx = 0;
let termCharIdx = 0;
let termTimer = null;

function typeTerminal() {
  if (termLineIdx >= terminalLines.length) {
    btnStartGame.classList.add('glow');
    return;
  }

  const item = terminalLines[termLineIdx];
  let el = document.getElementById(`term-l-${termLineIdx}`);
  if (!el) {
    el = document.createElement('div');
    el.id = `term-l-${termLineIdx}`;
    el.className = `line ${item.cls}`;
    terminalContent.appendChild(el);
  }

  if (termCharIdx < item.text.length) {
    el.textContent = item.text.substring(0, termCharIdx + 1);
    termCharIdx++;
    terminalContent.scrollTop = terminalContent.scrollHeight;
    termTimer = setTimeout(typeTerminal, Math.random() * 20 + 15);
  } else {
    termLineIdx++;
    termCharIdx = 0;
    termTimer = setTimeout(typeTerminal, 160);
  }
}

btnSkipTyping.addEventListener('click', () => {
  if (termTimer) clearTimeout(termTimer);
  terminalContent.innerHTML = '';
  terminalLines.forEach(item => {
    const el = document.createElement('div');
    el.className = `line ${item.cls}`;
    el.textContent = item.text;
    terminalContent.appendChild(el);
  });
  terminalContent.scrollTop = terminalContent.scrollHeight;
  btnStartGame.classList.add('glow');
});

// Transition Terminal -> Minigame
btnStartGame.addEventListener('click', () => {
  soundFX.playSparkle();
  terminalScreen.classList.remove('active');
  setTimeout(() => {
    minigameScreen.classList.add('active');
    initMinigame();
  }, 400);
});

// ========================================================
// 4. STAGE 2: MINIGAME (Catch Boss Mèo & Bảng Cân Đối)
// ========================================================
const gameArena = document.getElementById('game-arena');
const progressFill = document.getElementById('game-progress-fill');
const scoreText = document.getElementById('score-text');
const scoreStatus = document.getElementById('score-status');
const quizBox = document.getElementById('quiz-box');
const quizResult = document.getElementById('quiz-result');
const btnSkipToGift = document.getElementById('btn-skip-to-gift');

let gameScore = 0;
const targetScore = 5;
let spawnInterval = null;
const gameIcons = ['🐱', '🌸', '😸', '🌹', '🐾', '💐', '🐶', '💖'];

function initMinigame() {
  gameScore = 0;
  updateScoreUI();
  scoreStatus.textContent = "Boss mèo đang xuất hiện!";
  
  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(spawnGameTarget, 900);
  spawnGameTarget();
}

function spawnGameTarget() {
  if (gameScore >= targetScore) return;

  const target = document.createElement('div');
  target.className = 'game-target';
  const icon = gameIcons[Math.floor(Math.random() * gameIcons.length)];
  target.textContent = icon;

  const arenaWidth = gameArena.clientWidth - 50;
  const arenaHeight = gameArena.clientHeight - 50;
  const x = Math.max(10, Math.random() * arenaWidth);
  const y = Math.max(10, Math.random() * arenaHeight);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.addEventListener('click', (e) => {
    e.stopPropagation();
    catchTarget(target, icon, x, y);
  });

  target.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    catchTarget(target, icon, x, y);
  }, { passive: true });

  gameArena.appendChild(target);

  // Auto remove after 2.6s
  setTimeout(() => {
    if (target.parentNode) {
      target.style.opacity = '0';
      setTimeout(() => target.remove(), 200);
    }
  }, 2600);
}

function catchTarget(el, icon, x, y) {
  if (gameScore >= targetScore) return;

  if (icon.includes('🐱') || icon.includes('😸') || icon.includes('🐾')) {
    soundFX.playMeow();
  } else {
    soundFX.playSparkle();
  }

  // Floating score text
  const pop = document.createElement('div');
  pop.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    color: #ffd166;
    font-weight: 700;
    font-size: 1rem;
    pointer-events: none;
    transition: transform 0.6s ease, opacity 0.6s ease;
    z-index: 10;
  `;
  pop.textContent = icon.includes('🐱') ? '+1 Meow! 🥰' : '+1 Đóa hoa! 🌸';
  gameArena.appendChild(pop);

  requestAnimationFrame(() => {
    pop.style.transform = 'translateY(-30px)';
    pop.style.opacity = '0';
  });
  setTimeout(() => pop.remove(), 600);

  el.remove();
  gameScore++;
  updateScoreUI();

  if (gameScore >= targetScore) {
    onMinigameComplete();
  }
}

function updateScoreUI() {
  scoreText.textContent = `${gameScore} / ${targetScore}`;
  const pct = Math.min((gameScore / targetScore) * 100, 100);
  progressFill.style.width = `${pct}%`;
}

function onMinigameComplete() {
  if (spawnInterval) clearInterval(spawnInterval);
  scoreStatus.textContent = "Đã đủ Boss mèo & Hoa! 🎉";
  triggerConfetti(30);
  soundFX.playSparkle();

  // Show Accounting Quiz
  setTimeout(() => {
    quizBox.classList.remove('hidden');
    quizBox.scrollIntoView({ behavior: 'smooth' });
  }, 400);
}

// Accounting Quiz Interaction
document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    soundFX.playSparkle();
    triggerConfetti(40);
    quizResult.classList.remove('hidden');
    quizResult.innerHTML = `
      ✨ <strong>Chính xác 100%!</strong> Chuẩn mực Kế toán Tình cảm quy định: Khi Thu Phương cười, mọi số dư Nợ/Có đều tự động cân đối hoàn hảo và niềm vui tăng gấp bội! 🥰
    `;

    // Transition to Grand Finale Gift Screen after 1.8s
    setTimeout(transitionToGiftScreen, 1800);
  });
});

btnSkipToGift.addEventListener('click', transitionToGiftScreen);

function transitionToGiftScreen() {
  if (!soundFX.isMusicPlaying) {
    soundFX.startMusic();
    updateAudioUI(true);
  }

  minigameScreen.classList.remove('active');
  setTimeout(() => {
    giftScreen.classList.add('active');
    triggerConfetti(60);
    showToast("✨ Món quà 20/10 dành riêng cho Thu Phương đã mở!");
    startRoseAnimation();
    initAlbumSlider();
  }, 400);
}

// ========================================================
// 5. STAGE 3: 3D POLAROID PHOTO ALBUM
// ========================================================
const albumSlider = document.getElementById('album-slider');
const albumCards = document.querySelectorAll('.polaroid-card');
const albumDotsContainer = document.getElementById('album-nav-dots');
const btnPrevSlide = document.getElementById('btn-prev-slide');
const btnNextSlide = document.getElementById('btn-next-slide');
const slideIndicator = document.getElementById('slide-indicator');

let currentSlide = 0;
const totalSlides = albumCards.length;

function initAlbumSlider() {
  albumDotsContainer.innerHTML = '';
  albumCards.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `album-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(idx));
    albumDotsContainer.appendChild(dot);
  });
  updateSlideDisplay();
}

function goToSlide(idx) {
  currentSlide = (idx + totalSlides) % totalSlides;
  updateSlideDisplay();
}

function updateSlideDisplay() {
  albumCards.forEach((card, idx) => {
    if (idx === currentSlide) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  const dots = albumDotsContainer.querySelectorAll('.album-dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlide);
  });

  slideIndicator.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

btnPrevSlide.addEventListener('click', () => {
  goToSlide(currentSlide - 1);
  soundFX.playSparkle();
});

btnNextSlide.addEventListener('click', () => {
  goToSlide(currentSlide + 1);
  soundFX.playSparkle();
});

albumCards.forEach(card => {
  card.addEventListener('click', () => {
    triggerConfetti(25);
    soundFX.playMeow();
    showToast("🥰 Ảnh xinh quá nè! Chúc Thu Phương 20/10 siêu vui!");
  });
});

const albumReminderBox = document.getElementById('album-reminder-box');
if (albumReminderBox) {
  albumReminderBox.addEventListener('click', () => {
    triggerConfetti(30);
    soundFX.playMeow();
    showToast("📢 Đã gửi tín hiệu réo chủ thớt! Mau mau nộp thêm nhìu ảnh selfie nhaa 🤳✨");
  });
}

// ========================================================
// 6. BLOOMING ROSE CANVAS ENGINE
// ========================================================
const roseCanvas = document.getElementById('rose-canvas');
const roseCtx = roseCanvas.getContext('2d');
let bloomProgress = 0;

function setupRoseCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = roseCanvas.getBoundingClientRect();
  roseCanvas.width = (rect.width || 220) * dpr;
  roseCanvas.height = (rect.height || 220) * dpr;
  roseCtx.scale(dpr, dpr);
}

function drawParametricRose(progress) {
  const w = roseCanvas.clientWidth || 220;
  const h = roseCanvas.clientHeight || 220;
  const cx = w / 2;
  const cy = h / 2;

  roseCtx.clearRect(0, 0, w, h);

  const totalPetals = 42;
  const maxLayers = Math.floor(totalPetals * progress);

  for (let i = 0; i < maxLayers; i++) {
    const angle = i * 137.5 * (Math.PI / 180);
    const r = Math.sqrt(i) * 11 * Math.min(progress, 1);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    const petalSize = Math.min(5 + i * 0.5, 18) * progress;

    roseCtx.save();
    roseCtx.translate(x, y);
    roseCtx.rotate(angle + Math.PI / 2);

    const grad = roseCtx.createRadialGradient(0, 0, 2, 0, 0, petalSize);
    grad.addColorStop(0, '#fff5f8');
    grad.addColorStop(0.35, '#ff4d79');
    grad.addColorStop(0.8, '#e11d48');
    grad.addColorStop(1, 'rgba(159, 18, 57, 0.4)');

    roseCtx.fillStyle = grad;
    roseCtx.shadowColor = '#ff2a6d';
    roseCtx.shadowBlur = 10;

    roseCtx.beginPath();
    roseCtx.moveTo(0, 0);
    roseCtx.bezierCurveTo(-petalSize, -petalSize * 0.7, -petalSize * 1.2, petalSize * 0.6, 0, petalSize * 1.2);
    roseCtx.bezierCurveTo(petalSize * 1.2, petalSize * 0.6, petalSize, -petalSize * 0.7, 0, 0);
    roseCtx.fill();

    roseCtx.restore();
  }

  // Center gold bud
  roseCtx.save();
  const centerGrad = roseCtx.createRadialGradient(cx, cy, 0, cx, cy, 14 * progress);
  centerGrad.addColorStop(0, '#ffd166');
  centerGrad.addColorStop(0.6, '#ff6b8b');
  centerGrad.addColorStop(1, 'transparent');
  roseCtx.fillStyle = centerGrad;
  roseCtx.beginPath();
  roseCtx.arc(cx, cy, 14 * progress, 0, Math.PI * 2);
  roseCtx.fill();
  roseCtx.restore();
}

function startRoseAnimation() {
  setupRoseCanvas();
  bloomProgress = 0;

  function render() {
    if (bloomProgress < 1) {
      bloomProgress += 0.016;
      drawParametricRose(Math.min(bloomProgress, 1));
      requestAnimationFrame(render);
    } else {
      drawParametricRose(1);
    }
  }
  render();
}

roseCanvas.addEventListener('click', () => {
  bloomProgress = 0.2;
  startRoseAnimation();
  triggerConfetti(30);
  soundFX.playSparkle();
  showToast("🌹 Đóa hoa nở rộ dành tặng Thu Phương!");
});

// ========================================================
// 7. BACKGROUND PARTICLES & PETALS CANVAS
// ========================================================
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let bgParticles = [];

function resizeBgCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBgCanvas);
resizeBgCanvas();

class BgParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * bgCanvas.width;
    this.y = Math.random() * bgCanvas.height;
    this.size = Math.random() * 2.5 + 0.8;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = Math.random() * 0.6 + 0.25;
    this.opacity = Math.random() * 0.7 + 0.3;
    this.isHeart = Math.random() > 0.85;
    this.color = Math.random() > 0.5 ? '#ff6b8b' : '#ffd166';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y > bgCanvas.height) {
      this.y = -10;
      this.x = Math.random() * bgCanvas.width;
    }
  }

  draw() {
    bgCtx.save();
    bgCtx.globalAlpha = this.opacity;
    bgCtx.fillStyle = this.color;
    
    if (this.isHeart) {
      const hx = this.x;
      const hy = this.y;
      const s = this.size * 1.5;
      bgCtx.beginPath();
      bgCtx.moveTo(hx, hy);
      bgCtx.bezierCurveTo(hx - s, hy - s, hx - s * 1.8, hy + s * 0.5, hx, hy + s * 1.6);
      bgCtx.bezierCurveTo(hx + s * 1.8, hy + s * 0.5, hx + s, hy - s, hx, hy);
      bgCtx.fill();
    } else {
      bgCtx.beginPath();
      bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      bgCtx.shadowBlur = 10;
      bgCtx.shadowColor = this.color;
      bgCtx.fill();
    }
    bgCtx.restore();
  }
}

for (let i = 0; i < 70; i++) {
  bgParticles.push(new BgParticle());
}

function animateBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgParticles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateBg);
}
animateBg();

// ========================================================
// 8. CONFETTI BURST ENGINE
// ========================================================
function triggerConfetti(count = 40) {
  const emojis = ['🌸', '💖', '✨', '🌹', '💐', '🐱', '🐾', '🌷'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'burst-particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 20;
    const endX = startX + (Math.random() - 0.5) * 350;
    const endY = -50 - Math.random() * 200;
    const rot = (Math.random() - 0.5) * 720;
    const duration = Math.random() * 2 + 2;

    el.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      font-size: ${Math.random() * 1.4 + 1.2}rem;
      pointer-events: none;
      z-index: 999;
      transition: transform ${duration}s cubic-bezier(0.12, 0.8, 0.32, 1), opacity ${duration}s ease;
      transform: translate3d(0, 0, 0) rotate(0deg);
      opacity: 1;
    `;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate3d(${endX - startX}px, ${endY - startY}px, 0) rotate(${rot}deg)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), duration * 1000 + 100);
  }
}

// ========================================================
// 9. TOAST & AUDIO UI
// ========================================================
const toastEl = document.getElementById('toast');
let toastTimer = null;

function showToast(msg) {
  if (toastTimer) clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3200);
}

const audioBtn = document.getElementById('audio-toggle');
const audioLabel = audioBtn.querySelector('.audio-label');

function updateAudioUI(isPlaying) {
  if (isPlaying) {
    audioBtn.classList.add('playing');
    audioLabel.textContent = 'Giai điệu lofi';
  } else {
    audioBtn.classList.remove('playing');
    audioLabel.textContent = 'Bật nhạc chill';
  }
}

audioBtn.addEventListener('click', () => {
  const isPlaying = soundFX.toggleMusic();
  updateAudioUI(isPlaying);
  if (isPlaying) {
    showToast("🎵 Đang phát giai điệu lãng mạn nhẹ nhàng...");
  }
});

// ========================================================
// 10. MODAL & LETTER ACTION BUTTONS
// ========================================================
const secretModal = document.getElementById('secret-modal');
const btnSecretMsg = document.getElementById('btn-secret-msg');
const modalClose = document.getElementById('modal-close');
const modalConfirm = document.getElementById('modal-confirm');
const btnBloomMore = document.getElementById('btn-bloom-more');
const btnCatMeow = document.getElementById('btn-cat-meow');

btnSecretMsg.addEventListener('click', () => {
  secretModal.classList.add('active');
  soundFX.playSparkle();
  triggerConfetti(25);
});

function closeModal() {
  secretModal.classList.remove('active');
}
modalClose.addEventListener('click', closeModal);
modalConfirm.addEventListener('click', () => {
  closeModal();
  soundFX.playMeow();
  triggerConfetti(40);
  showToast("🥰 Chúc Thu Phương 20/10 ngập tràn niềm vui!");
});

secretModal.addEventListener('click', (e) => {
  if (e.target === secretModal) closeModal();
});

btnBloomMore.addEventListener('click', () => {
  triggerConfetti(55);
  soundFX.playSparkle();
  showToast("🌸 Ngàn đóa hoa chúc mừng Thu Phương 20/10!");
});

btnCatMeow.addEventListener('click', () => {
  soundFX.playMeow();
  triggerConfetti(20);
  showToast("🐾 Meow meow! Boss mèo chúc Thu Phương luôn xinh xắn!");
});
