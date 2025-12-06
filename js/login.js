
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    const inputUsuario = document.getElementById('usuario');
    const inputPassword = document.getElementById('password');

    // 1. La función principal se ejecuta al enviar el formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        limpiarErrores();
        let esValido = true;
        
        const usuario = inputUsuario.value.trim();
        const password = inputPassword.value.trim();

        // --- 1. Validar Usuario (Obligatorio y Longitud 5-10) ---
        if (usuario === '') {
            mostrarError(inputUsuario, 'El nombre de usuario es obligatorio.');
            esValido = false;
        } else if (usuario.length < 5 || usuario.length > 10) {
            mostrarError(inputUsuario, 'Debe tener entre 5 y 10 caracteres.');
            esValido = false;
        }

        // 2. Validar Contraseña (Obligatoria y Longitud Mínima 8) ---
        if (password === '') {
            mostrarError(inputPassword, 'La contraseña es obligatoria.');
            esValido = false;
        } else if (password.length < 8) {
            mostrarError(inputPassword, 'Debe tener al menos 8 caracteres.');
            esValido = false;
        }

        // 3. Resultado
        if (esValido) {
            alert('✅ ¡Validaciones superadas! El código está listo para la autenticación en el servidor.');
        } else {
        
            document.querySelector('.input-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // --- Funciones de Feedback (Necesarias) ---
    
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