CREATE TABLE solicitudesMatriculacion (
    id SERIAL PRIMARY KEY,
    codigo SERIAL UNIQUE, -- Código autoincremental único
    apellidos TEXT NOT NULL,
    nombres TEXT NOT NULL,
    provincia_nacimiento TEXT,
    canton TEXT,
    genero TEXT,
    fecha_nacimiento DATE,
    nacionalidad TEXT,
    institucion_procede TEXT, -- Institución de procedencia (nuevos alumnos)

    -- Datos de la Vivienda
    provincia_vivienda TEXT,
    ciudad TEXT,
    parroquia TEXT,
    direccion TEXT,
    telefono_convencional TEXT,

    -- Contacto de Emergencia
    emergencia_nombres TEXT,
    emergencia_parentesco TEXT,

    -- Datos del Padre
    padre_nombres TEXT,
    padre_cedula TEXT,
    padre_telefono TEXT,
    padre_profesion TEXT,
    padre_email TEXT,

    -- Datos de la Madre
    madre_nombres TEXT,
    madre_cedula TEXT,
    madre_telefono TEXT,
    madre_profesion TEXT,
    madre_email TEXT,

    -- Datos del Representante Legal
    representante_nombres TEXT,
    representante_cedula TEXT,
    representante_telefono TEXT,
    representante_profesion TEXT,
    representante_email TEXT,

    -- Ubicación señalada en el mapa
    latitud FLOAT,
    longitud FLOAT,

    created_at TIMESTAMP DEFAULT NOW()
);
