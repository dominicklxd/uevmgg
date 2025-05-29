-- 1. Insertar cédula si no existe
INSERT INTO cedulas (cedula)
SELECT '1050938453'
WHERE NOT EXISTS (SELECT 1 FROM cedulas WHERE cedula = '1050938453');

-- 2. Insertar solicitud_inscripcion
INSERT INTO solicitud_inscripcion (periodo, id_grado, paralelo, especialidad, institucion_procedencia)
VALUES (
    '2024-2025',
    (SELECT id_grado FROM curso_grado WHERE nombre_nivel = 'EGB' AND grado = '1ro' AND paralelo = 'B' AND (especialidad IS NULL OR especialidad = '')),
    'B',
    NULL,
    'V'
);

-- 3. Insertar estudiante
INSERT INTO estudiante (
    id_cedula, id_inscripcion, apellidos, nombres, correo, tipo_sangre, fecha_nacimiento, sexo, telefono, telefono_convencional, etnia, nacionalidad, archivo_url
)
VALUES (
    (SELECT id_cedula FROM cedulas WHERE cedula = '1050938453'),
    (SELECT id FROM solicitud_inscripcion ORDER BY id DESC LIMIT 1),
    'ARMAS ROCAFUERTE',
    'LISETTE PATRICIA',
    'arrolipa14387072@estudiantes.edu.ec',
    'V',
    '1111-11-11',
    'Masculino', -- sexo
    'V',
    'V',
    'Mestizo',   -- etnia
    'V',
    'https://i.ibb.co/cKGT82LC/b07636cc1b07.png'
);

-- 4. Insertar dirección del estudiante (ubicación predeterminada de la institución)
INSERT INTO direccion_estudiante (
    id_estudiante, calle_principal, calle_secundaria, provincia, canton, parroquia, barrio, numero_casa, referencia, latitud, longitud
)
VALUES (
    (SELECT id_estudiante FROM estudiante WHERE id_cedula = (SELECT id_cedula FROM cedulas WHERE cedula = '1050938453') ORDER BY id_estudiante DESC LIMIT 1),
    'V','V','V','V','V','V','V','V',
    0.33616444871436085, -78.11604869660802
);

-- 5. Insertar padre
INSERT INTO padre_estudiante (
    id_estudiante, nombres, cedula, ocupacion, telefono_trabajo, email, nivel_educacion, estado_civil, vive_con_estudiante, horario_trabajo, telefono_celular
)
VALUES (
    (SELECT id_estudiante FROM estudiante WHERE id_cedula = (SELECT id_cedula FROM cedulas WHERE cedula = '1050938453') ORDER BY id_estudiante DESC LIMIT 1),
    'V','V','V','V','V','V','Viudo/a',true,'V','V'
);

-- 6. Insertar madre
INSERT INTO madre_estudiante (
    id_estudiante, nombres, cedula, ocupacion, telefono_trabajo, email, nivel_educacion, estado_civil, vive_con_estudiante, horario_trabajo, telefono_celular
)
VALUES (
    (SELECT id_estudiante FROM estudiante WHERE id_cedula = (SELECT id_cedula FROM cedulas WHERE cedula = '1050938453') ORDER BY id_estudiante DESC LIMIT 1),
    'V','V','V','V','V','V','Viudo/a',true,'V','V'
);

-- 7. Insertar representante
INSERT INTO representante_estudiante (
    id_estudiante, nombres, cedula, ocupacion, telefono_trabajo, email, nivel_educacion, estado_civil, vive_con_estudiante, horario_trabajo, telefono_celular
)
VALUES (
    (SELECT id_estudiante FROM estudiante WHERE id_cedula = (SELECT id_cedula FROM cedulas WHERE cedula = '1050938453') ORDER BY id_estudiante DESC LIMIT 1),
    'V','V','V','V','V','V','Viudo/a',true,'V','V'
);

-- 8. Insertar contactos de emergencia
INSERT INTO contacto_emergencia_estudiante (id_estudiante, nombre, telefono, parentesco)
VALUES (
    (SELECT id_estudiante FROM estudiante WHERE id_cedula = (SELECT id_cedula FROM cedulas WHERE cedula = '1050938453') ORDER BY id_estudiante DESC LIMIT 1),
    'V', 'V', 'V'
);
INSERT INTO contacto_emergencia_estudiante (id_estudiante, nombre, telefono, parentesco)
VALUES (
    (SELECT id_estudiante FROM estudiante WHERE id_cedula = (SELECT id_cedula FROM cedulas WHERE cedula = '1050938453') ORDER BY id_estudiante DESC LIMIT 1),
    'V', 'V', 'V'
);

-- 9. Insertar solicitud de matrícula ENTRANTE (lista para verificar)
INSERT INTO solicitud_matriculacion (id_estudiante, estado, fecha_creacion)
VALUES (
    (SELECT id_estudiante FROM estudiante WHERE id_cedula = (SELECT id_cedula FROM cedulas WHERE cedula = '1050938453') ORDER BY id_estudiante DESC LIMIT 1),
    'entrante',
    NOW()
);

-- ELIMINAR TODOS LOS DATOS DEL ESTUDIANTE CON CÉDULA '10509384553'

-- FIN DE PLANTILLA
