/* JAVASCRIPT ĐIỀU KHIỂN HOẠT HỌA & LOGIC 20/10 NGUYỄN THU PHƯƠNG */

class SoundFX {
  constructor() {
    this.ctx = null;
    this.isMusicPlaying = false;
    this.musicTimer = null;
    this.melodyIndex = 0;

    this.melody = [
      { f: 349.23, d: 0.45 },
      { f: 440.00, d: 0.45 },
      { f: 523.25, d: 0.65 },
      { f: 659.25, d: 0.85 },
      { f: 587.33, d: 0.50 },
      { f: 440.00, d: 0.35 },
      { f: 523.25, d: 0.70 },
      { f: 392.00, d: 0.50 },
      { f: 440.00, d: 0.45 },
      { f: 523.25, d: 0.45 },
      { f: 587.33, d: 0.55 },
      { f: 659.25, d: 0.95 },
      { f: 523.25, d: 0.45 },
      { f: 440.00, d: 0.45 },
      { f: 392.00, d: 0.85 },
      { f: 349.23, d: 1.10 }
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

  playMeow() {
    try {
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
    } catch(e) {}
  }

  playSparkle() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [587.33, 783.99, 880.0, 1174.66];
      notes.forEach((f, idx) => {
        setTimeout(() => this.playNote(f, 0.3), idx * 70);
      });
    } catch(e) {}
  }

  playPop() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch(e) {}
  }

  playBuzz() {
    try {
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
    } catch(e) {}
  }

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

function removeDiacritics(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// Gatekeeper Name & Info Verification + 20/10 Quiz Flow
const lockScreen = document.getElementById('lock-screen');
const stepInfo = document.getElementById('step-info');
const stepQuiz = document.getElementById('step-quiz');
const infoForm = document.getElementById('info-form');
const nameInput = document.getElementById('user-name-input');
const dobInput = document.getElementById('user-dob-input');
const lockErrorMsg = document.getElementById('lock-error-msg');
const btnToggleHint = document.getElementById('btn-toggle-hint');
const lockHintText = document.getElementById('lock-hint-text');
const giftScreen = document.getElementById('gift-screen');
const quizForm = document.getElementById('quiz-form');
const quizAns1 = document.getElementById('quiz-ans-1');
const quizAns2 = document.getElementById('quiz-ans-2');
const quizError1 = document.getElementById('quiz-error-1');
const quizError2 = document.getElementById('quiz-error-2');
const quizFeedback = document.getElementById('quiz-feedback');
const btnBackToInfo = document.getElementById('btn-back-to-info');

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

// Kiểm tra câu trả lời 1: "Mai là ngày bao nhiêu?"
function isQ1Valid(val) {
  const norm = removeDiacritics(val.toLowerCase().trim());
  if (!norm) return false;
  
  // Chấp nhận: 20/10, 20-10, 20.10, 20th10, 20 tháng 10, ngày 20, 20...
  const has20And10 = norm.includes('20/10') || norm.includes('20-10') || norm.includes('20.10') || norm.includes('20th10') ||
                     (norm.includes('20') && (norm.includes('10') || norm.includes('muoi'))) ||
                     (norm.includes('hai muoi') && (norm.includes('muoi') || norm.includes('10')));
  const isJust20 = /^\s*(ngay\s*)?20(\s*thang\s*10)?\s*$/.test(norm);
  const isHas20 = norm.includes('20');
  return has20And10 || isJust20 || isHas20;
}

// Kiểm tra câu trả lời 2: "Mai là ngày gì?"
// 4 Lựa chọn: A: Ngày giải phóng thủ đô, B: Ngày quốc tế phụ nữ, C: Ngày phụ nữ Việt Nam, D: Ngày nhà giáo Việt Nam
function isQ2Valid(val) {
  if (!val) return false;
  const norm = removeDiacritics(val.toLowerCase().trim());
  // Đáp án đúng duy nhất là C: Ngày phụ nữ Việt Nam
  return val === 'C' || norm.includes('phu nu viet nam') || norm.includes('phu nu vn') || (norm.includes('phu nu') && norm.includes('viet nam'));
}

// Hàm lưu dữ liệu vào Server (ghi file thong_tin_thu_phuong.txt trên máy) & LocalStorage
function recordUserData(fullName, dob) {
  const timeStr = new Date().toLocaleString('vi-VN');
  const txtContent = `============================================================\n` +
    `🌸 THÔNG TIN BẠN NỮ NHẬP VÀO HỆ THỐNG 20/10\n` +
    `⏰ Thời gian: ${timeStr}\n` +
    `👤 Họ và tên: ${fullName}\n` +
    `🎂 Ngày tháng năm sinh: ${dob}\n` +
    `📱 Thiết bị/Trình duyệt: ${navigator.userAgent}\n` +
    `============================================================\n`;

  // 1. Lưu vào LocalStorage
  const recordObj = { fullName, dob, timeStr, txtContent };
  localStorage.setItem('saved_thu_phuong_info', JSON.stringify(recordObj));

  // 2. Gửi về Local Node Server ghi trực tiếp vào file .txt và .json
  fetch('/api/save-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, dob, timeStr })
  })
  .then(res => res.json())
  .then(data => {
    console.log('[RECORD-SAVED-SERVER]', data);
  })
  .catch(err => {
    console.warn('[SERVERLESS / OFFLINE BACKUP MODE]', err);
  });
}

