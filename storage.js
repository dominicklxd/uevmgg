// Función para guardar datos en localStorage
function guardarEnStorage(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}

// Función para obtener datos de localStorage
function obtenerDeStorage(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

// Función para eliminar datos de localStorage
function eliminarDeStorage(clave) {
    localStorage.removeItem(clave);
}

// Función para verificar si un usuario es administrador
function esAdministrador(usuario) {
    return usuario && usuario.rol === 'administrador';
}

// Exportar funciones para usarlas en otros archivos
export { guardarEnStorage, obtenerDeStorage, eliminarDeStorage, esAdministrador };
