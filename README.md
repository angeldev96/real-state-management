Aquí tienes la **Documentación Maestra del Proyecto**. Este documento integra la visión de negocio, la lógica técnica del "Ciclo", la estructura de base de datos normalizada y la estrategia de UX basada en Dropdowns inteligentes.

Es el documento definitivo para entender qué se va a construir y por qué.

***

# 🏠 Eric's Realty Admin System
**Documentación Técnica y de Producto v1.0**

## 1. Resumen Ejecutivo
Este sistema es una plataforma de administración personalizada (Dashboard & CRM Lite) diseñada para **Eric's Realty**. Su propósito es migrar la gestión de propiedades desde hojas de cálculo desorganizadas ("Messy Data") a una base de datos relacional robusta, y automatizar el envío de correos electrónicos a clientes mediante una estrategia de marketing de **"Ciclos Semanales"**.

El pilar fundamental del sistema es la **Integridad de Datos**: Se prohíbe la entrada de texto libre en campos categorizables, obligando al usuario a usar selectores (Dropdowns) predefinidos.

---

## 2. Lógica de Negocio: "El Ciclo" (The Cycle) 🔄

El cliente utiliza una estrategia de marketing de "goteo" (drip campaign) para proteger su base de datos y mantener el interés de los suscriptores.

### Reglas del Juego:
1.  **Rotación, no Explosión:** No se envían todas las propiedades a la vez.
2.  **Curación Manual:** No hay algoritmo de asignación. El cliente decide subjetivamente qué propiedades van en cada grupo para asegurar una mezcla atractiva (ej. "Esta semana quiero una de lujo y dos económicas").
3.  **Grupos de Envío:**
    *   **Week 1:** Se dispara el día **1** del mes.
    *   **Week 2:** Se dispara el día **15** del mes.
    *   **Week 3:** Se dispara el día **30** del mes.
    *(Nota: Las fechas deben ser configurables).*

### Flujo de Trabajo:
1.  Eric ingresa una propiedad.
2.  Selecciona manualmente el **`Cycle Group`** (1, 2 o 3).
3.  Marca la propiedad como **`Active`** si es nueva.
4.  El sistema (Scheduler) espera a la fecha programada y envía el email con las propiedades de ese grupo.

---

## 3. Estrategia de UX/UI: Dropdowns & Normalización 🛡️

Para solucionar el caos de datos actual (ej. notas como "Beautiful" vs "Super Shiny Beautiful"), la interfaz **bloquea la creatividad innecesaria** en la entrada de datos.

### El Formulario de Propiedad (`ListingForm`)
Este es el componente más complejo y vital. No usa `<input type="text">` para categorías. Usa componentes de **Shadcn UI**:

1.  **Comboboxes (Selectores con Búsqueda):**
    *   Para **`Property Type`** (1 Family, Condo, etc.) y **`Zoning`** (R5, R6).
    *   Permite escribir para filtrar opciones, pero solo permite seleccionar valores existentes.
2.  **Multi-Select Inteligente (Many-to-Many):**
    *   Para **`Features`** (Garage, Backyard, Elevator).
    *   El usuario selecciona múltiples etiquetas (Tags) que se acumulan en el campo.
    *   Esto alimenta la tabla pivote en la base de datos.
3.  **Selector de Ciclo:**
    *   Un `ToggleGroup` o `RadioGroup` claro y grande: **[ Week 1 ] [ Week 2 ] [ Week 3 ]**.
4.  **Manejo de Datos Sucios (Messy Data):**
    *   Campos numéricos como `Price` o `Square Footage` aceptan valores vacíos (`NULL`) para no romper la importación de datos antiguos incompletos.

---

## 4. Arquitectura de Base de Datos (PostgreSQL) 🗄️

Diseño relacional normalizado para soportar los Dropdowns.

### Tablas Catálogo (Lookups)
Estas tablas alimentan los Dropdowns del Frontend. El admin puede agregar nuevas opciones aquí si el negocio cambia.
*   `property_types` (id, name)
*   `conditions` (id, name)
*   `zonings` (id, code)
*   `features` (id, name)

### Tabla Principal (`listings`)
*   `id`: PK
*   `address`: Text
*   `price`: Numeric (Nullable)
*   `rooms`: Numeric (Nullable)
*   `square_footage`: Integer (Nullable)
*   `is_active`: Boolean (Determina si lleva el badge "NEW" en el email)
*   `cycle_group`: Integer (1, 2, 3) - **CRÍTICO PARA EL SCHEDULER**
*   `property_type_id`: FK -> `property_types`
*   `condition_id`: FK -> `conditions`
*   `zoning_id`: FK -> `zonings`

### Tabla Pivote
*   `listing_features`: Relaciona `listing_id` <-> `feature_id`.

### Tabla Configuración
*   `cycle_schedules`: Guarda qué día del mes sale cada grupo.

---

## 5. Especificaciones Técnicas (Stack) 🛠️

*   **Frontend Framework:** Next.js 15 (App Router).
*   **Lenguaje:** TypeScript (Tipado estricto para evitar errores con los nulos).
*   **Componentes UI:** Shadcn UI (Radix Primitives).
    *   Vital: `Command`, `Popover`, `Dialog`, `Table`, `Tabs`, `Form`.
*   **Base de Datos:** PostgreSQL (alojado en Supabase, Neon o similar).
*   **ORM:** Prisma o Drizzle (Recomendado para manejar las relaciones FK fácilmente).

---

## 6. Vistas del Sistema (Frontend Scope)

1.  **Dashboard Principal (Cycle Manager):**
    *   Uso de **Tabs** para navegar entre Week 1, 2 y 3.
    *   Vista rápida de qué propiedades saldrán en el próximo envío.
2.  **Tabla Maestra de Listados:**
    *   **Faceted Filters:** Una barra de herramientas avanzada para filtrar por múltiples criterios usando los mismos Dropdowns (ej. "Ver solo R6 que sean Condos").
3.  **Configuración (Settings):**
    *   Panel para editar los días de disparo del Scheduler.
    *   (Opcional) Panel ABM para agregar nuevos "Features" o "Tipos" a los dropdowns.

---

## 7. Roadmap de Implementación Sugerido

1.  **Base de Datos:** Correr scripts SQL para crear tablas y relaciones.
2.  **Seeds:** Poblar las tablas catálogo (Features, Zoning, etc.) con los datos del `dropdown.txt`.
3.  **Frontend Core:** Configurar Next.js + Shadcn.
4.  **UI Components:** Crear el `MultiSelect` custom y los `Comboboxes`.
5.  **Feature de CRUD:** Implementar el formulario de creación de propiedades con validación.
6.  **Vista Dashboard:** Implementar la lógica de Tabs por Ciclo.
7.  **Backend:** Conectar con API Routes y Base de Datos.
8.  **Scheduler:** Script de automatización de emails.