document.addEventListener('DOMContentLoaded', () => {
    
    // --- NUEVO ARRAY JSON PARA EL HISTORIAL (Añadida la clave 'cedulaEstudiante') ---
    let historialDB = [
        { id: 1, cedulaEstudiante: '1312411569', fecha: '2025-10-20', rol: 'Tutor', detalle: 'Revisión del avance académico y apoyo docente. ¿Acuerdos? Pendientes.' },
        { id: 2, cedulaEstudiante: '1312411569', fecha: '2025-09-15', rol: 'Docente', detalle: 'Entrega de material adaptado y seguimiento adaptado en la docente de Matemáticas.' },
        // Añadiré un registro para otro estudiante para poder probar el filtrado.
        { id: 3, cedulaEstudiante: '0987654321', fecha: '2025-11-01', rol: 'Coordinador', detalle: 'Reunión inicial de adaptación para el uso de silla de ruedas.' }
    ];

    // --- VARIABLE GLOBAL PARA SABER QUÉ ESTUDIANTE ESTÁ ACTIVO ---
    // Inicialmente, se asume el que está cargado en la ficha por defecto.
    let cedulaEstudianteActual = '1312411569'; 

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

    // --- SELECTOR DE LISTA DE HISTORIAL ---
    const historialList = document.getElementById('historialList');

    const estudiantesDB = [
        { cedula: '1312411569', nombre: 'Villon Pico Francisco', tipo: 'Visual - 30%', facultad: 'TIC', estado: 'activo' },
        { cedula: '0987654321', nombre: 'Gómez Torres Ana', tipo: 'Motora - 65%', facultad: 'Salud', estado: 'activo' },
        { cedula: '1710101010', nombre: 'Ruiz Saltos Juan', tipo: 'Auditiva - 40%', facultad: 'Educación', estado: 'inactivo' },
        { cedula: '0502030405', nombre: 'Pérez Silva María', tipo: 'Dislexia - 25%', facultad: 'Comunicación', estado: 'activo' },
        { cedula: '2425262728', nombre: 'López Mero Carlos', tipo: 'TDAH - 50%', facultad: 'Ingeniería', estado: 'activo' },
        { cedula: '1011121314', nombre: 'Vargas Solís Elena', tipo: 'Sordera - 70%', facultad: 'Derecho', estado: 'inactivo' }
    ];

    
    // --- LÓGICA DE LA COLUMNA IZQUIERDA: ASIGNAR (omitiendo por brevedad) ---
    
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


    // --- LÓGICA DE BÚSQUEDA DE ESTUDIANTE (ACTUALIZA LA CÉDULA ACTUAL) ---
    
    btnBuscar.addEventListener('click', (e) => {
        e.preventDefault(); 
        limpiarErrorUnico(inputBuscar);

        const busqueda = inputBuscar.value.trim();
        let esValido = true;
        
        const cedulaPattern = /^\d{10}$/; 

        if (!cedulaPattern.test(busqueda)) {
            mostrarError(inputBuscar, 'La Cédula debe contener exactamente 10 dígitos numéricos.');
            esValido = false;
        }
        
        if (!esValido) {
            inputBuscar.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const estudianteEncontrado = estudiantesDB.find(est => 
            est.cedula === busqueda
        );

        if (estudianteEncontrado) {
            // *** CAMBIO CLAVE 1: Actualizar la cédula del estudiante activo ***
            cedulaEstudianteActual = estudianteEncontrado.cedula; 
            
            actualizarFicha(estudianteEncontrado);
            mostrarHistorial(); // *** CAMBIO CLAVE 2: Refrescar el historial con el nuevo filtro ***

            inputBuscar.value = ''; 
            console.log(`✅ Estudiante encontrado: ${estudianteEncontrado.nombre}. Historial actualizado.`);
        } else {
            mostrarError(inputBuscar, 'Estudiante no encontrado. Verifique la Cédula.');
            limpiarFicha();
            // Si no se encuentra, la ficha se limpia y el historial se vacía
            cedulaEstudianteActual = ''; 
            mostrarHistorial(); 
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
        
        // ** NUEVA VALIDACIÓN: Debe haber un estudiante seleccionado antes de agregar seguimiento **
        if (cedulaEstudianteActual.length === 0) {
            mostrarError(selectRol, '❌ Primero debe buscar y seleccionar un estudiante.');
            document.getElementById('buscarEstudiante').scrollIntoView({ behavior: 'smooth', block: 'center' });
            return; 
        }

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
            
            hoy.setHours(0, 0, 0, 0); 
            fechaSeleccionada.setHours(0, 0, 0, 0); 

            if (fechaSeleccionada < hoy) {
                mostrarError(fechaActividad, 'La fecha debe ser igual o posterior a la fecha actual.');
                esValido = false;
            }
        }

        if (esValido) {
            // --- LÓGICA: CREAR Y AGREGAR SEGUIMIENTO AL JSON ---
            const nuevoSeguimiento = {
                id: historialDB.length > 0 ? historialDB[historialDB.length - 1].id + 1 : 1, 
                // *** CAMBIO CLAVE 3: Asignar la cédula del estudiante actual al nuevo registro ***
                cedulaEstudiante: cedulaEstudianteActual, 
                fecha: fechaActividad.value, 
                rol: selectRol.value, 
                detalle: detalleSeguimiento.value.trim()
            };

            historialDB.push(nuevoSeguimiento); 
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

    // --- FUNCIÓN PARA GENERAR Y MOSTRAR EL HISTORIAL DESDE EL JSON (AHORA CON FILTRADO) ---
    function mostrarHistorial() {
        historialList.innerHTML = ''; // Limpiar el contenedor antes de renderizar
        
        // *** CAMBIO CLAVE 4: Filtrar el historial por la cédula activa ***
        const historialFiltrado = historialDB.filter(item => 
            item.cedulaEstudiante === cedulaEstudianteActual
        );

        if (historialFiltrado.length === 0 && cedulaEstudianteActual.length > 0) {
             historialList.innerHTML = '<li class="historial-empty">Este estudiante no tiene registros de seguimiento aún.</li>';
             return;
        }
        
        // Iterar sobre el historial filtrado en orden inverso (más reciente primero)
        [...historialFiltrado].reverse().forEach(item => {
            const li = document.createElement('li');
            li.className = 'historial-item';
            
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

    // --- FUNCIONES DE FICHA (omitiendo por brevedad) ---

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

    // ... (resto de funciones de feedback)

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
    mostrarHistorial(); // Cargar el historial inicial del estudiante por defecto.
});