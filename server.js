/* ============================================================
   REPLICA LOGIN ITAÚ - SCRIPT COMPLETO RECONSTRUIDO
   Compatible con Render + GitHub
   ============================================================ */

/* ------------------------------------------------------------
   DETECCIÓN DE MODO MÓVIL
------------------------------------------------------------ */
const isMobile = window.innerWidth <= 768;
if (isMobile) {
    console.log("Versión móvil activada");
}

/* ------------------------------------------------------------
   SIMULACIÓN DE LOGIN
------------------------------------------------------------ */
document.getElementById("btnLogin").onclick = () => {
    const rut = document.getElementById("rut").value;
    const clave = document.getElementById("clave").value;

    if (!rut) {
        alert("Ingresa tu RUT");
        return;
    }

    if (!clave) {
        alert("Ingresa tu clave");
        return;
    }

    // Simulación de bifurcación (como el login real)
    if (rut.startsWith("1")) {
        alert("Tu usuario pertenece a Corporate (simulado)");
    } else if (rut.startsWith("2")) {
        alert("Tu usuario pertenece a Empresas (simulado)");
    } else {
        alert("Login simulado OK");
    }
};

/* ------------------------------------------------------------
   SIMULACIÓN DE PRIMER INGRESO
------------------------------------------------------------ */
document.getElementById("btnPrimerIngresoCorporate").onclick = () => {
    alert("Primer ingreso Corporate (simulado)");
};

document.getElementById("btnPrimerIngresoEmpresas").onclick = () => {
    alert("Primer ingreso Empresas (simulado)");
};

document.getElementById("btnPrimerIngresoGeneral").onclick = () => {
    alert("Primer ingreso general (simulado)");
};

/* ------------------------------------------------------------
   SIMULACIÓN DE NAVEGACIÓN DEL HEADER
------------------------------------------------------------ */
document.querySelectorAll(".header-nav a").forEach(link => {
    link.onclick = (e) => {
        e.preventDefault();
        alert("Navegación simulada: " + link.textContent);
    };
});

/* ------------------------------------------------------------
   SIMULACIÓN DE FORMULARIO OCULTO (equivalente a WPF/Dojo)
------------------------------------------------------------ */
document.getElementById("btnLocalStorageSubmit")?.addEventListener("click", () => {
    const form = document.getElementById("frmLocalStorage");

    const localStorageValue = localStorage.getItem("cookieAuth") || "empresas";
    document.getElementById("localStorageHiddenID").value = localStorageValue;

    console.log("Formulario oculto enviado (simulado)");
    console.log("Valor cookieAuth:", localStorageValue);
});

/* ------------------------------------------------------------
   SIMULACIÓN DE MODALES (si los agregas)
------------------------------------------------------------ */
const modalEmpresas = document.getElementById("modalEmpresas");
const modalCorporate = document.getElementById("modalCorporate");

if (modalEmpresas && modalCorporate) {
    document.getElementById("btnIrCorporate")?.addEventListener("click", () => {
        alert("Redirigiendo a Corporate (simulado)");
        modalEmpresas.classList.add("hidden");
    });

    document.getElementById("btnIrEmpresas")?.addEventListener("click", () => {
        alert("Redirigiendo a Empresas (simulado)");
        modalCorporate.classList.add("hidden");
    });
}

/* ------------------------------------------------------------
   SIMULACIÓN DE COOKIE DE BIFURCACIÓN
------------------------------------------------------------ */
const cookieAuth = localStorage.getItem("cookieAuth") || "empresas";
const boxLogin = document.getElementById("box_login_bifurcacion");

if (cookieAuth !== "false") {
    boxLogin.style.flexBasis = "auto";
}

/* ------------------------------------------------------------
   LOGS DE DEPURACIÓN
------------------------------------------------------------ */
console.log("Replica Itaú cargada correctamente");
