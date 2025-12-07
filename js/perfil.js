document.addEventListener('DOMContentLoaded', () => {
    
    // --- I. DATOS DE EJEMPLO JSON (Simulación de Base de Datos) ---
    const estudiantesDB = [
        { 
            cedula: '1712345678', 
            nombre: 'María López', 
            carrera: 'Ingeniería en Software',
            rol: 'Estudiante',
            email: 'maria.lopez@uleam.edu.ec',
            telefono: '0958903481',
            discapacidad: 'Visual',
            percent: '65%',
            tutor: 'Juan Pérez',
            identificacion: '1712345678',
            edad: 22,
            genero: 'Femenino',
            direccion: 'Av. Universitaria, Manta',
            apoyos: ['Material ampliado', 'Tutoría semanal', 'Acceso preferencial a exámenes'],
            historial: [
                { semestre: '2024-1', gpa: '8.7', obs: 'Estable' },
                { semestre: '2024-2', gpa: '9.0', obs: 'Mejora' }
            ]
        },
        { 
            cedula: '0987654321', 
            nombre: 'Juan Pérez', 
            carrera: 'Comunicación',
            rol: 'Estudiante',
            email: 'juan.perez@uleam.edu.ec',
            telefono: '0990001112',
            discapacidad: 'Auditiva',
            percent: '40%',
            tutor: 'Ana García',
            identificacion: '0987654321',
            edad: 25,
            genero: 'Masculino',
            direccion: 'El Palmar, Manta',
            apoyos: ['Subtítulos en clases', 'Intérprete LSE'],
            historial: [
                { semestre: '2024-1', gpa: '7.8', obs: 'Requiere apoyo' }
            ]
        }
    ];

    // --- II. SELECTORES DE ELEMENTOS ---
    const inputBuscar = document.getElementById('inputBuscarCedula');
    const btnBuscar = document.getElementById('btnBuscarPerfil');
    const perfilContainer = document.getElementById('perfilDataContainer');
    const perfilPlaceholder = document.getElementById('perfilPlaceholder');
    const mensajeBusqueda = document.getElementById('mensajeBusqueda');


    // --- III. EVENTO DE BÚSQUEDA ---
    btnBuscar.addEventListener('click', (e) => {
        e.preventDefault();
        const busqueda = inputBuscar.value.trim();
        buscarEstudiante(busqueda);
    });

    // --- IV. FUNCIÓN PRINCIPAL DE BÚSQUEDA Y CARGA ---
    function buscarEstudiante(busqueda) {
        mensajeBusqueda.textContent = ''; 
        perfilContainer.style.display = 'none'; 
        perfilPlaceholder.style.display = 'block';

        if (busqueda.length === 0) {
            mensajeBusqueda.textContent = 'Ingrese la cédula o nombre para buscar.';
            return;
        }

        const estudiante = estudiantesDB.find(est => 
            est.cedula === busqueda || est.nombre.toLowerCase().includes(busqueda.toLowerCase())
        );

        if (estudiante) {
            cargarPerfil(estudiante);
            perfilContainer.style.display = 'grid'; // Mostrar el perfil si se encuentra
            perfilPlaceholder.style.display = 'none'; // Ocultar el placeholder
        } else {
            mensajeBusqueda.textContent = `❌ No se encontró un estudiante con "${busqueda}".`;
            perfilContainer.style.display = 'none';
            perfilPlaceholder.style.display = 'block'; // Asegurar que el placeholder se vea
        }
    }

    // --- V. FUNCIÓN PARA CARGAR LOS DATOS EN EL HTML ---
    function cargarPerfil(data) {
        // --- Datos del Sidebar ---
        document.getElementById('perfil-nombre').textContent = data.nombre;
        document.getElementById('perfil-carrera').textContent = data.carrera;
        document.getElementById('perfil-email').textContent = data.email;
        document.getElementById('perfil-telefono').textContent = data.telefono;
        document.getElementById('perfil-cedula').textContent = data.cedula; 
        
        // --- Badges ---
        document.getElementById('badge-discapacidad').textContent = data.discapacidad;
        document.getElementById('badge-percent').textContent = `Percent: ${data.percent}`;
        document.getElementById('badge-tutor').textContent = `Tutor: ${data.tutor || 'No Asignado'}`;

        // --- Detalles Personales (Main Section) ---
        document.getElementById('detalle-identificacion').textContent = data.identificacion;
        document.getElementById('detalle-edad').textContent = data.edad;
        document.getElementById('detalle-genero').textContent = data.genero;
        document.getElementById('detalle-direccion').textContent = data.direccion;

        // --- Requerimientos y apoyos ---
        const listaApoyos = document.getElementById('lista-apoyos');
        listaApoyos.innerHTML = '';
        if (data.apoyos && data.apoyos.length > 0) {
            data.apoyos.forEach(apoyo => {
                const li = document.createElement('li');
                li.textContent = apoyo;
                listaApoyos.appendChild(li);
            });
        } else {
            listaApoyos.innerHTML = '<li><small class="muted">No hay requerimientos especiales registrados.</small></li>';
        }

        // --- Historial académico ---
        const tablaHistorial = document.getElementById('tabla-historial-academico');
        tablaHistorial.innerHTML = '';
        if (data.historial && data.historial.length > 0) {
            data.historial.forEach(item => {
                const fila = tablaHistorial.insertRow();
                fila.insertCell().textContent = item.semestre;
                fila.insertCell().textContent = item.gpa;
                fila.insertCell().textContent = item.obs;
            });
        } else {
             tablaHistorial.innerHTML = '<tr><td colspan="3"><small class="muted">Sin datos académicos registrados.</small></td></tr>';
        }
    }
});