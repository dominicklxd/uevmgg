-- Elimina todos los datos relacionados con el estudiante con id_estudiante 61, id_cedula 12, id_inscripcion 78 y cédula 0401970769

-- 1. Elimina datos relacionados
DELETE FROM contacto_emergencia_estudiante WHERE id_estudiante = 61;
DELETE FROM representante_estudiante WHERE id_estudiante = 61;
DELETE FROM madre_estudiante WHERE id_estudiante = 61;
DELETE FROM padre_estudiante WHERE id_estudiante = 61;
DELETE FROM direccion_estudiante WHERE id_estudiante = 61;
DELETE FROM solicitud_matriculacion WHERE id_estudiante = 61;

-- 2. Elimina el estudiante (esto libera la referencia a la inscripción)
DELETE FROM estudiante WHERE id_estudiante = 61;

-- 3. Elimina la inscripción asociada (ya no hay referencia)
DELETE FROM solicitud_inscripcion WHERE id = 78;

-- 4. Elimina la cédula asociada
DELETE FROM cedulas WHERE id_cedula = 12;

-- 5. Elimina el usuario cuyo email es la cédula
DELETE FROM usuarios WHERE email = '0401970769';
