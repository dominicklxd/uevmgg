DROP TABLE IF EXISTS curso_nivel CASCADE;
DROP TABLE IF EXISTS nivel_grado CASCADE;
DROP TABLE IF EXISTS curso_grado CASCADE;
DROP TABLE IF EXISTS asistencias CASCADE;

CREATE TABLE nivel_grado (
    id_nivel SERIAL PRIMARY KEY,
    nombre_nivel VARCHAR(50) NOT NULL -- Ej: Inicial, 1ro EGB, 2do EGB, ..., 3ro Bachillerato
);

CREATE TABLE curso_nivel (
    id_curso SERIAL PRIMARY KEY,
    nombre_curso VARCHAR(50) NOT NULL,
    id_nivel INTEGER REFERENCES nivel_grado(id_nivel)
);

CREATE TABLE IF NOT EXISTS curso_grado (
    id_grado SERIAL PRIMARY KEY,
    nombre_nivel VARCHAR(50) NOT NULL, -- Ej: "Bachillerato", "EGB"
    grado VARCHAR(20) NOT NULL,        -- Ej: "3ro", "2do", "1ro", "10mo"
    paralelo VARCHAR(2) NOT NULL,      -- "A", "B", "C"
    especialidad VARCHAR(50)           -- Puede ser NULL para EGB
);

CREATE TABLE IF NOT EXISTS solicitud_inscripcion (
    id SERIAL PRIMARY KEY,
    periodo VARCHAR(20) NOT NULL,
    id_nivel INTEGER REFERENCES nivel_grado(id_nivel),
    id_curso INTEGER REFERENCES curso_nivel(id_curso),
    paralelo VARCHAR(2) NOT NULL,
    especialidad VARCHAR(50)
);

ALTER TABLE solicitud_inscripcion
ADD COLUMN IF NOT EXISTS institucion_procedencia VARCHAR(255);

-- Añadir columna id_estudiante a solicitud_inscripcion si no existe
ALTER TABLE solicitud_inscripcion
ADD COLUMN IF NOT EXISTS id_estudiante INTEGER REFERENCES estudiante(id_estudiante);

ALTER TABLE solicitud_inscripcion
ADD COLUMN IF NOT EXISTS id_grado INTEGER REFERENCES curso_grado(id_grado);

-- Tabla para manejar las cédulas como ID principal
CREATE TABLE IF NOT EXISTS cedulas (
    id_cedula SERIAL PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL
);

-- Tabla de estudiantes, relacionada con cedulas y solicitud_inscripcion
CREATE TABLE IF NOT EXISTS estudiante (
    id_estudiante SERIAL PRIMARY KEY,
    id_cedula INTEGER NOT NULL REFERENCES cedulas(id_cedula),
    id_inscripcion INTEGER REFERENCES solicitud_inscripcion(id),
    apellidos VARCHAR(100) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    tipo_sangre VARCHAR(10),
    fecha_nacimiento DATE,
    sexo VARCHAR(20),
    telefono VARCHAR(30),
    telefono_convencional VARCHAR(30),
    correo VARCHAR(100),
    archivo_url TEXT, -- URL o ruta del archivo adjunto
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE estudiante
ADD COLUMN IF NOT EXISTS etnia VARCHAR(50),
ADD COLUMN IF NOT EXISTS nacionalidad VARCHAR(100),
ADD COLUMN IF NOT EXISTS pdf_url TEXT;

CREATE TABLE IF NOT EXISTS direccion_estudiante (
    id_direccion SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id_estudiante),
    calle_principal VARCHAR(100),
    calle_secundaria VARCHAR(100),
    provincia VARCHAR(100),
    canton VARCHAR(100),
    parroquia VARCHAR(100),
    barrio VARCHAR(100),
    numero_casa VARCHAR(20),
    referencia VARCHAR(200),
    latitud VARCHAR(50),
    longitud VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS padre_estudiante (
    id_padre SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id_estudiante),
    nombres VARCHAR(100) NOT NULL,
    cedula VARCHAR(20),
    ocupacion VARCHAR(100),
    telefono_trabajo VARCHAR(30),
    email VARCHAR(100),
    nivel_educacion VARCHAR(100),
    estado_civil VARCHAR(50),
    vive_con_estudiante BOOLEAN,
    horario_trabajo VARCHAR(100),
    telefono_celular VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS madre_estudiante (
    id_madre SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id_estudiante),
    nombres VARCHAR(100) NOT NULL,
    cedula VARCHAR(20),
    ocupacion VARCHAR(100),
    telefono_trabajo VARCHAR(30),
    email VARCHAR(100),
    nivel_educacion VARCHAR(100),
    estado_civil VARCHAR(50),
    vive_con_estudiante BOOLEAN,
    horario_trabajo VARCHAR(100),
    telefono_celular VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS representante_estudiante (
    id_representante SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id_estudiante),
    nombres VARCHAR(100) NOT NULL,
    cedula VARCHAR(20),
    ocupacion VARCHAR(100),
    telefono_trabajo VARCHAR(30),
    email VARCHAR(100),
    nivel_educacion VARCHAR(100),
    estado_civil VARCHAR(50),
    vive_con_estudiante BOOLEAN,
    horario_trabajo VARCHAR(100),
    telefono_celular VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacto_emergencia_estudiante (
    id_contacto SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id_estudiante),
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- NUEVO: Tabla para solicitudes de matriculación (registro y control de estado)
CREATE TABLE IF NOT EXISTS solicitud_matriculacion (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id_estudiante),
    estado VARCHAR(30) NOT NULL DEFAULT 'entrante', -- 'entrante', 'verificada'
    pdf_url TEXT, -- URL al PDF generado de la ficha
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_verificacion TIMESTAMP,
    verificado_por VARCHAR(100) -- email o nombre del admin que verifica
);