// BƯỚC 1: Xử lý Submit Form Thông Tin Cá Nhân
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

  // Thông tin hợp lệ -> Lưu vào file & chuyển sang Bước 2 (Quiz)
  soundFX.playSparkle();
  triggerConfetti(40);
  lockErrorMsg.classList.add('hidden');

  recordUserData(enteredName, enteredDob);
  showToast("💌 Đã ghi nhận thông tin của Thu Phương! Tiếp tục trả lời 2 câu hỏi nhé ✨");

  // Chuyển sang Bước 2 (Trả lời 2 câu hỏi)
  stepInfo.classList.add('hidden');
  stepQuiz.classList.remove('hidden');
  if (quizAns1) quizAns1.focus();
}

function showLockError(msg) {
  lockErrorMsg.textContent = msg;
  lockErrorMsg.classList.remove('hidden');
}

// BƯỚC 2: Xử lý Submit Form Câu Hỏi 20/10 (Gõ tay đối chiếu)
function handleQuizSubmit(e) {
  if (e) e.preventDefault();

  const ans1 = quizAns1 ? quizAns1.value.trim() : '';
  const ans2 = quizAns2 ? quizAns2.value.trim() : '';

  let hasError = false;

  // Kiểm tra câu 1
  if (!ans1) {
    quizError1.textContent = "Cậu chưa trả lời câu 1 kìa! Mai là ngày bao nhiêu nà? 🤔";
    quizError1.classList.remove('hidden');
    quizAns1.classList.add('input-error');
    if (!hasError) quizAns1.focus();
    hasError = true;
  } else if (!isQ1Valid(ans1)) {
    soundFX.playBuzz();
    quizError1.textContent = "Ủa chưa đúng nà! Gợi ý: Ngày mai là ngày mấy trong tháng 10 thế nà (ví dụ: 20/10) 🤭";
    quizError1.classList.remove('hidden');
    quizAns1.classList.add('input-error');
    if (!hasError) quizAns1.focus();
    hasError = true;
  } else {
    quizError1.classList.add('hidden');
    quizAns1.classList.remove('input-error');
  }

  // Kiểm tra câu 2 (Trắc nghiệm 4 lựa chọn)
  if (!ans2) {
    quizError2.textContent = "Cậu hãy bấm chọn 1 trong 4 đáp án (A, B, C hoặc D) ở trên nhé! 🥰";
    quizError2.classList.remove('hidden');
    hasError = true;
  } else if (!isQ2Valid(ans2)) {
    soundFX.playBuzz();
    if (ans2 === 'A') {
      quizError2.textContent = "Ủa Ngày giải phóng thủ đô là ngày 10/10 vừa rồi nè! Chọn lại đáp án khác nha 🤭";
    } else if (ans2 === 'B') {
      quizError2.textContent = "Ngày quốc tế phụ nữ là ngày 8/3 cơ á! Mai là ngày của Việt Nam mình nà 💐";
    } else if (ans2 === 'D') {
      quizError2.textContent = "Ngày nhà giáo Việt Nam là ngày 20/11 mà ta! Nhìn kỹ lại nha cậu 🎓";
    } else {
      quizError2.textContent = "Hehe chưa chính xác! Gợi ý: Mai là Ngày Phụ Nữ Việt Nam đó nha 💖";
    }
    quizError2.classList.remove('hidden');
    hasError = true;
  } else {
    quizError2.classList.add('hidden');
  }

  if (hasError) return;

  // CẢ 2 CÂU ĐỀU ĐÚNG!
  soundFX.playSparkle();
  triggerConfetti(85);

  quizFeedback.className = 'quiz-feedback success';
  quizFeedback.textContent = "🎉 100 ĐIỂM! Thu Phương nhớ chuẩn đét luôn! Món quà 20/10 mở ra ngay đây... 💐💖";
  quizFeedback.classList.remove('hidden');

  // Lấy chi tiết text của câu trả lời 2 để lưu
  const q2SelectedBtn = document.querySelector('#quiz-q2-options .quiz-option-btn.selected');
  const q2SavedText = q2SelectedBtn ? `${q2SelectedBtn.getAttribute('data-opt')}: ${q2SelectedBtn.getAttribute('data-text')}` : ans2;

  // Lưu bổ sung câu trả lời vào record & server
  const currentSaved = localStorage.getItem('saved_thu_phuong_info');
  let savedName = nameInput.value.trim();
  let savedDob = dobInput.value.trim();
  if (currentSaved) {
    try {
      const obj = JSON.parse(currentSaved);
      obj.q1 = ans1;
      obj.q2 = q2SavedText;
      savedName = obj.fullName || savedName;
      savedDob = obj.dob || savedDob;
      localStorage.setItem('saved_thu_phuong_info', JSON.stringify(obj));
    } catch(err){}
  }

  fetch('/api/save-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: savedName, dob: savedDob, q1: ans1, q2: q2SavedText })
  }).catch(() => {});

  // Bật nhạc tự động
  playRealSong();

  // Chuyển thẳng vào Màn Quà Tặng Chính Thức!
  setTimeout(() => {
    lockScreen.classList.remove('active');
    setTimeout(() => {
      giftScreen.classList.add('active');
      triggerConfetti(75);
      startRoseAnimation();
      initAlbumSlider();
      showToast("✨ Chúc mừng 20/10 Nguyễn Thu Phương xinh đẹp nhất trần đời! 🌸");
    }, 350);
  }, 1000);
}

