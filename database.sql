CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

DROP TABLE IF EXISTS empresas;
CREATE TABLE empresas (
  id_empresa INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  giro VARCHAR(100) NOT NULL,
  tamaño ENUM('Pequeña', 'Mediana', 'Grande') NOT NULL,
  teléfono VARCHAR(20) NOT NULL,
  fecha_registro DATE NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  dirección VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS vacantes;
CREATE TABLE vacantes (
  id_vacante INT AUTO_INCREMENT PRIMARY KEY,
  id_empresa INT NOT NULL,
  puesto VARCHAR(100) NOT NULL,
  descripción TEXT NOT NULL,
  salario DECIMAL(12, 2) NOT NULL,
  modalidad ENUM('Presencial', 'Remoto', 'Híbrido') NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  fecha_publicación DATE NOT NULL,
  estatus ENUM('Activa', 'Cerrada', 'Pausada') NOT NULL DEFAULT 'Activa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
  INDEX idx_empresa (id_empresa),
  INDEX idx_estatus (estatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS postulaciones;
CREATE TABLE postulaciones (
  id_postulación INT AUTO_INCREMENT PRIMARY KEY,
  id_vacante INT NOT NULL,
  nombre_postulante VARCHAR(255) NOT NULL,
  correo VARCHAR(255) NOT NULL,
  teléfono VARCHAR(20) NOT NULL,
  cv_url VARCHAR(500) NOT NULL,
  fecha_postulación DATE NOT NULL,
  estatus ENUM('En revisión', 'Aceptada', 'Rechazada') NOT NULL DEFAULT 'En revisión',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_vacante) REFERENCES vacantes(id_vacante) ON DELETE CASCADE,
  INDEX idx_vacante (id_vacante),
  INDEX idx_estatus (estatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_empresa_ciudad ON empresas(ciudad);
CREATE INDEX idx_vacante_especialidad ON vacantes(especialidad);
CREATE INDEX idx_postulacion_correo ON postulaciones(correo);
