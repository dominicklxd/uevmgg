// Función para registrar un nuevo usuario
function registrarUsuario(usuario, email, password) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioExistente = usuarios.some(u => u.email === email);

    if (usuarioExistente) {
        return { success: false, message: 'El correo electrónico ya está registrado.' };
    }

    usuarios.push({ usuario, email, password });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    return { success: true, message: 'Usuario registrado exitosamente.' };
}

// Función para iniciar sesión
function iniciarSesion(email, password) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        return { success: true, message: 'Inicio de sesión exitoso.' };
    }

    return { success: false, message: 'Correo o contraseña incorrectos.' };
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    return { success: true, message: 'Sesión cerrada exitosamente.' };
}

// Exportar funciones para usarlas en otros archivos
export { registrarUsuario, iniciarSesion, cerrarSesion };
