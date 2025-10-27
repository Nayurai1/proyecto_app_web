document.addEventListener('DOMContentLoaded', () => {
    // Selectores para el formulario de ASIGNACIÓN (Columna Izquierda)
    const formAsignacion = document.getElementById('asignacion-form');
    const selectTutor = document.getElementById('selectTutor');
    const selectDocente = document.getElementById('selectDocente');
    const selectCoordinador = document.getElementById('selectCoordinador');

    // Selectores para el formulario de AGREGAR SEGUIMIENTO (Columna Derecha)
    const btnAgregar = document.getElementById('btnAgregarSeguimiento');
    const selectRol = document.getElementById('selectRol');
    const detalleSeguimiento = document.getElementById('detalleSeguimiento');
    const fechaActividad = document.getElementById('fechaActividad');

    
    // LÓGICA DE LA COLUMNA IZQUIERDA: ASIGNAR (Solo valida los 3 selectores)
    
    formAsignacion.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        limpiarErrores();
        
        let asignacionValida = true;
        
        // La validación es que no se elijan las opciones por defecto
        
        if (selectTutor.value === "Asignar tutor") {
            mostrarError(selectTutor, 'Seleccione un tutor.');
            asignacionValida = false;
        }

        if (selectDocente.value === "Asignar Docente") {
            mostrarError(selectDocente, 'Seleccione un docente.');
            asignacionValida = false;
        }

        if (selectCoordinador.value === "Asignar Coordinador") {
            mostrarError(selectCoordinador, 'Seleccione un coordinador.');
            asignacionValida = false;
        }

        if (asignacionValida) {
            console.log('Asignación válida. Se simula el envío.');
            // SIMULACIÓN: Limpiar los selectores de asignación si es válido
            selectTutor.value = "Asignar tutor";
            selectDocente.value = "Asignar Docente";
            selectCoordinador.value = "Asignar Coordinador";
        } else {
             document.querySelector('.ficha-sidebar .input-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    
    // LÓGICA DE LA COLUMNA DERECHA: AGREGAR SEGUIMIENTO 
    
    btnAgregar.addEventListener('click', (e) => {
        e.preventDefault(); 

        limpiarErrores();
        
        const rol = selectRol.value;
        const detalle = detalleSeguimiento.value.trim();
        const fecha = fechaActividad.value;
        
        let esValido = true;

        // Validaciones del formulario de seguimiento
        if (rol === "") {
            mostrarError(selectRol, 'Debe seleccionar un tipo de rol.');
            esValido = false;
        }

        if (detalle === "") {
            mostrarError(detalleSeguimiento, 'El detalle del seguimiento no puede estar vacío.');
            esValido = false;
        }
        
        if (fecha === "") {
            mostrarError(fechaActividad, 'Debe seleccionar la fecha de la actividad.');
            esValido = false;
        }

        if (esValido) {
            // SIMULACIÓN: Limpia el formulario si es válido.
            selectRol.value = "";
            detalleSeguimiento.value = "";
            fechaActividad.value = "";
            console.log('Seguimiento validado. Se simula el envío.');
        } else {
             document.querySelector('.historial-main .input-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    
    // --- FUNCIONES DE FEEDBACK (Generales) ---

    function mostrarError(elemento, mensaje) {
        limpiarErrorUnico(elemento);

        elemento.classList.add('input-error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = '❌ ' + mensaje;
        
        // El mensaje se inserta y el CSS lo acomoda gracias al .input-group
        elemento.parentNode.insertBefore(errorDiv, elemento.nextSibling);
    }

    function limpiarErrores() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }
    
    function limpiarErrorUnico(elemento) {
        elemento.classList.remove('input-error');
        if (elemento.nextElementSibling && elemento.nextElementSibling.classList.contains('error-message')) {
            elemento.nextElementSibling.remove();
        }
    }
});