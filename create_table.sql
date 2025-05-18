DROP TABLE IF EXISTS curso_nivel CASCADE;
DROP TABLE IF EXISTS nivel_grado CASCADE;

CREATE TABLE nivel_grado (
    id_nivel SERIAL PRIMARY KEY,
    nombre_nivel VARCHAR(50) NOT NULL -- Ej: Inicial, 1ro EGB, 2do EGB, ..., 3ro Bachillerato
);

CREATE TABLE curso_nivel (
    id_curso SERIAL PRIMARY KEY,
    nombre_curso VARCHAR(50) NOT NULL,
    id_nivel INTEGER REFERENCES nivel_grado(id_nivel)
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

-- Índices para filtros de búsqueda rápidos
CREATE INDEX IF NOT EXISTS idx_solicitud_matriculacion_estado ON solicitud_matriculacion(estado);
CREATE INDEX IF NOT EXISTS idx_estudiante_cedula ON estudiante(id_cedula);
CREATE INDEX IF NOT EXISTS idx_estudiante_nombres ON estudiante(nombres);
CREATE INDEX IF NOT EXISTS idx_estudiante_apellidos ON estudiante(apellidos);
