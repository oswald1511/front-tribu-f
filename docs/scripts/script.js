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

    // NOTA: La lógica de tabs se eliminó porque ahora son páginas separadas.
});