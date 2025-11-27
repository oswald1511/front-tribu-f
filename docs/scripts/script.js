document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // LÓGICA DEL DROPDOWN (HEADER)
    // ======================================================
    const dropdowns = document.querySelectorAll('.header-dropdown');

    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropbtn');
        const content = dropdown.querySelector('.dropdown-content');
        const arrow = btn.querySelector('i');

        if(btn && content) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                
                // Cerrar otros dropdowns
                document.querySelectorAll('.dropdown-content').forEach(c => {
                    if (c !== content) c.classList.remove('show');
                });

                // Alternar el actual
                content.classList.toggle('show');
                if (arrow) arrow.classList.toggle('rotate');
            });
        }
    });

    // Cerrar menú al hacer clic fuera
    window.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.classList.remove('show');
        });
        document.querySelectorAll('.dropbtn i').forEach(arrow => {
            arrow.classList.remove('rotate');
        });
    });

    // 1. Configuración para inputs de solo FECHA (ej: Carga de Horas)
    flatpickr("input[type='date']", {
        locale: "es",           // Idioma español
        dateFormat: "Y-m-d",    // Formato para enviar al backend
        altInput: true,         // Muestra una fecha más legible al usuario
        altFormat: "j F, Y",    // Ej: "15 Noviembre, 2025"
        allowInput: true        // Permite escribir si se desea
    });

    // 2. Configuración para inputs de MES (ej: Precarga, Costos)
    flatpickr("input[type='month']", {
        locale: "es",
        plugins: [
            new monthSelectPlugin({
                shorthand: true, // Muestra "Ene", "Feb" en vez de "Enero"
                dateFormat: "Y-m", // Formato YYYY-MM para el backend
                altFormat: "F Y",  // Ej: "Noviembre 2025" visualmente
            })
        ],
        altInput: true
    });
});

// ======================================================
// Lógica para Costo por Proyecto
// - Consulta `costos-proyecto?anio=YYYY`
// - Consulta lista de proyectos (mapea id -> nombre)
// - Rellena la tabla por meses (Enero..Diciembre)
// ======================================================

async function fetchAndRenderCostosProyecto() {
    const selectYear = document.getElementById('filtro-anio');
    const year = selectYear ? selectYear.value : new Date().getFullYear();

    const tableBody = document.querySelector('.excel-grid tbody');
    if (!tableBody) return;

    // Cabeceras: meses del año
    const months = Array.from({length:12}, (_,i) => {
        const m = i+1;
        return `${year}-${String(m).padStart(2,'0')}`;
    });

    try {
        // 1) Obtener costos por proyecto
        const res = await fetch(`https://modulo-finanzas.onrender.com/costos-proyecto?anio=${year}`);
        const costos = await res.json();

        // 2) Obtener listado de proyectos (usamos corsproxy para evitar CORS si hace falta)
        const proyectosRes = await fetch('https://corsproxy.io/?https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/32c8fe38-22a6-4fbb-b461-170dfac937e4/proyectos-api/1.0.0/m/proyectos');
        const proyectos = await proyectosRes.json();
        const proyectosMap = new Map((proyectos || []).map(p => [p.id, p]));

        // 3) Renderizar filas
        tableBody.innerHTML = '';
        costos.forEach(item => {
            const proyectoId = item.proyectoId || item.proyecto_id || item.id;
            const proyectoInfo = proyectosMap.get(proyectoId);
            const nombreProyecto = proyectoInfo ? proyectoInfo.nombre : (proyectoId || 'Sin nombre');

            // Montar celdas de meses
            const monthCells = months.map(mKey => {
                const val = item[mKey] || 0;
                return `<td style="text-align: right;">${formatCurrency(val)}</td>`;
            }).join('');

            const total = item.total || Object.values(item).reduce((acc,v) => {
                if (typeof v === 'number') return acc + v; return acc;
            }, 0);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${escapeHtml(nombreProyecto)}</td>
                ${monthCells}
                <td style="text-align: right;">${formatCurrency(total)}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (err) {
        console.error('Error al cargar costos por proyecto:', err);
        tableBody.innerHTML = '<tr><td colspan="14" style="color: #a00;">Error al cargar datos. Revisa la consola.</td></tr>';
    }
}

function formatCurrency(value) {
    const n = Number(value) || 0;
    return '$ ' + n.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Inicializar y escuchar cambios de año
document.addEventListener('DOMContentLoaded', () => {
    const selectYear = document.getElementById('filtro-anio');
    if (selectYear) {
        selectYear.addEventListener('change', fetchAndRenderCostosProyecto);
    }
    // Carga inicial
    fetchAndRenderCostosProyecto();
});