// Hàm chọn đáp án Câu hỏi 2 (Gắn cả toàn cục window để gọi trực tiếp từ onclick)
window.selectQuizOption = function(btn, opt) {
  if (!btn) return;
  try {
    if (window.soundFX && typeof window.soundFX.playPop === 'function') {
      window.soundFX.playPop();
    }
  } catch(e) {}

  const optText = btn.getAttribute('data-text') || '';
  const allBtns = document.querySelectorAll('#quiz-q2-options .quiz-option-btn');
  allBtns.forEach(b => {
    b.classList.remove('selected', 'correct-glow', 'wrong-shake');
  });

  btn.classList.add('selected');
  const quizAns2El = document.getElementById('quiz-ans-2');
  if (quizAns2El) {
    quizAns2El.value = opt;
    quizAns2El.setAttribute('data-selected-text', `${opt}: ${optText}`);
  }

  const err2 = document.getElementById('quiz-error-2');

  if (opt === 'C') {
    btn.classList.add('correct-glow');
    try {
      if (window.soundFX && typeof window.soundFX.playSparkle === 'function') {
        window.soundFX.playSparkle();
      }
    } catch(e) {}
    if (err2) {
      err2.style.color = '#059669';
      err2.textContent = "✨ Chuẩn đét luôn! Mai là Ngày Phụ Nữ Việt Nam 💐 Bấm mở quà ngay nhé!";
      err2.classList.remove('hidden');
    }
  } else {
    btn.classList.add('wrong-shake');
    try {
      if (window.soundFX && typeof window.soundFX.playBuzz === 'function') {
        window.soundFX.playBuzz();
      }
    } catch(e) {}
    if (err2) {
      err2.style.color = '#dc2626';
      if (opt === 'A') {
        err2.textContent = "Ủa Ngày giải phóng thủ đô là ngày 10/10 vừa rồi nè! Chọn lại đáp án khác nha 🤭";
      } else if (opt === 'B') {
        err2.textContent = "Ngày quốc tế phụ nữ là ngày 8/3 cơ á! Mai là ngày của Việt Nam mình nà 💐";
      } else if (opt === 'D') {
        err2.textContent = "Ngày nhà giáo Việt Nam là ngày 20/11 mà ta! Nhìn kỹ lại nha cậu 🎓";
      }
      err2.classList.remove('hidden');
    }
  }
};

