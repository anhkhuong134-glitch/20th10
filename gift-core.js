(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GiftCore = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const moments = Object.freeze({
    smile: { label: 'Một nụ cười', debit: 'Nụ cười của Phương', credit: 'Niềm vui của người gửi', note: 'Một nụ cười của cậu, bên này tự nhiên cũng thấy vui.' },
    meal: { label: 'Một bữa ngon', debit: 'Năng lượng cho Phương', credit: 'Một chút yên tâm', note: 'Hôm nay nhớ ăn ngon nhé. Có người vẫn để ý chuyện cậu hay bỏ bữa đó.' },
    exam: { label: 'Thi xong một môn', debit: 'Một chút nhẹ nhõm', credit: 'Thêm một điều tự hào', note: 'Mỗi môn đi qua là một lần cậu đã rất cố gắng rồi.' },
    rest: { label: 'Một ngày hơi mệt', debit: 'Thời gian nghỉ ngơi', credit: 'Một người lắng nghe', note: 'Không cần lúc nào cũng cân hết mọi thứ. Mệt thì cho mình nghỉ một chút nha.' }
  });
  function recordMoment(current, id) {
    const clean = Array.isArray(current) ? [...new Set(current.filter(key => Object.hasOwn(moments, key)))] : [];
    return Object.hasOwn(moments, id) && !clean.includes(id) ? [...clean, id] : clean;
  }
  function ledgerRows(current) {
    return recordMoment(current, null).flatMap(id => [
      { account: moments[id].debit, debit: 1, credit: 0, moment: id },
      { account: moments[id].credit, debit: 0, credit: 1, moment: id }
    ]);
  }
  function ledgerTotals(current) {
    return ledgerRows(current).reduce((sum, row) => ({ debit: sum.debit + row.debit, credit: sum.credit + row.credit }), { debit: 0, credit: 0 });
  }
  function restoreLedger(raw) {
    try {
      const saved = JSON.parse(raw);
      return saved && saved.version === 1 && Array.isArray(saved.moments) ? recordMoment(saved.moments, null) : [];
    } catch { return []; }
  }
  function slideIndex(index, count) {
    return Number.isInteger(count) && count > 0 && Number.isFinite(index) ? ((Math.trunc(index) % count) + count) % count : 0;
  }
  function shouldAutoplay(state = {}) {
    return !state.userPaused && !state.hovered && !state.lightboxOpen && !state.documentHidden && !state.reducedMotion;
  }
  function isAlbumFileAllowed(file) {
    return Boolean(file && ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) && Number.isFinite(file.size) && file.size > 0 && file.size <= 8 * 1024 * 1024);
  }
  return Object.freeze({ moments, recordMoment, ledgerRows, ledgerTotals, restoreLedger, slideIndex, shouldAutoplay, isAlbumFileAllowed });
});
