document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-user-form');
    
    // Selectores de campos
    const nombreUsuario = document.getElementById('nombreUsuario');
    const apellidoUsuario = document.getElementById('apellidoUsuario');
    const correoUsuario = document.getElementById('correoUsuario');
    const loginUsuario = document.getElementById('loginUsuario');
    const contrasena = document.getElementById('contrasena');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        validarFormulario();
    });

    function validarFormulario() {
        limpiarErrores();
        let esValido = true;

        // Validación de Nombre
        const nombre = nombreUsuario.value.trim();
        if (nombre === "") {
            mostrarError(nombreUsuario, 'El nombre es obligatorio.');
            esValido = false;
        } else if (!esAlfabeticoConEspacios(nombre)) {
            mostrarError(nombreUsuario, 'El nombre solo puede contener letras y espacios.');
            esValido = false;
        }

        // Validación de Apellido
        const apellido = apellidoUsuario.value.trim();
        if (apellido === "") {
            mostrarError(apellidoUsuario, 'El apellido es obligatorio.');
            esValido = false;
        } else if (!esAlfabeticoConEspacios(apellido)) {
            mostrarError(apellidoUsuario, 'El apellido solo puede contener letras y espacios.');
            esValido = false;
        }

        // Validación de Correo Electrónico
        const correo = correoUsuario.value.trim();
        if (correo === "") {
            mostrarError(correoUsuario, 'El correo electrónico es obligatorio.');
            esValido = false;
        } else if (!esCorreoValido(correo)) {
            mostrarError(correoUsuario, 'Ingrese un formato de correo válido.');
            esValido = false;
        }

        // Validación de Usuario (Login)
        const login = loginUsuario.value.trim();
        if (login === "") {
            mostrarError(loginUsuario, 'El usuario (login) es obligatorio.');
            esValido = false;
        } else if (login.length < 5) {
            mostrarError(loginUsuario, 'El usuario debe tener al menos 5 caracteres.');
            esValido = false;
        }

        // Validación de Contraseña
        if (contrasena.value.length < 8) {
            mostrarError(contrasena, 'La contraseña debe tener al menos 8 caracteres.');
            esValido = false;
        }
        
        // Validación de Rol

        if (esValido) {
            console.log('Usuario válido. Simulación de creación de usuario.');
            form.reset();
        } else {
             // Mueve la vista al primer error
             document.querySelector('.add-user-card .input-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }


    function esAlfabeticoConEspacios(cadena) {
        // Expresión regular que solo permite letras y espacios.
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(cadena);
    }

    function esCorreoValido(email) {
        // Regex simple para validar formato de correo electrónico
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

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
});