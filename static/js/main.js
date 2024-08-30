// Mostrar/Ocultar Sidebar
document.addEventListener('DOMContentLoaded', function () {
    const menuToggleBtn = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const cerrarSidebarBtn = document.getElementById('cerrar-sidebar');

    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }

    if (cerrarSidebarBtn && sidebar) {
        cerrarSidebarBtn.addEventListener('click', function () {
            sidebar.classList.remove('active');
        });
    }
});


// Agregar Tareas
function agregarTarea() {
    const tareaInput = document.getElementById('tarea');
    const tarea = tareaInput.value.trim();

    if (tarea === '') {
        alert('Por favor, ingresa una tarea.');
        return;
    }

    fetch('/agregar_tarea', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            descripcion: tarea
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Tarea agregada exitosamente.');
            tareaInput.value = ''; // Limpiar el input
        } else {
            alert('Hubo un problema al agregar la tarea.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// Actualizar Estado de Tareas
document.querySelectorAll('.check-tarea').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const tareaId = this.getAttribute('data-id');
        const completada = this.checked ? 1 : 0;

        fetch(`/actualizar_estado/${tareaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: completada })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.nextElementSibling.classList.toggle('tachado', completada === 1);
            }
        });
    });
});


// Lógica para Realizar la Búsqueda
document.addEventListener('DOMContentLoaded', function () {
    const searchBox = document.querySelector('#buscador');
    const searchIcon = document.querySelector('#iconoBusqueda');

    function performSearch() {
        const query = searchBox.value.trim();
        if (query) {
            // Limpia el input
            searchBox.value = '';
            // Redirige a la página de resultados de búsqueda
            window.location.href = `/buscador?query=${encodeURIComponent(query)}`;
        }
    }

    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    searchIcon.addEventListener('click', performSearch);
});
// Lógica de búsqueda en el sidebar
document.addEventListener('DOMContentLoaded', function () {
    const searchBox = document.querySelector('#buscador-input');

    function performSearch() {
        const query = searchBox.value.trim();
        if (query) {
            // Limpia el input
            searchBox.value = '';
            // Redirige a la página de resultados de búsqueda
            window.location.href = `/buscador?query=${encodeURIComponent(query)}`;
        }
    }

    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});
