import express from 'express';
import cors from 'cors';
import QRCode from 'qrcode';

const app = express();
app.use(cors());

// Agrega https:// si falta y valida que sea una URL
function normalizeUrl(input = '') {
  let v = input.trim();
  if (!v) return null;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) v = `https://${v}`;
  try {
    return new URL(v).href;
  } catch {
    return null;
  }
}

// // GET /api/qr?url=example.com
// app.get('/api/qr', async (req, res) => {
//   const href = normalizeUrl(req.query.url);
//   if (!href) return res.status(400).json({ error: 'URL inválida' });

//   const png = await QRCode.toBuffer(href, { width: 512, margin: 4 });
//   res.type('image/png').send(png);
// });

const isHex = (c) => /^#[0-9a-f]{6}$/i.test(c || '');

// GET /api/qr?url=example.com&format=png|svg&size=512&fg=%23000000&bg=%23ffffff&ec=M&download=1
app.get('/api/qr', async (req, res) => {
  const href = normalizeUrl(req.query.url);
  if (!href) return res.status(400).json({ error: 'URL inválida' });

  const format = req.query.format === 'svg' ? 'svg' : 'png';
  const size = Math.min(2048, Math.max(128, parseInt(req.query.size, 10) || 512));
  const ec = ['L', 'M', 'Q', 'H'].includes(req.query.ec) ? req.query.ec : 'M';
  const dark = isHex(req.query.fg) ? req.query.fg : '#000000';
  const light = isHex(req.query.bg) ? req.query.bg : '#ffffff';

  const options = {
    errorCorrectionLevel: ec,
    margin: 4,
    width: size,
    color: { dark, light },
  };

  try {
    if (req.query.download) {
      res.setHeader('Content-Disposition', `attachment; filename="qr-code.${format}"`);
    }

    if (format === 'svg') {
      const svg = await QRCode.toString(href, { ...options, type: 'svg' });
      return res.type('image/svg+xml').send(svg);
    }

    const png = await QRCode.toBuffer(href, { ...options, type: 'png' });
    return res.type('image/png').send(png);
  } catch {
    return res.status(400).json({ error: 'La URL es demasiado larga para un QR' });
  }
});

// This is to listen to the server on port 5000 and log a message when it starts
app.listen(5000, () => console.log('API en http://localhost:5000'));