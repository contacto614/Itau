const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000; // Render inyecta PORT

// Carpeta estática (confirmada: /public)
const STATIC_DIR = path.join(__dirname, 'public');

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
