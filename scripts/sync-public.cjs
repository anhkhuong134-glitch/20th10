const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public');
fs.mkdirSync(output, { recursive: true });
for (const file of ['index.html', 'style.css', 'script.js', 'studio.css', 'studio.js', 'gift-core.js', 'favicon.svg', 'avatar.jpg', 'bouquet.jpg', 'chibi.jpg', 'photo1.png', 'photo2.png', 'photo3.png', 'photo4.png', 'music.mp3']) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}
fs.cpSync(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
console.log('Root và public đã đồng bộ, gồm toàn bộ ảnh, nhạc và lớp nâng cấp.');
