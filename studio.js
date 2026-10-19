(function () {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const wrapper = $('.gift-wrapper');
  const grid = $('.gift-main-grid');
  const albumSection = $('#album-section');
  // Keep the exact original album nodes and listeners; give the album its own full-width chapter.
  wrapper.insertBefore(albumSection, grid);
  wrapper.insertBefore($('#emotion-ledger-template').content.cloneNode(true), grid);
  const ledgerKey = 'puw.keepsake.ledger.v1';
  let recordedMoments = GiftCore.restoreLedger(readSavedValue(ledgerKey));
  let latestMoment = null;

  function renderJournal() {
    const rows = $('#journal-rows');
    rows.replaceChildren();
    const entries = GiftCore.ledgerRows(recordedMoments);
    if (!entries.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 3;
      td.className = 'journal-empty';
      td.textContent = 'Những điều dễ thương hôm nay đang chờ được ghi nhận…';
      tr.append(td);
      rows.append(tr);
    }
    entries.forEach((entry, index) => {
      const tr = document.createElement('tr');
      if (index % 2) tr.className = 'pair-end';
      const account = document.createElement('td');
      account.textContent = entry.account;
      if (entry.credit) account.className = 'credit-account';
      tr.append(account);
      for (const value of [entry.debit, entry.credit]) {
        const td = document.createElement('td');
        td.textContent = value || '—';
        tr.append(td);
      }
      rows.append(tr);
    });
    const totals = GiftCore.ledgerTotals(recordedMoments);
    $('#debit-total').textContent = totals.debit;
    $('#credit-total').textContent = totals.credit;
    $('#save-ledger').disabled = recordedMoments.length === 0;
    $('#reset-ledger').disabled = recordedMoments.length === 0;
    $$('[data-moment]').forEach(button => {
      const selected = recordedMoments.includes(button.dataset.moment);
      button.setAttribute('aria-pressed', String(selected));
      $('i', button).textContent = selected ? '✓' : '＋';
    });
    $('#moment-note').textContent = latestMoment ? GiftCore.moments[latestMoment].note : recordedMoments.length ? 'Những điều cậu đã ghi vẫn được giữ ở đây, trên trình duyệt này.' : 'Chọn một điều ở bên cạnh để ghi vào sổ nhé.';
  }
  $$('[data-moment]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.moment;
    const previousCount = recordedMoments.length;
    recordedMoments = GiftCore.recordMoment(recordedMoments, id);
    latestMoment = id;
    saveValue(ledgerKey, JSON.stringify({ version: 1, moments: recordedMoments }));
    renderJournal();
    if (recordedMoments.length > previousCount) {
      const stamp = $('#balanced-stamp');
      stamp.classList.remove('stamped');
      requestAnimationFrame(() => stamp.classList.add('stamped'));
      soundFX.playPop();
    }
  }));
  $('#reset-ledger').addEventListener('click', () => {
    recordedMoments = [];
    latestMoment = null;
    saveValue(ledgerKey, JSON.stringify({ version: 1, moments: [] }));
    renderJournal();
    showToast('Trang sổ đã sẵn sàng cho những điều dễ thương mới.');
  });
  renderJournal();

  function renderThumbnails() {
    const holder = $('#album-thumbnails');
    holder.replaceChildren();
    albumCards.forEach((card, index) => {
      const original = $('img', card);
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Xem ảnh ${index + 1}: ${$('.caption-title', card).textContent.trim()}`);
      const img = document.createElement('img');
      img.src = original.src;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      button.append(img);
      button.addEventListener('click', () => { goToSlide(index); resetAutoSlide(); });
      holder.append(button);
      original.decoding = 'async';
      original.loading = 'lazy';
      if (!card.dataset.keyboardBound) {
        card.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); }
          if (event.key === 'ArrowRight') { event.preventDefault(); goToSlide(currentSlide + 1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); goToSlide(currentSlide - 1); }
        });
        card.dataset.keyboardBound = 'true';
      }
    });
    syncThumbnails();
  }
  function syncThumbnails() {
    $$('#album-thumbnails button').forEach((button, index) => button.setAttribute('aria-current', String(index === currentSlide)));
  }
  window.addEventListener('albumchange', syncThumbnails);
  renderThumbnails();

  const lightbox = $('#photo-lightbox');
  function updateLargePhoto() {
    const card = albumCards[currentSlide];
    const photo = $('img', card);
    $('#large-photo').src = photo.src;
    $('#large-photo').alt = photo.alt;
    $('#large-photo-caption').textContent = `${$('.caption-title', card).textContent.trim()} · ${currentSlide + 1}/${totalSlides}`;
  }
  $('#view-photo').addEventListener('click', () => { updateLargePhoto(); lightbox.showModal(); });
  $('[data-close-photo]').addEventListener('click', () => lightbox.close());
  $('#large-photo-prev').addEventListener('click', () => { goToSlide(currentSlide - 1); updateLargePhoto(); });
  $('#large-photo-next').addEventListener('click', () => { goToSlide(currentSlide + 1); updateLargePhoto(); });
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      goToSlide(currentSlide + (event.key === 'ArrowLeft' ? -1 : 1));
      updateLargePhoto();
    }
  });
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

  const upload = $('#album-upload-input');
  const localImageUrls = new Set();
  $('#btn-quick-upload').addEventListener('click', event => { event.stopPropagation(); upload.click(); });
  upload.accept = 'image/jpeg,image/png,image/webp,image/gif';
  upload.addEventListener('change', async () => {
    const files = Array.from(upload.files || []);
    let added = 0;
    let rejected = 0;
    for (const file of files) {
      if (!GiftCore.isAlbumFileAllowed(file) || albumCards.length >= 20) { rejected++; continue; }
      const url = URL.createObjectURL(file);
      const readable = await new Promise(resolve => {
        const probe = new Image();
        probe.onload = () => resolve(true);
        probe.onerror = () => resolve(false);
        probe.src = url;
      });
      if (!readable) { URL.revokeObjectURL(url); rejected++; continue; }
      const card = albumCards[0].cloneNode(true);
      card.classList.remove('active');
      delete card.dataset.keyboardBound;
      card.dataset.index = String(albumCards.length);
      const photo = $('img', card);
      photo.src = url;
      photo.alt = `Ảnh Phương vừa thêm: ${file.name}`;
      $('.caption-title', card).textContent = 'Phương của những ngày thường';
      $('.caption-sub', card).textContent = file.name.replace(/\.[^.]+$/, '');
      $('.photo-badge', card).textContent = 'Ảnh cô vừa thêm';
      card.addEventListener('click', () => { goToSlide(currentSlide + 1); triggerConfetti(15); resetAutoSlide(); });
      albumSlider.append(card);
      albumCards.push(card);
      localImageUrls.add(url);
      added++;
    }
    totalSlides = albumCards.length;
    if (added) {
      currentSlide = totalSlides - added;
      initAlbumSlider();
      renderThumbnails();
      showToast(`Đã thêm ${added} ảnh vào lượt xem này.${rejected ? ' Một số file không phù hợp nên chưa thêm.' : ''}`);
    } else if (rejected) showToast('Chọn ảnh JPG, PNG, WebP hoặc GIF, tối đa 8 MB/ảnh. Album chứa tối đa 20 ảnh trong lượt xem.');
    upload.value = '';
  });
  window.addEventListener('beforeunload', () => localImageUrls.forEach(url => URL.revokeObjectURL(url)));

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    let line = '';
    for (const word of text.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else line = next;
    }
    if (line) ctx.fillText(line, x, y);
    return y + lineHeight;
  }
  async function saveKeepsake(kind) {
    await document.fonts.ready;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = kind === 'ledger' ? 1400 : 1360;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fbf7f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#d9c6c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(52, 52, 1096, canvas.height - 104);
    ctx.fillStyle = '#874c61';
    ctx.font = '25px "Be Vietnam Pro", sans-serif';
    ctx.fillText('DÀNH RIÊNG CHO NGUYỄN THU PHƯƠNG', 95, 125);
    ctx.fillStyle = '#402536';
    ctx.font = '600 76px "Cormorant Garamond", Georgia';
    let y = wrapText(ctx, kind === 'ledger' ? 'Sổ cái của những điều dễ thương.' : 'Một chiếc vé, rất nhiều quan tâm.', 95, 240, 980, 84);
    ctx.fillStyle = '#9c7686';
    ctx.font = '24px "Be Vietnam Pro", sans-serif';
    ctx.fillText('Kỷ niệm ngày 20 tháng 10', 95, y + 25);
    y += 110;
    if (kind === 'ledger') {
      ctx.font = '25px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = '#75666c';
      ctx.fillText('Diễn giải', 95, y);
      ctx.fillText('Nợ', 880, y);
      ctx.fillText('Có', 1015, y);
      y += 37;
      for (const row of GiftCore.ledgerRows(recordedMoments)) {
        ctx.strokeStyle = '#dfcdd1';
        ctx.beginPath(); ctx.moveTo(95, y); ctx.lineTo(1105, y); ctx.stroke();
        ctx.font = '24px "Be Vietnam Pro", sans-serif';
        ctx.fillStyle = row.credit ? '#8c6b7b' : '#402536';
        ctx.fillText(row.account, row.credit ? 125 : 95, y + 43);
        ctx.fillText(String(row.debit || '—'), 890, y + 43);
        ctx.fillText(String(row.credit || '—'), 1025, y + 43);
        y += 69;
      }
      const total = GiftCore.ledgerTotals(recordedMoments);
      ctx.fillStyle = '#eddee3'; ctx.fillRect(90, y + 5, 1020, 75);
      ctx.fillStyle = '#402536'; ctx.font = '600 26px "Be Vietnam Pro", sans-serif';
      ctx.fillText('Tổng phát sinh', 110, y + 54);
      ctx.fillText(String(total.debit), 890, y + 54);
      ctx.fillText(String(total.credit), 1025, y + 54);
      ctx.fillStyle = '#57715e'; ctx.font = '600 47px "Cormorant Garamond", Georgia';
      ctx.fillText('Đã cân bằng. Còn quan tâm thì không cần cân đong.', 95, y + 153);
    } else {
      const ticket = $('.revealed-ticket', ticketDisplay);
      if (!ticket) return;
      ctx.fillStyle = '#f0dfe3'; ctx.fillRect(95, y - 20, 1010, 620);
      ctx.fillStyle = '#402536'; ctx.font = '600 48px "Cormorant Garamond", Georgia';
      y = wrapText(ctx, $('.ticket-name > span', ticket).textContent, 145, y + 70, 900, 60);
      ctx.fillStyle = '#874c61'; ctx.font = '24px "Be Vietnam Pro", sans-serif';
      y = wrapText(ctx, $('.valid-tag', ticket).textContent, 145, y + 35, 900, 39);
      ctx.fillStyle = '#68515d'; ctx.font = '30px "Be Vietnam Pro", sans-serif';
      wrapText(ctx, $('.ticket-detail', ticket).textContent, 145, y + 45, 900, 51);
    }
    ctx.fillStyle = '#987585'; ctx.font = 'italic 34px "Cormorant Garamond", Georgia';
    ctx.fillText('Có một khoản quan tâm, không tính lãi.', 95, canvas.height - 120);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) { showToast('Chưa lưu được ảnh. Cô thử lại nhé.'); return; }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = kind === 'ledger' ? 'so-de-thuong-cua-phuong-20-10.png' : 've-dac-quyen-cua-phuong-20-10.png';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast('Ảnh kỷ niệm đã sẵn sàng để lưu về máy.');
  }
  $('#save-ledger').addEventListener('click', () => saveKeepsake('ledger').catch(() => showToast('Chưa lưu được trang sổ. Cô thử lại nhé.')));
  $('#save-ticket').addEventListener('click', () => saveKeepsake('ticket').catch(() => showToast('Chưa lưu được vé. Cô thử lại nhé.')));
  new MutationObserver(() => { $('#save-ticket').disabled = !$('.revealed-ticket', ticketDisplay); }).observe(ticketDisplay, { childList: true });

  const palette = $('#command-palette');
  const commandSearch = $('#command-search');
  let chosenCommand = 0;
  let filteredActions = [];
  const go = selector => {
    $(selector).scrollIntoView({ behavior: reducedMotionQuery.matches ? 'auto' : 'smooth', block: 'start' });
  };
  const giftActions = [
    { name: 'Mở cuốn album của Puw', key: 'Ảnh', run: () => go('#album-section') },
    { name: 'Ghi một bút toán dễ thương', key: 'Sổ', run: () => go('#emotion-ledger') },
    { name: 'Ngắm bó hoa và hoa hồng', key: 'Hoa', run: () => go('#flowers-section') },
    { name: 'Đọc lời nhắn gửi Phương', key: 'Thư', run: () => go('#letter-section') },
    { name: 'Rút vé đặc quyền', key: 'Quà', run: () => go('#wish-ticket-box') },
    { name: 'Mở thông điệp bí mật', key: 'Bí mật', run: () => btnSecretMsg.click() },
    { name: 'Bật hoặc tắt bài hát', key: 'Nhạc', run: () => audioBtn.click() }
  ];
  function drawCommands() {
    const query = removeDiacritics(commandSearch.value);
    const actions = giftScreen.classList.contains('active') ? giftActions : [
      { name: 'Điền thông tin để mở món quà', key: 'Bắt đầu', run: () => nameInput.focus() },
      { name: 'Xem gợi ý tên', key: 'Gợi ý', run: () => btnToggleHint.click() },
      { name: 'Bật hoặc tắt bài hát', key: 'Nhạc', run: () => audioBtn.click() }
    ];
    filteredActions = actions.filter(action => removeDiacritics(action.name).includes(query));
    if (query === '=puw()' && giftScreen.classList.contains('active')) {
      filteredActions = [{ name: 'Công thức tìm thấy: Phương + nụ cười = một ngày đáng nhớ.', key: '♡', run: () => { showToast('Công thức này toai đã kiểm tra rất kỹ rồi đó. ♡'); triggerConfetti(25); } }];
    } else if ((query === '=balance()' || query === '=canbang()') && giftScreen.classList.contains('active')) {
      filteredActions = [{ name: 'Bảng cân đối: Nợ nụ cười = Có hạnh phúc. Số dư tuyệt đối!', key: '📊', run: () => { showToast('Báo cáo cảm xúc: Luôn cân bằng và rực rỡ nha Puw! 📊✨'); triggerConfetti(35); soundFX.playSparkle(); } }];
    } else if ((query === '=2010()' || query === '=20/10()') && giftScreen.classList.contains('active')) {
      filteredActions = [{ name: 'Ngày 20/10: Chúc Phương bớt biếng ăn, luôn rạng rỡ và ngập tràn niềm vui!', key: '🌸', run: () => { showToast('Happy Vietnamese Women\'s Day 20/10! 🌸💖'); triggerConfetti(45); soundFX.playSparkle(); } }];
    }
    chosenCommand = Math.min(chosenCommand, Math.max(0, filteredActions.length - 1));
    const results = $('#command-results');
    results.replaceChildren();
    filteredActions.forEach((action, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = index === chosenCommand ? 'chosen' : '';
      const name = document.createElement('span'); name.textContent = action.name;
      const key = document.createElement('kbd'); key.textContent = action.key;
      button.append(name, key);
      button.addEventListener('click', () => { palette.close(); action.run(); });
      results.append(button);
    });
    if (!filteredActions.length) {
      const empty = document.createElement('p'); empty.textContent = 'Thử tìm “album”, “hoa” hoặc “lời nhắn” nhé.'; empty.className = 'command-hint'; results.append(empty);
    }
  }
  function openPalette() {
    if (palette.open) { palette.close(); return; }
    if (secretModal.classList.contains('active') || lightbox.open) return;
    chosenCommand = 0;
    commandSearch.value = '';
    drawCommands();
    palette.showModal();
    commandSearch.focus();
  }
  $('#open-command').addEventListener('click', openPalette);
  $('[data-close-command]').addEventListener('click', () => palette.close());
  palette.addEventListener('click', event => { if (event.target === palette) palette.close(); });
  commandSearch.addEventListener('input', () => { chosenCommand = 0; drawCommands(); });
  palette.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      chosenCommand = GiftCore.slideIndex(chosenCommand + (event.key === 'ArrowDown' ? 1 : -1), filteredActions.length);
      drawCommands();
    } else if (event.key === 'Enter' && filteredActions[chosenCommand]) {
      event.preventDefault(); palette.close(); filteredActions[chosenCommand].run();
    }
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openPalette(); }
    if (event.key === 'Escape' && secretModal.classList.contains('active')) closeModal();
  });

  let secretWasOpen = false;
  function updateSecretAccessibility() {
    const active = secretModal.classList.contains('active');
    secretModal.setAttribute('aria-hidden', String(!active));
    secretModal.inert = !active;
    if (active && !secretWasOpen) modalClose.focus();
    if (!active && secretWasOpen) btnSecretMsg.focus();
    secretWasOpen = active;
  }
  secretModal.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = $$('button', secretModal);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  new MutationObserver(updateSecretAccessibility).observe(secretModal, { attributes: true, attributeFilter: ['class'] });
  updateSecretAccessibility();

  function syncFlow() {
    const unlocked = giftScreen.classList.contains('active');
    document.body.classList.toggle('gift-open', unlocked);
    const stage = unlocked ? 'gift' : stepQuiz.classList.contains('hidden') ? 'info' : 'quiz';
    $$('[data-flow-step]').forEach(item => {
      item.classList.toggle('current', item.dataset.flowStep === stage);
      if (item.dataset.flowStep === stage) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    const hint = unlocked ? 'Tìm album, hoa, lời nhắn…' : 'Tìm gợi ý hoặc bắt đầu…';
    commandSearch.placeholder = hint;
  }
  const flowObserver = new MutationObserver(syncFlow);
  flowObserver.observe(giftScreen, { attributes: true, attributeFilter: ['class'] });
  flowObserver.observe(stepQuiz, { attributes: true, attributeFilter: ['class'] });
  syncFlow();
  $('#hero-book').addEventListener('click', () => { go('#album-section'); soundFX.playSparkle(); });
  if (matchMedia('(pointer: fine)').matches && !reducedMotionQuery.matches) {
    const book = $('#hero-book');
    let tiltFrame = null;
    book.addEventListener('pointermove', event => {
      if (tiltFrame) return;
      tiltFrame = requestAnimationFrame(() => {
        const bounds = book.getBoundingClientRect();
        book.style.setProperty('--book-rx', `${((event.clientY - bounds.top) / bounds.height - .5) * -8}deg`);
        book.style.setProperty('--book-ry', `${((event.clientX - bounds.left) / bounds.width - .5) * 10}deg`);
        tiltFrame = null;
      });
    });
    book.addEventListener('pointerleave', () => { book.style.setProperty('--book-rx', '0deg'); book.style.setProperty('--book-ry', '0deg'); });
  }
  for (const [element, label] of [[chibiCard, 'Chạm để nghe tiếng meow và nhận tim'], [bouquetImgBox, 'Chạm để nhận bó hoa'], [roseCanvas, 'Chạm để hoa hồng bung nở']]) {
    element.setAttribute('role', 'button');
    element.tabIndex = 0;
    element.setAttribute('aria-label', label);
    element.addEventListener('keydown', event => {
      if (event.target === element && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); element.click(); }
    });
  }
  let roseResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(roseResizeTimer);
    roseResizeTimer = setTimeout(() => { if (giftScreen.classList.contains('active')) { setupRoseCanvas(); drawParametricRose(1); } }, 150);
  });
  if (reducedMotionQuery.matches) {
    autoslideBadge.innerHTML = '<span class="autoslide-dot"></span> Chuyển ảnh bằng tay';
    autoslideBadge.setAttribute('aria-pressed', 'false');
  }
})();
