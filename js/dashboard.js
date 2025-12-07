document.addEventListener('DOMContentLoaded', () => {
    
    // --- I. DATOS JSON DE KPIs NUMÉRICOS (Tarjeta Superior) ---
    const kpiDB = {
        totalRegistrados: 124,
        casosActivos: 54,
        reportesGenerados: 33,
        casosCriticos: 33 // Valores de ejemplo de la imagen
    };
    
    // --- II. JSON DE INSIGHTS Y RESPONSABLES (Secciones Inferiores) ---
    const insightsDB = {
        facultadTop: "33", // El valor '33' en la imagen para facultad se toma como ejemplo
        tutorActivo: "Jaime Arturo Sornoza", 
        coordinadorActivo: "Maria Lola Leon", 
        docenteActivo: "Fanny Apryl Sornoza" 
    };

    // --- III. DATOS JSON DE ACTIVIDAD RECIENTE (Lista) ---
    const actividadDB = [
        { nombre: 'Villon pico Francisco', tiempo: 'Registrado 4h' },
        { nombre: 'Valencia lady Milena', tiempo: 'Registrado 2h' },
        { nombre: 'Saltos Zambrano Vicente', tiempo: 'Registrado 1h' },
        { nombre: 'Pérez Silva María', tiempo: 'Registrado 30m' }, 
    ];


    // --- FUNCIÓN PARA CARGAR LOS INDICADORES CLAVE (KPIs y Insights) ---
    function cargarKPIs() {
        // Carga de Tarjetas Numéricas (Stats Grid)
        document.getElementById('kpi-total-registrados').textContent = kpiDB.totalRegistrados;
        document.getElementById('kpi-casos-activos').textContent = kpiDB.casosActivos;
        document.getElementById('kpi-reportes-generados').textContent = kpiDB.reportesGenerados;
        document.getElementById('kpi-casos-criticos').textContent = kpiDB.casosCriticos;
        
        // Carga de la SECCIÓN DE INSIGHTS (Facultad y Roles)
        document.getElementById('summary-facultad-top').textContent = insightsDB.facultadTop;
        document.getElementById('summary-tutor-activo').textContent = insightsDB.tutorActivo;
        document.getElementById('summary-coordinador-activo').textContent = insightsDB.coordinadorActivo;
        document.getElementById('summary-docente-activo').textContent = insightsDB.docenteActivo;
    }

    // --- FUNCIÓN PARA CARGAR LA LISTA DE ACTIVIDAD ---
    function cargarActividad() {
        const ul = document.getElementById('actividad-reciente-list');
        ul.innerHTML = ''; 
        
        actividadDB.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="activity-name">${item.nombre}</span> 
                - 
                <span class="activity-time">${item.tiempo}</span>
            `;
            ul.appendChild(li);
        });
    }

    // --- INICIALIZACIÓN ---
    cargarKPIs();
    cargarActividad();
});