-- NUEVO: Tabla para asistencias de estudiantes
CREATE TABLE IF NOT EXISTS asistencias (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id_estudiante),
    fecha DATE NOT NULL,
    presente BOOLEAN NOT NULL,
    UNIQUE (id_estudiante, fecha)
);

-- Índices para filtros de búsqueda rápidos
CREATE INDEX IF NOT EXISTS idx_solicitud_matriculacion_estado ON solicitud_matriculacion(estado);
CREATE INDEX IF NOT EXISTS idx_estudiante_cedula ON estudiante(id_cedula);
CREATE INDEX IF NOT EXISTS idx_estudiante_nombres ON estudiante(nombres);
CREATE INDEX IF NOT EXISTS idx_estudiante_apellidos ON estudiante(apellidos);
-- Crear índice para búsquedas rápidas por id_estudiante en solicitud_inscripcion
CREATE INDEX IF NOT EXISTS idx_solicitud_inscripcion_id_estudiante ON solicitud_inscripcion(id_estudiante);

-- Asegúrate de que la relación entre estudiante y solicitud_inscripcion sea correcta:
-- El campo id_inscripcion en estudiante debe ser FOREIGN KEY a solicitud_inscripcion(id)
ALTER TABLE estudiante
ADD CONSTRAINT fk_estudiante_id_inscripcion
FOREIGN KEY (id_inscripcion) REFERENCES solicitud_inscripcion(id);

-- Ejemplo de inserción en curso_grado
INSERT INTO curso_grado (nombre_nivel, grado, paralelo, especialidad) VALUES
('EGB', '1ro', 'A', NULL),
('EGB', '1ro', 'B', NULL),
('EGB', '1ro', 'C', NULL),
('Bachillerato', '3ro', 'A', 'Informática'),
('Bachillerato', '3ro', 'B', 'Informática'),
('Bachillerato', '3ro', 'C', 'Informática'),
('Bachillerato', '3ro', 'A', 'Ciencias'),
('Bachillerato', '3ro', 'B', 'Ciencias'),
('Bachillerato', '3ro', 'C', 'Ciencias');
-- Inserción masiva de cursos y especialidades en curso_grado

