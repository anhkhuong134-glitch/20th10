const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../gift-core.js');

test('một nụ cười tạo đúng một cặp phát sinh Nợ/Có, bấm lại không ghi trùng', () => {
  assert.equal(typeof core.recordMoment, 'function');
  const before = [];
  const first = core.recordMoment(before, 'smile');
  const second = core.recordMoment(first, 'smile');
  assert.deepEqual(before, []);
  assert.deepEqual(second, ['smile']);
  assert.deepEqual(core.ledgerTotals(second), { debit: 1, credit: 1 });
});

test('bốn khoảnh khắc cân bằng ở 4/4 và bỏ qua mã không có thật', () => {
  assert.equal(typeof core.recordMoment, 'function');
  let moments = [];
  for (const id of ['smile', 'meal', 'exam', 'rest', 'not-real']) moments = core.recordMoment(moments, id);
  assert.deepEqual(moments, ['smile', 'meal', 'exam', 'rest']);
  assert.deepEqual(core.ledgerTotals(moments), { debit: 4, credit: 4 });
  assert.equal(core.ledgerRows(moments).length, 8);
  assert.deepEqual(core.ledgerRows(['smile'])[0], { account: 'Nụ cười của Phương', debit: 1, credit: 0, moment: 'smile' });
  assert.deepEqual(core.ledgerRows(['smile'])[1], { account: 'Niềm vui của người gửi', debit: 0, credit: 1, moment: 'smile' });
});

test('khôi phục sổ an toàn khi dữ liệu hỏng, lặp hoặc thuộc phiên bản khác', () => {
  assert.equal(typeof core.restoreLedger, 'function');
  assert.deepEqual(core.restoreLedger('bad json'), []);
  assert.deepEqual(core.restoreLedger('{"version":1,"moments":["smile","smile","meal","no"]}'), ['smile', 'meal']);
  assert.deepEqual(core.restoreLedger('{"version":2,"moments":["smile"]}'), []);
  assert.deepEqual(core.restoreLedger('{"version":1,"moments":"smile"}'), []);
});

test('album vòng về đầu/cuối đúng, kể cả sau khi thêm ảnh', () => {
  assert.equal(typeof core.slideIndex, 'function');
  assert.equal(core.slideIndex(-1, 5), 4);
  assert.equal(core.slideIndex(5, 5), 0);
  assert.equal(core.slideIndex(6, 7), 6);
  assert.equal(core.slideIndex(7, 7), 0);
  assert.equal(core.slideIndex(1, 0), 0);
});

test('rời chuột khỏi album không được xóa lựa chọn tạm dừng của người xem', () => {
  assert.equal(typeof core.shouldAutoplay, 'function');
  assert.equal(core.shouldAutoplay({ userPaused: true, hovered: false }), false);
  assert.equal(core.shouldAutoplay({ userPaused: false, hovered: true }), false);
  assert.equal(core.shouldAutoplay({ userPaused: false, lightboxOpen: true }), false);
  assert.equal(core.shouldAutoplay({ userPaused: false, documentHidden: true }), false);
  assert.equal(core.shouldAutoplay({ userPaused: false, reducedMotion: true }), false);
  assert.equal(core.shouldAutoplay({ userPaused: false, hovered: false }), true);
});

test('thêm ảnh chấp nhận ảnh raster tối đa 8 MB và từ chối dữ liệu không hợp lệ', () => {
  assert.equal(typeof core.isAlbumFileAllowed, 'function');
  assert.equal(core.isAlbumFileAllowed({ type: 'image/png', size: 8 * 1024 * 1024 }), true);
  assert.equal(core.isAlbumFileAllowed({ type: 'image/jpeg', size: 100 }), true);
  assert.equal(core.isAlbumFileAllowed({ type: 'image/png', size: 8 * 1024 * 1024 + 1 }), false);
  assert.equal(core.isAlbumFileAllowed({ type: 'image/svg+xml', size: 100 }), false);
  assert.equal(core.isAlbumFileAllowed({ type: 'text/html', size: 100 }), false);
  assert.equal(core.isAlbumFileAllowed({ type: 'image/png', size: 0 }), false);
});
