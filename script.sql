CREATE TYPE estados_usuarios AS ENUM ('ACTIVO','BAJA');
CREATE TYPE estados_clientes AS ENUM ('ACTIVO','BAJA');
CREATE TYPE estados_proyectos AS ENUM ('ACTIVO','FINALIZADO','BAJA');
CREATE TYPE estados_metas AS ENUM ('ACTIVO','FINALIZADA','BAJA');
CREATE TYPE estados_tareas AS ENUM ('PENDIENTE','FINALIZADA','BAJA');

CREATE TYPE "rol_enum" AS ENUM ('user', 'admin');

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    clave TEXT NOT NULL,
    estado estados_usuarios NOT NULL
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    email TEXT NULL,
    telefono TEXT NULL,
    estado estados_clientes NOT NULL
);

CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    estado estados_proyectos NOT NULL,
    id_cliente INT,
    CONSTRAINT fk_proyectos_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes (id)
);

CREATE TABLE metas (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    estado estados_metas NOT NULL,
    id_proyecto INT NOT NULL,
    CONSTRAINT fk_metas_proyecto
        FOREIGN KEY (id_proyecto)
        REFERENCES proyectos (id)
);

CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    estado estados_tareas NOT NULL,
    id_proyecto INT NOT NULL,
    id_meta INT NOT NULL,
    CONSTRAINT fk_tareas_proyecto
        FOREIGN KEY (id_proyecto)
        REFERENCES proyectos (id),
    CONSTRAINT fk_tareas_meta
        FOREIGN KEY (id_meta)
        REFERENCES metas (id)
);

ALTER TABLE usuarios 
ADD COLUMN rol "rol_enum" NOT NULL DEFAULT 'user';

CREATE EXTENSION IF NOT EXISTS pgcrypto;

insert into usuarios (nombre, clave, estado, rol) values ('usuario', crypt('clave', gen_salt('bf', 10)), 'ACTIVO', 'admin');