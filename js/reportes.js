// --- DATOS JSON ---
const datosEstudiantes = [
    { ID: 1, Nombre: "Juan Perez", Tipo: "Visual", Facultad: "TIC", Edad: 20, Estado: "En seguimiento" },
    { ID: 2, Nombre: "Maria Torres", Tipo: "Motora", Facultad: "Salud", Edad: 24, Estado: "Finalizado" },
    { ID: 3, Nombre: "Andrés Ruiz", Tipo: "Auditiva", Facultad: "Educación", Edad: 28, Estado: "En seguimiento" },
    { ID: 4, Nombre: "Andrés Villón", Tipo: "Motora", Facultad: "Educación", Edad: 23, Estado: "En seguimiento" },
    { ID: 5, Nombre: "Carla Núñez", Tipo: "Visual", Facultad: "Salud", Edad: 22, Estado: "En seguimiento" },
    { ID: 6, Nombre: "Pedro Gómez", Tipo: "Motora", Facultad: "TIC", Edad: 35, Estado: "Finalizado" },
];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('filtroForm');
    const inputNombre = document.getElementById('filtroNombre');
    const inputEdad = document.getElementById('filtroEdad');
    const selectFacultad = document.getElementById('filtroFacultad');
    const selectTipoDiscapacidad = document.getElementById('filtroTipoDiscapacidad');
    const tablaCuerpo = document.getElementById('tablaCuerpo');
    
    // Al inicio, la tabla se renderiza vacía para que no se muestre nada.
    renderizarTabla([]); 
    
    // Rellenar dinámicamente los selects (opcional, pero útil)
    rellenarSelects();


    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        limpiarErrores();
        let esValido = true;
        
        // 1. Validar Nombre
        if (inputNombre.value.trim() !== '') {
            if (!validarNombreSoloLetras(inputNombre)) {
                esValido = false;
            }
        }
        
        // 2. Validar Edad
        if (inputEdad.value.trim() !== '') {
            if (!validarEdadEntera(inputEdad)) {
                esValido = false;
            }
        }
        
        // --- RESULTADO FINAL ---
        if (esValido) { 
            console.log('Filtros validados. Aplicando filtrado local.');
            // 🌟 Llama a la nueva función de filtrado y renderiza el resultado
            const resultadosFiltrados = aplicarFiltros();
            renderizarTabla(resultadosFiltrados);
        } else {
            document.querySelector('.input-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    /**
     * 🌟 FUNCIÓN PRINCIPAL DE FILTRADO
     * Aplica todos los filtros activos sobre la lista de datos.
     */
    function aplicarFiltros() {
        const nombreFiltro = inputNombre.value.trim().toLowerCase();
        const edadFiltro = inputEdad.value.trim();
        const facultadFiltro = selectFacultad.value;
        const tipoDiscapacidadFiltro = selectTipoDiscapacidad.value;
        // El filtro de PorcentajeDiscapacidad (que no tiene ID en el HTML proporcionado) no se usa aquí.

        return datosEstudiantes.filter(estudiante => {
            let pasaFiltro = true;

            // Filtro por Nombre (búsqueda parcial)
            if (nombreFiltro && !estudiante.Nombre.toLowerCase().includes(nombreFiltro)) {
                pasaFiltro = false;
            }

            // Filtro por Edad (coincidencia exacta, después de la validación)
            if (pasaFiltro && edadFiltro && estudiante.Edad !== Number(edadFiltro)) {
                pasaFiltro = false;
            }

            // Filtro por Facultad
            if (pasaFiltro && facultadFiltro !== 'Todos' && estudiante.Facultad !== facultadFiltro) {
                pasaFiltro = false;
            }

            // Filtro por Tipo de Discapacidad
            if (pasaFiltro && tipoDiscapacidadFiltro !== 'Todos' && estudiante.Tipo !== tipoDiscapacidadFiltro) {
                pasaFiltro = false;
            }
            
            return pasaFiltro;
        });
    }

    /**
     * Función para rellenar los dropdowns con valores únicos de los datos.
     */
    function rellenarSelects() {
        const facultades = [...new Set(datosEstudiantes.map(d => d.Facultad))].sort();
        const tipos = [...new Set(datosEstudiantes.map(d => d.Tipo))].sort();

        facultades.forEach(f => {
            const option = document.createElement('option');
            option.value = f;
            option.textContent = f;
            selectFacultad.appendChild(option);
        });
        
        tipos.forEach(t => {
            const option = document.createElement('option');
            option.value = t;
            option.textContent = t;
            selectTipoDiscapacidad.appendChild(option);
        });
    }

    /** Función para renderizar los datos en la tabla. */
    function renderizarTabla(datos) {
        tablaCuerpo.innerHTML = ''; 

        if (datos.length === 0) {
            const fila = tablaCuerpo.insertRow();
            const celda = fila.insertCell();
            celda.colSpan = 6; 
            celda.textContent = "No se encontraron resultados. Intenta con otros filtros.";
            celda.style.textAlign = 'center';
            celda.style.padding = '20px';
            celda.style.color = '#777';
            return;
        }

        datos.forEach(estudiante => {
            const fila = tablaCuerpo.insertRow();
            const columnas = ['ID', 'Nombre', 'Tipo', 'Facultad', 'Edad', 'Estado'];
            
            columnas.forEach(columna => {
                const celda = fila.insertCell();
                celda.textContent = estudiante[columna];
            });
        });
    }

    // --- FUNCIONES DE VALIDACIÓN Y FEEDBACK (Sin cambios relevantes) ---
    
    function validarNombreSoloLetras(input) {
        const valor = input.value.trim();
        const regexLetras = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/; 
        if (!regexLetras.test(valor)) {
            mostrarError(input, 'El nombre solo puede contener letras y espacios.');
            return false;
        }
        return true;
    }
    
    function validarEdadEntera(input) {
        const valor = input.value.trim();
        const numero = Number(valor);
        if (!Number.isInteger(numero) || numero <= 0 || isNaN(numero)) {
            mostrarError(input, 'La edad debe ser un número entero y positivo.');
            return false;
        }
        return true;
    }
    
    function mostrarError(elemento, mensaje) {
        if (elemento.nextElementSibling && elemento.nextElementSibling.classList.contains('error-message')) {
            elemento.nextElementSibling.textContent = '❌ ' + mensaje; 
            return;
        }
        elemento.classList.add('input-error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = '❌ ' + mensaje;
        elemento.parentNode.insertBefore(errorDiv, elemento.nextSibling);
    }

    function limpiarErrores() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }
});