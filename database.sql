-- 1. CREACIÓN DE TABLAS CATÁLOGO (LOOKUP TABLES)
-- Estas tablas reemplazan el texto libre del CSV.

CREATE TABLE property_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE -- Ej: '1 Family', 'Condo', 'Co-op'
);

CREATE TABLE conditions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE -- Ej: 'Needs Work', 'Move-In Condition'
);

CREATE TABLE zonings (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE -- Ej: 'R6', 'R5'
);

CREATE TABLE features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE -- Ej: 'Garage', 'Backyard', 'Elevator'
);

-- 2. TABLA DE CONFIGURACIÓN DEL CICLO (SCHEDULER)
-- Aquí se guarda la lógica de qué día del mes se envía cada grupo.
CREATE TABLE cycle_schedules (
    week_number INTEGER PRIMARY KEY CHECK (week_number IN (1, 2, 3, 4)),
    day_of_month INTEGER NOT NULL CHECK (day_of_month BETWEEN 1 AND 31),
    description VARCHAR(255) -- Ej: 'Grupo 1 sale el día 1 del mes'
);

-- Datos iniciales sugeridos por el PO (Día 1, 15, 30...)
INSERT INTO cycle_schedules (week_number, day_of_month, description) VALUES 
(1, 1, 'Start of the month'),
(2, 15, 'Middle of the month'),
(3, 25, 'End of the month'); -- Puse 25 para evitar problemas con febrero (día 30)

-- 3. TABLA PRINCIPAL: LISTINGS (PROPIEDADES)
CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    
    -- Datos directos del CSV (Limpiados)
    address VARCHAR(255) NOT NULL,
    location_description TEXT, -- Para 'Low 60s/18', etc.
    dimensions VARCHAR(100),   -- Ej: '16x63 on 24x100'
    
    -- Manejo de datos "sucios" (Messy Data)
    -- Usamos INTEGER/NUMERIC pero permitimos NULL para casos como "Unknown" o "Shul"
    rooms NUMERIC(3, 1),       -- Permite 5.5 cuartos. Nullable.
    square_footage INTEGER,    -- Nullable. El ETL debe convertir "shul" a NULL.
    price NUMERIC(12, 2),      -- Nullable por si dice "Unknown".
    
    -- Lógica de Negocio Crítica
    is_active BOOLEAN DEFAULT TRUE, -- El flag para "Nuevo/Rojo" en el email.
    cycle_group INTEGER NOT NULL DEFAULT 1 CHECK (cycle_group IN (1, 2, 3, 4)), -- El "Week 1, 2, 3"
    
    -- Relaciones (Foreign Keys)
    property_type_id INTEGER REFERENCES property_types(id),
    condition_id INTEGER REFERENCES conditions(id),
    zoning_id INTEGER REFERENCES zonings(id), -- Columna nueva solicitada
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar la Query del Cron Job (Scheduler)
CREATE INDEX idx_listings_cycle_active ON listings(cycle_group, is_active);

-- 4. TABLA PIVOTE PARA FEATURES (MUCHOS A MUCHOS)
-- Una propiedad puede tener 'Garage' Y 'Backyard' al mismo tiempo.
CREATE TABLE listing_features (
    listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, feature_id)
);