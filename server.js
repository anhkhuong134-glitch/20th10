const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg'
};

function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  let reqPath = decodeURIComponent((req.url || '/').split('?')[0]);

  // API endpoint to save submitted information
  if (req.method === 'POST' && reqPath === '/api/save-info') {
    return handleApiSaveInfo(req, res);
  }

  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const total = stats.size;
    const range = req.headers.range;

    if (range && ext === '.mp3') {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
      const chunksize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': total,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

function handleApiSaveInfo(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');
      const fullName = (data.fullName || data.name || 'Không rõ').trim();
      const dob = (data.dob || 'Không rõ').trim();
      const now = new Date();
      const timeStr = now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      const userAgent = req.headers['user-agent'] || 'Unknown';

      // 1. Append to thong_tin_thu_phuong.txt
      const txtEntry = `
============================================================
🌸 THÔNG TIN THU PHƯƠNG NHẬP VÀO HỆ THỐNG 20/10
⏰ Thời gian ghi nhận: ${timeStr}
👤 Họ và tên: ${fullName}
🎂 Ngày tháng năm sinh: ${dob}
📱 Thiết bị/Trình duyệt: ${userAgent}
============================================================
`;
      const txtPath = path.join(__dirname, 'thong_tin_thu_phuong.txt');
      fs.appendFileSync(txtPath, txtEntry, 'utf8');

      // 2. Append to thong_tin_thu_phuong.json
      const jsonPath = path.join(__dirname, 'thong_tin_thu_phuong.json');
      let records = [];
      if (fs.existsSync(jsonPath)) {
        try {
          records = JSON.parse(fs.readFileSync(jsonPath, 'utf8') || '[]');
        } catch (e) {
          records = [];
        }
      }
      records.push({
        fullName,
        dob,
        timestamp: timeStr,
        isoTimestamp: now.toISOString(),
        userAgent
      });
      fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), 'utf8');

      console.log(`[SAVE-INFO] Đã ghi nhận thông tin: Họ tên="${fullName}", Ngày sinh="${dob}" vào file thong_tin_thu_phuong.txt!`);

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        success: true,
        message: 'Đã lưu thông tin vào file thong_tin_thu_phuong.txt trên máy thành công!',
        data: { fullName, dob, timestamp: timeStr }
      }));
    } catch (err) {
      console.error('[SAVE-INFO ERROR]', err);
      res.writeHead(500, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  });
}

module.exports = handler;

if (require.main === module) {
  const http = require('http');
  const PORT = process.env.PORT || 3456;
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}
