// Vercel Serverless Function for /api/save-info
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const fullName = (data.fullName || '').trim();
      const dob = (data.dob || '').trim();
      const q1 = (data.q1 || '').trim();
      const q2 = (data.q2 || '').trim();
      const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

      console.log(`[VERCEL-API] Received: Name="${fullName}", DOB="${dob}", Q1="${q1}", Q2="${q2}" at ${timestamp}`);

      return res.status(200).json({
        success: true,
        message: 'Đã ghi nhận thông tin thành công!',
        data: {
          fullName,
          dob,
          q1,
          q2,
          timestamp
        }
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
  }

  return res.status(200).json({
    status: 'online',
    message: '20/10 Thu Phuong API ready'
  });
};
