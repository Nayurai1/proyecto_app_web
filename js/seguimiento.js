document.addEventListener('DOMContentLoaded', () => {
    
    // --- NUEVO ARRAY JSON PARA EL HISTORIAL ---
    let historialDB = [
        { id: 1, fecha: '2025-10-20', rol: 'Tutor', detalle: 'Revisión del avance académico y apoyo docente. ¿Acuerdos? Pendientes.' },
        { id: 2, fecha: '2025-09-15', rol: 'Docente', detalle: 'Entrega de material adaptado y seguimiento adaptado en la docente de Matemáticas.' }
    ];

    // --- SELECTORES EXISTENTES ---
    const formAsignacion = document.getElementById('asignacion-form');
    const selectTutor = document.getElementById('selectTutor');
    const selectDocente = document.getElementById('selectDocente');
    const selectCoordinador = document.getElementById('selectCoordinador');

    const btnAgregar = document.getElementById('btnAgregarSeguimiento');
    const selectRol = document.getElementById('selectRol');
    const detalleSeguimiento = document.getElementById('detalleSeguimiento');
    const fechaActividad = document.getElementById('fechaActividad');

    // --- SELECTORES Y DATOS DE BÚSQUEDA ---
    const inputBuscar = document.getElementById('buscarEstudiante');
    const btnBuscar = document.getElementById('btnBuscar');
    const fichaNombre = document.getElementById('ficha-nombre');
    const fichaCedula = document.getElementById('ficha-cedula');
    const fichaTipo = document.getElementById('ficha-tipo');
    const fichaFacultad = document.getElementById('ficha-facultad');

    // --- NUEVO SELECTOR DE LISTA DE HISTORIAL ---
    const historialList = document.getElementById('historialList');

    const estudiantesDB = [
        { cedula: '1312411569', nombre: 'Villon Pico Francisco', tipo: 'Visual - 30%', facultad: 'TIC', estado: 'activo' },
        { cedula: '0987654321', nombre: 'Gómez Torres Ana', tipo: 'Motora - 65%', facultad: 'Salud', estado: 'activo' },
        { cedula: '1710101010', nombre: 'Ruiz Saltos Juan', tipo: 'Auditiva - 40%', facultad: 'Educación', estado: 'inactivo' }
    ];

    
    // --- LÓGICA DE LA COLUMNA IZQUIERDA: ASIGNAR ---
    
    formAsignacion.addEventListener('submit', (e) => {
        e.preventDefault(); 
        limpiarErrores();
        
        let asignacionValida = true;
        
        if (selectTutor.value === "Asignar Tutor") {
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
            console.log('✅ Asignaciones guardadas. Se simula el envío.');
        } else {
            document.querySelector('.ficha-sidebar .input-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });


    // --- LÓGICA DE BÚSQUEDA DE ESTUDIANTE (VALIDACIÓN ESTRICTA: SOLO CÉDULA DE 10 DÍGITOS) ---
    
    btnBuscar.addEventListener('click', (e) => {
        e.preventDefault(); 
        limpiarErrorUnico(inputBuscar);

        const busqueda = inputBuscar.value.trim();
        let esValido = true;
        
        // Patrón para verificar que SÓLO sean exactamente 10 dígitos numéricos
        const cedulaPattern = /^\d{10}$/; 

        // 1. Validación de Cédula (debe ser 10 dígitos y solo números)
        if (!cedulaPattern.test(busqueda)) {
            mostrarError(inputBuscar, 'La Cédula debe contener exactamente 10 dígitos numéricos.');
            esValido = false;
        }
        
        if (!esValido) {
            inputBuscar.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Si es válido, se procede a buscar solo por Cédula (búsqueda exacta)
        const estudianteEncontrado = estudiantesDB.find(est => 
            est.cedula === busqueda
        );

        if (estudianteEncontrado) {
            actualizarFicha(estudianteEncontrado);
            inputBuscar.value = ''; 
            console.log(`✅ Estudiante encontrado: ${estudianteEncontrado.nombre}`);
        } else {
            mostrarError(inputBuscar, 'Estudiante no encontrado. Verifique la Cédula.');
            limpiarFicha();
            inputBuscar.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // --- LÓGICA DEL FORMULARIO DE AGREGAR SEGUIMIENTO ---

    btnAgregar.addEventListener('click', (e) => {
        e.preventDefault(); 
        validarSeguimiento();
    });

    function validarSeguimiento() {
        limpiarErrores();
        let esValido = true;
        
        // 1. Validar Rol (Verifica el valor nulo del placeholder)
        if (selectRol.value === "") {
            mostrarError(selectRol, 'Seleccione el rol desde donde realiza el seguimiento.');
            esValido = false;
        }

        // 2. Validar Detalle
        if (detalleSeguimiento.value.trim() === "") {
            mostrarError(detalleSeguimiento, 'El detalle del seguimiento es obligatorio.');
            esValido = false;
        }

        // 3. Validar Fecha (Obligatoria y no pasada)
        if (fechaActividad.value.trim() === "") {
            mostrarError(fechaActividad, 'Debe ingresar la fecha de la actividad.');
            esValido = false;
        } else {
            const fechaSeleccionada = new Date(fechaActividad.value);
            const hoy = new Date();
            
            // Ajustar ambas fechas a medianoche (00:00:00) para comparar solo las fechas
            hoy.setHours(0, 0, 0, 0); 
            fechaSeleccionada.setHours(0, 0, 0, 0); 

            if (fechaSeleccionada < hoy) {
                mostrarError(fechaActividad, 'La fecha debe ser igual o posterior a la fecha actual.');
                esValido = false;
            }
        }

        if (esValido) {
            // --- NUEVA LÓGICA: CREAR Y AGREGAR SEGUIMIENTO AL JSON ---
            const nuevoSeguimiento = {
                // Generar un ID simple, asumiendo que el historialDB tiene el registro más alto al final.
                id: historialDB.length > 0 ? historialDB[historialDB.length - 1].id + 1 : 1, 
                fecha: fechaActividad.value, // YYYY-MM-DD
                rol: selectRol.value, 
                detalle: detalleSeguimiento.value.trim()
            };

            historialDB.push(nuevoSeguimiento); // Añadir el nuevo registro
            mostrarHistorial(); // Refrescar el DOM

            // Limpiar el formulario
            selectRol.value = ""; 
            detalleSeguimiento.value = "";
            fechaActividad.value = "";
            console.log('✅ Seguimiento agregado y validado.');
        } else {
             document.querySelector('.historial-main .input-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // --- FUNCIÓN PARA GENERAR Y MOSTRAR EL HISTORIAL DESDE EL JSON (NUEVA FUNCIÓN) ---
    function mostrarHistorial() {
        historialList.innerHTML = ''; // Limpiar el contenedor antes de renderizar
        
        // Iterar sobre el historial en orden inverso (más reciente primero)
        [...historialDB].reverse().forEach(item => {
            const li = document.createElement('li');
            li.className = 'historial-item';
            
            // Usar la fecha y rol del objeto JSON
            li.innerHTML = `
                <div class="item-header">
                    <span class="item-date-role">${item.fecha} • ${item.rol}</span>
                    <div class="item-actions">
                        <button class="btn-icon btn-edit" title="Editar" data-id="${item.id}">✏️</button>
                        <button class="btn-icon btn-delete" title="Eliminar" data-id="${item.id}">🗑️</button>
                    </div>
                </div>
                <p class="item-detalle">${item.detalle}</p>
            `;
            
            historialList.appendChild(li);
        });
    }

    // --- FUNCIONES DE FICHA ---

    function actualizarFicha(data) {
        fichaNombre.textContent = data.nombre;
        fichaCedula.textContent = data.cedula;
        fichaTipo.textContent = data.tipo;
        fichaFacultad.textContent = data.facultad;
    }

    function limpiarFicha() {
        fichaNombre.textContent = '---';
        fichaCedula.textContent = '---';
        fichaTipo.textContent = '---';
        fichaFacultad.textContent = '---';
    }


    // --- FUNCIONES DE FEEDBACK (Generales) ---

    function mostrarError(elemento, mensaje) {
        limpiarErrorUnico(elemento);

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
    
    function limpiarErrorUnico(elemento) {
        elemento.classList.remove('input-error');
        if (elemento.nextElementSibling && elemento.nextElementSibling.classList.contains('error-message')) {
            elemento.nextElementSibling.remove();
        }
    }

    // --- INICIALIZACIÓN ---
    mostrarHistorial(); // Cargar y mostrar los datos iniciales al cargar la página.
});