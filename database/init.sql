CREATE DATABASE IF NOT EXISTS smartnotify;

USE smartnotify;

CREATE TABLE IF NOT EXISTS solicitudes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreCliente VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    asunto VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    informacionAdicional TEXT,
    estado ENUM(
        'Pendiente',
        'Asignada',
        'En proceso',
        'Finalizada',
        'Cancelada'
    ) NOT NULL DEFAULT 'Pendiente',
    solucionConfirmada BOOLEAN NOT NULL DEFAULT FALSE,
    fechaCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);