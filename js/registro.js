document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CATÁLOGOS XML INTEGRADOS (Como String) ---
    // Esto reemplaza el archivo externo registro.xml y evita problemas de ruta.
    const xmlCatalogoString = `
<CatalogosRegistro>
    <Lista id="Facultades">
        <Item valor="TIC">Facultad de Ciencias Informáticas</Item>
        <Item valor="Salud">Facultad de Ciencias de la Salud</Item>
        <Item valor="Educacion">Facultad de Ciencias de la Educación</Item>
        <Item valor="Ambientales">Facultad de Ciencias Ambientales</Item>
        <Item valor="Derecho">Facultad de Derecho</Item>
    </Lista>
    
    <Lista id="TiposDiscapacidad">
        <Item valor="Visual">Visual</Item>
        <Item valor="Auditiva">Auditiva</Item>
        <Item valor="Motora">Motora</Item>
        <Item valor="Intelectual">Intelectual</Item>
        <Item valor="Psicosocial">Psicosocial</Item>
        <Item valor="Otra">Otra</Item>
    </Lista>

    <Lista id="Generos">
        <Item valor="F">Femenino</Item>
        <Item valor="M">Masculino</Item>
        <Item valor="O">Otro</Item>
    </Lista>
</CatalogosRegistro>
    `;


    // --- 2. SELECTORES DE ELEMENTOS ---
    const form = document.getElementById('registroForm');
    
    // Selectores para la población
    const selectGenero = document.getElementById('regGenero');
    const selectFacultad = document.getElementById('regFacultad');
    const selectTipoDiscapacidad = document.getElementById('regTipoDiscapacidad');
    
    // Mapeo de todos los inputs para la validación
    const inputs = {
        nombre: document.getElementById('regNombre'),
        apellido: document.getElementById('regApellido'),
        cedula: document.getElementById('regCedula'),
        fechaNacimiento: document.getElementById('regFechaNacimiento'),
        genero: selectGenero, 
        
        usuario: document.getElementById('inputUsuario'), 
        password: document.getElementById('inputPassword'), 
        
        celular: document.getElementById('regCelular'),
        correo: document.getElementById('regCorreo'),
        direccion: document.getElementById('regDireccion'),
        
        facultad: selectFacultad,
        tipoDiscapacidad: selectTipoDiscapacidad, 
        porcentaje: document.getElementById('regPorcentaje'),
        observaciones: document.getElementById('regObservaciones')
    };

    // --- 3. LÓGICA DE POBLACIÓN XML (Usa DOMParser en la cadena) ---
    cargarDatosConfiguracionXML(xmlCatalogoString);
    
    function cargarDatosConfiguracionXML(xmlString) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");

            // Poblar selectores
            poblarSelectoresDesdeXML(xmlDoc, 'Facultades', selectFacultad);
            poblarSelectoresDesdeXML(xmlDoc, 'TiposDiscapacidad', selectTipoDiscapacidad);
            poblarSelectoresDesdeXML(xmlDoc, 'Generos', selectGenero); 

        } catch (error) {
            console.error("Error al procesar el XML string integrado:", error);
        }
    }
    
    function poblarSelectoresDesdeXML(xmlDoc, listaId, selectElement) {
        const listaXML = xmlDoc.querySelector(`Lista[id="${listaId}"]`);

        if (listaXML) {
            const items = listaXML.querySelectorAll('Item');
            
            items.forEach(item => {
                const valor = item.getAttribute('valor');
                const texto = item.textContent;
                
                const option = document.createElement('option');
                option.value = valor;
                option.textContent = texto;
                selectElement.appendChild(option);
            });
        }
    }


    // --- 4. FUNCIÓN PRINCIPAL DE VALIDACIÓN (Su lógica original) ---
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        limpiarErrores();
        let esValido = true;
        
        // --- VALIDACIÓN EN BUCLE ---

        for (const key in inputs) {
            const input = inputs[key];
            
            if (!input) continue;

            const valor = input.value.trim();

            // A. OBLIGATORIO (Usando 'Selecciona...' como valor vacío de select)
            const noRequeridos = ['direccion', 'observaciones']; 

            if (!noRequeridos.includes(key)) {
                if (valor === '' || valor === 'Selecciona...') {
                    mostrarError(input, 'Este campo es obligatorio.');
                    esValido = false;
                    continue; 
                }
            } else if (valor === '') {
                 continue;
            }

            // --- VALIDACIONES ESPECÍFICAS (Su lógica) ---
            
            // CÉDULA (10 dígitos)
            if (key === 'cedula' && (valor.length !== 10 || !/^\d{10}$/.test(valor))) {
                mostrarError(input, 'La cédula debe tener exactamente 10 dígitos y solo números.');
                esValido = false;
            }
            
            // CELULAR (10 dígitos)
            if (key === 'celular' && (valor.length !== 10 || !/^\d{10}$/.test(valor))) {
                mostrarError(input, 'El celular debe tener exactamente 10 dígitos y solo números.');
                esValido = false;
            }

            // CORREO ELECTRÓNICO (Formato básico)
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (key === 'correo' && !regexCorreo.test(valor)) {
                mostrarError(input, 'El formato de correo no es válido (ej: usuario@dominio.com).');
                esValido = false;
            }
            
            // USUARIO (5-10 caracteres)
            if (key === 'usuario' && (valor.length < 5 || valor.length > 10)) {
                mostrarError(input, 'El usuario debe tener entre 5 y 10 caracteres.');
                esValido = false;
            }

            // CONTRASEÑA (Mínimo 8 caracteres)
            if (key === 'password' && valor.length < 8) {
                mostrarError(input, 'La contraseña debe tener al menos 8 caracteres.');
                esValido = false;
            }
            
            // FECHA DE NACIMIENTO (Mayor de 16 años)
            if (key === 'fechaNacimiento') {
                const valorFecha = input.value;
                if(valorFecha) {
                    const fechaNac = new Date(valorFecha);
                    const hoy = new Date();
                    const edadAnios = (hoy - fechaNac) / (1000 * 60 * 60 * 24 * 365.25); 

                    if (edadAnios < 16) {
                        mostrarError(input, 'La persona debe ser mayor de 16 años.');
                        esValido = false;
                    }
                }
            }
            
            // PORCENTAJE (Entre 0 y 100)
            if (key === 'porcentaje') {
                const numValor = parseInt(valor, 10);
                if (isNaN(numValor) || numValor < 0 || numValor > 100) {
                    mostrarError(input, 'El porcentaje debe ser un número entre 0 y 100.');
                    esValido = false;
                }
            }
        } 


        // --- RESULTADO FINAL ---
        if (esValido) {
            alert('✅ Registro exitoso. ¡Validaciones superadas!');
        } else {
            document.querySelector('.input-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // --- FUNCIONES DE FEEDBACK (Mantenidas) ---
    
    function mostrarError(elemento, mensaje) {
        if (elemento.nextElementSibling && elemento.nextElementSibling.classList.contains('error-message')) {
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