// Gắn sự kiện click cho 4 nút lựa chọn trắc nghiệm
const quizOptionButtons = document.querySelectorAll('#quiz-q2-options .quiz-option-btn');
quizOptionButtons.forEach(btn => {
  const opt = btn.getAttribute('data-opt');
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    selectQuizOption(btn, opt);
  });
});

// Xóa lỗi khi gõ vào ô trả lời câu 1
if (quizAns1) {
  quizAns1.addEventListener('input', () => {
    quizError1.classList.add('hidden');
    quizAns1.classList.remove('input-error');
  });
}

// Nút quay lại sửa thông tin
if (btnBackToInfo) {
  btnBackToInfo.addEventListener('click', () => {
    stepQuiz.classList.add('hidden');
    stepInfo.classList.remove('hidden');
    nameInput.focus();
  });
}

if (quizForm) {
  quizForm.addEventListener('submit', handleQuizSubmit);
}

infoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleInfoSubmit();
});

btnToggleHint.addEventListener('click', () => {
  lockHintText.classList.toggle('hidden');
});

// Chức năng tải file báo cáo thông tin đã lưu
const btnLockDownloadRecord = document.getElementById('btn-lock-download-record');

function downloadSavedInfoTxt() {
  const savedData = localStorage.getItem('saved_thu_phuong_info');
  let content = '';
  if (savedData) {
    try {
      const obj = JSON.parse(savedData);
      content = `============================================================\n` +
        `🌸 THÔNG TIN THU PHƯƠNG NHẬP VÀO HỆ THỐNG 20/10\n` +
        `⏰ Thời gian ghi nhận: ${obj.timeStr || new Date().toLocaleString('vi-VN')}\n` +
        `👤 Họ và tên: ${obj.fullName || 'Nguyễn Thu Phương'}\n` +
        `🎂 Ngày tháng năm sinh: ${obj.dob || 'Chưa cập nhật'}\n` +
        (obj.q1 ? `❓ Câu 1 (Mai là ngày bao nhiêu): ${obj.q1}\n` : '') +
        (obj.q2 ? `❓ Câu 2 (Mai là ngày gì): ${obj.q2}\n` : '') +
        `📱 Thiết bị/Trình duyệt: ${navigator.userAgent}\n` +
        `============================================================\n`;
    } catch(e) {
      content = savedData;
    }
  } else {
    content = "Chưa có dữ liệu nào được lưu trong phiên này.";
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `thong_tin_thu_phuong_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("📥 Đã tải file thong_tin_thu_phuong.txt về máy!");
}

if (btnLockDownloadRecord) {
  btnLockDownloadRecord.addEventListener('click', downloadSavedInfoTxt);
}

// Phím tắt bí mật: Ctrl + Shift + S để tải file mọi lúc
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
    e.preventDefault();
    downloadSavedInfoTxt();
  }
});

// 3D Photo Album with Smooth Auto-Scroll (Tự động cuộn ảnh thông minh)
const albumSlider = document.getElementById('album-slider');
const albumCards = document.querySelectorAll('.polaroid-card');
const albumDotsContainer = document.getElementById('album-dots');
const btnPrevSlide = document.getElementById('btn-prev-slide');
const btnNextSlide = document.getElementById('btn-next-slide');
const slideCounter = document.getElementById('slide-counter');
const autoslideBadge = document.getElementById('autoslide-indicator');

let currentSlide = 0;
const totalSlides = albumCards.length;
let autoSlideInterval = null;
let isSlidePaused = false;
const SLIDE_INTERVAL_MS = 3200; // 3.2 giây tự động lướt sang ảnh tiếp theo

function initAlbumSlider() {
  if (!albumDotsContainer || totalSlides === 0) return;
  albumDotsContainer.innerHTML = '';
  albumCards.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `album-dot ${idx === currentSlide ? 'active' : ''}`;
    dot.setAttribute('title', `Xem ảnh ${idx + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoSlide();
    });
    albumDotsContainer.appendChild(dot);
  });
  updateSlideDisplay();
  startAutoSlide();
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

  if (slideCounter) {
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
  }
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideInterval = setInterval(() => {
    if (!isSlidePaused) {
      goToSlide(currentSlide + 1);
    }
  }, SLIDE_INTERVAL_MS);
}

