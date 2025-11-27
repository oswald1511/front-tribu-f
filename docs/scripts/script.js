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