-- EGB: 1ro a 10mo, paralelos A/B/C, sin especialidad
INSERT INTO curso_grado (nombre_nivel, grado, paralelo, especialidad) VALUES
-- 1ro a 10mo EGB
('EGB', '1ro', 'A', NULL), ('EGB', '1ro', 'B', NULL), ('EGB', '1ro', 'C', NULL),
('EGB', '2do', 'A', NULL), ('EGB', '2do', 'B', NULL), ('EGB', '2do', 'C', NULL),
('EGB', '3ro', 'A', NULL), ('EGB', '3ro', 'B', NULL), ('EGB', '3ro', 'C', NULL),
('EGB', '4to', 'A', NULL), ('EGB', '4to', 'B', NULL), ('EGB', '4to', 'C', NULL),
('EGB', '5to', 'A', NULL), ('EGB', '5to', 'B', NULL), ('EGB', '5to', 'C', NULL),
('EGB', '6to', 'A', NULL), ('EGB', '6to', 'B', NULL), ('EGB', '6to', 'C', NULL),
('EGB', '7mo', 'A', NULL), ('EGB', '7mo', 'B', NULL), ('EGB', '7mo', 'C', NULL),
('EGB', '8vo', 'A', NULL), ('EGB', '8vo', 'B', NULL), ('EGB', '8vo', 'C', NULL),
('EGB', '9no', 'A', NULL), ('EGB', '9no', 'B', NULL), ('EGB', '9no', 'C', NULL),
('EGB', '10mo', 'A', NULL), ('EGB', '10mo', 'B', NULL), ('EGB', '10mo', 'C', NULL);

-- Bachillerato: 1ro/2do/3ro, paralelos A/B/C, especialidades
INSERT INTO curso_grado (nombre_nivel, grado, paralelo, especialidad) VALUES
-- 1ro Bachillerato
('Bachillerato', '1ro', 'A', 'Ciencias'), ('Bachillerato', '1ro', 'B', 'Ciencias'), ('Bachillerato', '1ro', 'C', 'Ciencias'),
('Bachillerato', '1ro', 'A', 'Informática'), ('Bachillerato', '1ro', 'B', 'Informática'), ('Bachillerato', '1ro', 'C', 'Informática'),
('Bachillerato', '1ro', 'A', 'Contabilidad'), ('Bachillerato', '1ro', 'B', 'Contabilidad'), ('Bachillerato', '1ro', 'C', 'Contabilidad'),
('Bachillerato', '1ro', 'A', 'Gestión Administrativa'), ('Bachillerato', '1ro', 'B', 'Gestión Administrativa'), ('Bachillerato', '1ro', 'C', 'Gestión Administrativa'),
-- 2do Bachillerato
('Bachillerato', '2do', 'A', 'Ciencias'), ('Bachillerato', '2do', 'B', 'Ciencias'), ('Bachillerato', '2do', 'C', 'Ciencias'),
('Bachillerato', '2do', 'A', 'Informática'), ('Bachillerato', '2do', 'B', 'Informática'), ('Bachillerato', '2do', 'C', 'Informática'),
('Bachillerato', '2do', 'A', 'Contabilidad'), ('Bachillerato', '2do', 'B', 'Contabilidad'), ('Bachillerato', '2do', 'C', 'Contabilidad'),
('Bachillerato', '2do', 'A', 'Gestión Administrativa'), ('Bachillerato', '2do', 'B', 'Gestión Administrativa'), ('Bachillerato', '2do', 'C', 'Gestión Administrativa'),
-- 3ro Bachillerato
('Bachillerato', '3ro', 'A', 'Ciencias'), ('Bachillerato', '3ro', 'B', 'Ciencias'), ('Bachillerato', '3ro', 'C', 'Ciencias'),
('Bachillerato', '3ro', 'A', 'Informática'), ('Bachillerato', '3ro', 'B', 'Informática'), ('Bachillerato', '3ro', 'C', 'Informática'),
('Bachillerato', '3ro', 'A', 'Contabilidad'), ('Bachillerato', '3ro', 'B', 'Contabilidad'), ('Bachillerato', '3ro', 'C', 'Contabilidad'),
('Bachillerato', '3ro', 'A', 'Gestión Administrativa'), ('Bachillerato', '3ro', 'B', 'Gestión Administrativa'), ('Bachillerato', '3ro', 'C', 'Gestión Administrativa');
-- ...agrega todos los cursos y especialidades necesarios