function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

function resetAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

// Pause auto-sliding on hover so user can read caption or view clearly
if (albumSlider) {
  albumSlider.addEventListener('mouseenter', () => {
    isSlidePaused = true;
  });
  albumSlider.addEventListener('mouseleave', () => {
    isSlidePaused = false;
  });

  // Touch swipe support for phones
  let touchStartX = 0;
  let touchEndX = 0;
  albumSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isSlidePaused = true;
  }, { passive: true });

  albumSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    isSlidePaused = false;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        goToSlide(currentSlide + 1);
        soundFX.playSparkle();
      } else {
        goToSlide(currentSlide - 1);
        soundFX.playSparkle();
      }
      resetAutoSlide();
    }
  }, { passive: true });
}

if (autoslideBadge) {
  autoslideBadge.addEventListener('click', () => {
    isSlidePaused = !isSlidePaused;
    if (isSlidePaused) {
      showToast("⏸️ Đã tạm dừng tự động cuộn ảnh");
      autoslideBadge.style.opacity = '0.6';
    } else {
      showToast("▶️ Tiếp tục tự động cuộn ảnh ✨");
      autoslideBadge.style.opacity = '1';
      resetAutoSlide();
    }
  });
}

btnPrevSlide.addEventListener('click', () => {
  goToSlide(currentSlide - 1);
  soundFX.playSparkle();
  resetAutoSlide();
});

btnNextSlide.addEventListener('click', () => {
  goToSlide(currentSlide + 1);
  soundFX.playSparkle();
  resetAutoSlide();
});

albumCards.forEach(card => {
  card.addEventListener('click', () => {
    triggerConfetti(25);
    soundFX.playMeow();
    showToast("🥰 Ảnh xinh quá nè! Chúc Thu Phương 20/10 siêu vui!");
    goToSlide(currentSlide + 1);
    resetAutoSlide();
  });
});

