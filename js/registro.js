document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    // 1. SELECTORES: Mapeo de todos los inputs del formulario
    const inputs = {
        // Datos Personales
        nombre: document.querySelector('input[placeholder="Primer nombre"]'),
        apellido: document.querySelector('input[placeholder="Primer apellido"]'),
        cedula: document.querySelector('input[placeholder="Número de identificación"]'),
        fechaNacimiento: document.querySelector('input[type="date"]'),
        genero: document.querySelector('select:nth-of-type(1)'),
        
        // Credenciales de Acceso
        usuario: document.getElementById('inputUsuario'), // ID del campo de usuario
        password: document.getElementById('inputPassword'), // ID del campo de contraseña
        
        // Contacto
        celular: document.querySelector('input[type="tel"]'),
        correo: document.querySelector('input[type="email"]'),
        direccion: document.querySelector('input[placeholder="Av. Principal, Ciudad"]'),
        
        // Académico y Discapacidad
        facultad: document.querySelector('select:nth-of-type(2)'),
        tipoDiscapacidad: document.querySelector('select:nth-of-type(3)'),
        porcentaje: document.querySelector('input[type="number"][min="0"][max="100"]'),
        observaciones: document.querySelector('textarea')
    };

    // 2. FUNCIÓN PRINCIPAL DE VALIDACIÓN
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        limpiarErrores();
        let esValido = true;
        
        // --- BUENA PRÁCTICA: VALIDACIÓN EN BUCLE ---

        for (const key in inputs) {
            const input = inputs[key];
            const valor = input.value.trim();

            // A. OBLIGATORIO (Todos los campos son obligatorios)
            if (valor === '' || valor === 'Selecciona...') {
                mostrarError(input, 'Este campo es obligatorio.');
                esValido = false;
                continue; 
            }

            
            // CÉDULA (10 dígitos)
            if (key === 'cedula' && (valor.length !== 10 || !/^\d{10}$/.test(valor))) {
                mostrarError(input, 'La cédula debe tener exactamente 10 dígitos y solo números.');
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
            
            // FECHA DE NACIMIENTO (Mayor de 18 años)
            if (key === 'fechaNacimiento') {
                const fechaNac = new Date(valor);
                const hoy = new Date();
                // Cálculo simple de edad (aproximado)
                const edadAnios = (hoy - fechaNac) / (1000 * 60 * 60 * 24 * 365.25); 

                if (edadAnios < 18) {
                    mostrarError(input, 'La persona debe ser mayor de 18 años.');
                    esValido = false;
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

    // --- FUNCIONES DE FEEDBACK (Necesarias) ---
    
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