document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('filtroForm');
    const inputNombre = document.getElementById('filtroNombre');
    const inputEdad = document.getElementById('filtroEdad');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        limpiarErrores();
        let esValido = true;
        
        // 1. Validar Nombre (solo si hay contenido)
        if (inputNombre.value.trim() !== '') {
            if (!validarNombreSoloLetras(inputNombre)) {
                esValido = false;
            }
        }
        
        // 2. Validar Edad (solo si hay contenido)
        if (inputEdad.value.trim() !== '') {
            if (!validarEdadEntera(inputEdad)) {
                esValido = false;
            }
        }
        
        // --- RESULTADO FINAL ---
        if (esValido) { 
            console.log('Filtros validados. Listo para enviar al servidor.');
        } else {
            document.querySelector('.input-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    
    /** Valida que el campo Nombre contenga solo letras y espacios. */
    function validarNombreSoloLetras(input) {
        const valor = input.value.trim();
        // Expresión regular: solo acepta letras (mayúsculas/minúsculas) y espacios.
        const regexLetras = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/; 

        if (!regexLetras.test(valor)) {
            mostrarError(input, 'El nombre solo puede contener letras y espacios. Números o caracteres especiales no son válidos.');
            return false;
        }
        return true;
    }
    
    /** Valida que el campo Edad contenga solo números enteros y positivos. */
    function validarEdadEntera(input) {
        const valor = input.value.trim();
        const numero = Number(valor);

        // 1. Verificar si es un número válido y positivo
        if (isNaN(numero) || numero <= 0) {
            mostrarError(input, 'La edad debe ser un número entero y positivo (mayor a cero).');
            return false;
        }

        // 2. Verificar que no contenga decimales
        if (!Number.isInteger(numero)) {
            mostrarError(input, 'La edad debe ser un número entero, no se permiten decimales.');
            return false;
        }
        
        return true;
    }
    
    // --- FUNCIONES DE FEEDBACK ---
    
    function mostrarError(elemento, mensaje) {
        // Evita duplicar el mensaje de error
        if (elemento.nextElementSibling && elemento.nextElementSibling.classList.contains('error-message')) {
            elemento.nextElementSibling.textContent = '❌ ' + mensaje; // Asegura que el mensaje se actualice
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