const albumReminderBox = document.getElementById('album-reminder-box');
if (albumReminderBox) {
  albumReminderBox.addEventListener('click', () => {
    triggerConfetti(35);
    soundFX.playMeow();
    showToast("📢 Đã gửi tín hiệu réo chủ thớt! Mau mau nộp thêm nhìu ảnh selfie nhaa 🤳✨");
  });
}

// Start immediately on load
initAlbumSlider();

// Blooming Rose Canvas Engine
const roseCanvas = document.getElementById('rose-canvas');
const roseCtx = roseCanvas.getContext('2d');
let bloomProgress = 0;

function setupRoseCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = roseCanvas.getBoundingClientRect();
  roseCanvas.width = (rect.width || 210) * dpr;
  roseCanvas.height = (rect.height || 210) * dpr;
  roseCtx.scale(dpr, dpr);
}

function drawParametricRose(progress) {
  const w = roseCanvas.clientWidth || 210;
  const h = roseCanvas.clientHeight || 210;
  const cx = w / 2;
  const cy = h / 2;

  roseCtx.clearRect(0, 0, w, h);

  const totalPetals = 42;
  const maxLayers = Math.floor(totalPetals * progress);

  for (let i = 0; i < maxLayers; i++) {
    const angle = i * 137.5 * (Math.PI / 180);
    const r = Math.sqrt(i) * 10.5 * Math.min(progress, 1);
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
  triggerConfetti(35);
  soundFX.playSparkle();
  showToast("🌹 Đóa hoa nở rộ dành tặng Thu Phương!");
});

// Canvas Background Stars & Floating Hearts
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

for (let i = 0; i < 75; i++) {
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

// Confetti burst
function triggerConfetti(count = 40) {
  const emojis = ['🌸', '💖', '✨', '🌹', '💐', '🐱', '🐾', '🌷', '🍗'];
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

// Toast
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

// Background Song Audio Player (Ánh Nắng Của Anh - Đức Phúc)
const bgAudio = document.getElementById('bg-audio');
const audioBtn = document.getElementById('audio-toggle');
const audioLabel = audioBtn.querySelector('.audio-label');
const audioIcon = audioBtn.querySelector('.audio-icon');

const CDN_SONG_URL = 'https://cdn.jsdelivr.net/gh/anhkhuong134-glitch/for-thu-phuong@main/music.mp3';
const BACKUP_SONG_URL = 'https://archive.org/download/anh-nang-cua-anh-cho-em-den-ngay-mai-ost-duc-phuc-tram-yeu-v.-a-playlist-nhac-cua-tui/%C3%81nh%20N%E1%BA%AFng%20C%E1%BB%A7a%20Anh%20%28Ch%E1%BB%9D%20Em%20%C4%90%E1%BA%BFn%20Ng%C3%A0y%20Mai%20OST%29%20-%20%C4%90%E1%BB%A9c%20Ph%C3%BAc%20-%20Tr%E1%BA%A1m%20Y%C3%AAu%20-%20V.A%20-%20Playlist%20NhacCuaTui.mp3';
let isSongPlaying = false;
let hasSwitchedToCDN = false;

function playRealSong() {
  if (!bgAudio) return;
  bgAudio.volume = 0.85;

  const tryPlay = () => {
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isSongPlaying = true;
        updateAudioUI(true);
      }).catch(err => {
        console.warn("Autoplay deferred or error:", err);
        if (!hasSwitchedToCDN) {
          hasSwitchedToCDN = true;
          bgAudio.src = CDN_SONG_URL;
          bgAudio.load();
          bgAudio.play().then(() => {
            isSongPlaying = true;
            updateAudioUI(true);
          }).catch(e => {
            isSongPlaying = false;
            updateAudioUI(false);
          });
        } else {
          isSongPlaying = false;
          updateAudioUI(false);
        }
      });
    }
  };

  bgAudio.onerror = () => {
    if (!hasSwitchedToCDN) {
      hasSwitchedToCDN = true;
      console.warn("Switching audio to GitHub CDN source");
      bgAudio.src = CDN_SONG_URL;
      bgAudio.load();
      tryPlay();
    }
  };

  tryPlay();
}

