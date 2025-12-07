document.addEventListener('DOMContentLoaded', () => {

// -----------------------------------------------------------------
    //  PASO 1: SIMULACIÓN DEL JSON DE DATOS (Lista de usuarios)
    // -----------------------------------------------------------------
    const dataUsuarios = [
        {
usuario: "isaac01",
            nombre: "Isaac",
            apellido: "Arturo",
            correo: "isaac.arturo@uleam.edu.ec",
            rol: "Administrador",
            estado: "Activo"
        },
        {
            usuario: "melanieC",
            nombre: "Melanie",
            apellido: "Carolina",
            correo: "melanie.c@uleam.edu.ec",
            rol: "Administrador",
            estado: "Activo"
        },
        {
            usuario: "francoV",
            nombre: "Francisco",
            apellido: "Villon",
            correo: "francisco.v@uleam.edu.ec",
            rol: "Usuario",
            estado: "Activo"
        },
        {
            usuario: "carlaG",
            nombre: "Carla",
            apellido: "Gómez",
            correo: "carla.gomez@uleam.edu.ec",
            rol: "Tutor",
            estado: "Activo"
        },
        
        // --- 6 USUARIOS NUEVOS ---
        {
            usuario: "anaM",
            nombre: "Ana",
            apellido: "Mendoza",
            correo: "ana.mendoza@uleam.edu.ec",
            rol: "Docente",
            estado: "Activo"
        },
        {
            usuario: "pedroR",
            nombre: "Pedro",
            apellido: "Ramirez",
            correo: "pedro.ramirez@uleam.edu.ec",
            rol: "Tutor",
            estado: "Activo"
        },
        {
            usuario: "javiS",
            nombre: "Javier",
            apellido: "Saltos",
            correo: "javier.saltos@uleam.edu.ec",
            rol: "Coordinador",
            estado: "Activo"
        },
        {
            usuario: "luisaP",
            nombre: "Luisa",
            apellido: "Párraga",
            correo: "luisa.parraga@uleam.edu.ec",
            rol: "Docente",
            estado: "Inactivo" // Usuario inactivo
        },
        {
            usuario: "robertoA",
            nombre: "Roberto",
            apellido: "Aguirre",
            correo: "roberto.aguirre@uleam.edu.ec",
            rol: "Usuario",
            estado: "Activo"
        },
        {
            usuario: "eliV",
            nombre: "Eliana",
            apellido: "Vargas",
            correo: "eliana.vargas@uleam.edu.ec",
            rol: "Coordinador",
            estado: "Activo"
        }
    ];
        // ¡Puedes agregar 100 usuarios más aquí

    // -----------------------------------------------------------------
    //  PASO 2: PINTAR LOS DATOS EN LA TABLA
    // -----------------------------------------------------------------
    const tablaBody = document.getElementById('users-table-body');
    
    if (tablaBody) {
        dataUsuarios.forEach(usuario => {
            // Crea la fila <tr>
            const fila = document.createElement('tr');
            
            // Llena el HTML interno con los datos del JSON
            fila.innerHTML = `
                <td data-label="Usuario">${usuario.usuario}</td>
                <td data-label="Nombre">${usuario.nombre}</td>
                <td data-label="Correo">${usuario.correo}</td>
                <td data-label="Rol">${usuario.rol}</td>
                <td data-label="Estado">${usuario.estado}</td>
                <td data-label="Acciones" class="actions-cell">
                    <button class="btn-icon btn-edit" title="Editar">✏️</button>
                    <button class="btn-icon btn-delete" title="Eliminar">🗑️</button>
                </td>
            `;
            // Agrega la fila al <tbody>
            tablaBody.appendChild(fila);
        });
    }

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