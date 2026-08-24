// ============================================================
// REPLICA LOGIN ITAÚ - SERVER COMPLETO PARA RENDER + GITHUB
// Node + Express, estático, listo para deploy
// ============================================================

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------------
// LOG BÁSICO DE REQUESTS (útil para depuración en Render)
// ------------------------------------------------------------
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ------------------------------------------------------------
// SERVIR ESTÁTICOS DESDE /public
// ------------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------------------------------
// RUTA PRINCIPAL: LOGIN RECONSTRUIDO
// ------------------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------------------------------------------------------
// RUTA SANDBOX PARA AUTOMATIZACIÓN (OPCIONAL)
// ------------------------------------------------------------
app.get("/sandbox", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------------------------------------------------------
// HEALTHCHECK PARA RENDER
// ------------------------------------------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "replica-login-itau" });
});

// ------------------------------------------------------------
// ARRANQUE DEL SERVER
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor Replica Itaú escuchando en puerto ${PORT}`);
});