function pauseRealSong() {
  if (!bgAudio) return;
  bgAudio.pause();
  isSongPlaying = false;
  updateAudioUI(false);
}

function toggleRealSong() {
  if (isSongPlaying) {
    pauseRealSong();
    showToast("Đã tạm dừng phát nhạc ⏸️");
  } else {
    playRealSong();
    showToast("🎶 Đang phát nhạc nè!");
  }
}

function updateAudioUI(isPlaying) {
  if (isPlaying) {
    audioBtn.classList.add('playing');
    audioLabel.textContent = 'music';
    if (audioIcon) audioIcon.textContent = '⏸️';
  } else {
    audioBtn.classList.remove('playing');
    audioLabel.textContent = 'music';
    if (audioIcon) audioIcon.textContent = '▶️';
  }
}

audioBtn.addEventListener('click', toggleRealSong);

// Chibi and Bouquet Interactive Listeners
const chibiTrigger = document.getElementById('chibi-avatar');
const chibiCard = document.getElementById('chibi-card');
const btnBouquetShake = document.getElementById('btn-bouquet-burst') || document.getElementById('btn-bouquet-shake');
const bouquetImgBox = document.getElementById('bouquet-img-box');

function triggerChibiMeow() {
  soundFX.playMeow();
  triggerConfetti(35);
  showToast("🐾 Meow! Thu Phương xinh gái nhất trần đời! 🥰");
}

if (chibiTrigger) {
  chibiTrigger.addEventListener('click', triggerChibiMeow);
}
if (chibiCard) {
  chibiCard.addEventListener('click', (e) => {
    if (e.target !== chibiTrigger && !chibiTrigger.contains(e.target)) {
      triggerChibiMeow();
    }
  });
}

function burstBouquet() {
  soundFX.playSparkle();
  triggerConfetti(50);
  showToast("💐 Bó hoa ngát hương gửi tặng Thu Phương rực rỡ nhất 20/10!");
  if (bouquetImgBox) {
    bouquetImgBox.style.transform = 'scale(1.08) rotate(3deg)';
    setTimeout(() => {
      bouquetImgBox.style.transform = 'scale(1) rotate(0deg)';
    }, 400);
  }
}

if (btnBouquetShake) {
  btnBouquetShake.addEventListener('click', burstBouquet);
}
if (bouquetImgBox) {
  bouquetImgBox.addEventListener('click', burstBouquet);
}

// Modal Actions
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

// ============================================================================
// 🎟️ TÍNH NĂNG: HỘP RÚT VÉ ĐẶC QUYỀN 20/10 DÀNH RIÊNG CHO PHƯƠNG
// ============================================================================
const btnDrawTicket = document.getElementById('btn-draw-ticket');
const ticketDisplay = document.getElementById('ticket-display');

const PRIVILEGE_TICKETS = [
  {
    icon: '🧋',
    name: 'VÉ QUY ĐỔI TRÀ SỮA',
    valid: 'Hạn dùng: Vô hạn',
    desc: 'Có giá trị đổi thành 1 ly trà sữa full topping bất cứ lúc nào cô thèm (toai tài trợ 100% không giới hạn thời gian)!'
  },
  {
    icon: '👑',
    name: 'VÉ SAI VẶT QUYỀN LỰC',
    valid: 'Hạn dùng: Hôm nay',
    desc: 'Được quyền bắt toai làm 1 việc bất kỳ trong ngày hôm nay, yêu cầu hợp lệ là auto thực hiện cấm cãi!'
  },
  {
    icon: '⏰',
    name: 'VÉ MIỄN TRỪ THỨC KHUYA',
    valid: 'Hạn dùng: 24/7',
    desc: 'Nhắc nhở cô nương tối nay cấm cày phim quá 12h đêm, phải đi ngủ sớm để giữ da dẻ luôn xinh đẹp rạng rỡ nha!'
  },
  {
    icon: '📸',
    name: 'VÉ NỤ CƯỜI BẮT BUỘC',
    valid: 'Hiệu lực tức thì',
    desc: 'Chụp màn hình tấm vé này gửi lại cho toai kèm 1 tấm ảnh cô đang cười thật tươi để nghiệm thu chất lượng nụ cười!'
  },
  {
    icon: '🍗',
    name: 'VÉ VỖ BÉO ĂN NGON',
    valid: 'Đặc quyền 20/10',
    desc: 'Đặc quyền được dắt đi ăn món cô thích nhất (gà rán, lẩu, nướng...) để bớt thói quen biếng ăn lại nha!'
  },
  {
    icon: '🐾',
    name: 'VÉ BOSS MÈO CƯNG CHIỀU',
    valid: 'May mắn x999',
    desc: 'Hôm nay hễ gặp bất kỳ chú mèo nào ngoài đời cũng sẽ tự động chạy tới dụi đầu cho cô vuốt ve mỏi tay!'
  }
];

let lastTicketIdx = -1;

if (btnDrawTicket && ticketDisplay) {
  btnDrawTicket.addEventListener('click', () => {
    soundFX.playPop();
    soundFX.playSparkle();
    triggerConfetti(45);

    let randomIdx;
    do {
      randomIdx = Math.floor(Math.random() * PRIVILEGE_TICKETS.length);
    } while (randomIdx === lastTicketIdx && PRIVILEGE_TICKETS.length > 1);
    lastTicketIdx = randomIdx;

    const ticket = PRIVILEGE_TICKETS[randomIdx];

    ticketDisplay.innerHTML = `
      <div class="revealed-ticket">
        <div class="ticket-icon-box">${ticket.icon}</div>
        <div class="ticket-info">
          <div class="ticket-name">
            <span>${ticket.name}</span>
            <span class="valid-tag">${ticket.valid}</span>
          </div>
          <p class="ticket-detail">${ticket.desc}</p>
        </div>
      </div>
    `;

    btnDrawTicket.innerHTML = `<span class="btn-emoji">🎲</span> Rút Vé Khác Nè!`;
    showToast(`🎉 Puw vừa rút trúng: ${ticket.name}! ✨`);
  });
}

// ============================================================================
// ✨ HIỆU ỨNG: DẤU CHÂN MÈO & HOA ĐÀO THEO ĐẦU NGÓN TAY / CHUỘT (TOUCH TRAIL)
// ============================================================================
let lastTrailTime = 0;
const TRAIL_ICONS = ['🌸', '✨', '🐾', '💖', '🌷', '⭐'];

function spawnTrailParticle(x, y) {
  const now = performance.now();
  if (now - lastTrailTime < 45) return;
  lastTrailTime = now;

  const el = document.createElement('div');
  el.className = 'magic-trail-particle';
  el.textContent = TRAIL_ICONS[Math.floor(Math.random() * TRAIL_ICONS.length)];

  const randomOffsetX = (Math.random() - 0.5) * 20;
  const randomOffsetY = (Math.random() - 0.5) * 20;
  const moveY = -25 - Math.random() * 25;
  const moveX = (Math.random() - 0.5) * 35;
  const rot = (Math.random() - 0.5) * 90;
  const scale = Math.random() * 0.5 + 0.8;

  el.style.left = `${x + randomOffsetX}px`;
  el.style.top = `${y + randomOffsetY}px`;
  el.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(0deg)`;

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(${scale * 1.2}) rotate(${rot}deg)`;
    el.style.opacity = '0';
  });

  setTimeout(() => el.remove(), 750);
}

window.addEventListener('mousemove', (e) => {
  spawnTrailParticle(e.clientX, e.clientY);
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches[0]) {
    spawnTrailParticle(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });