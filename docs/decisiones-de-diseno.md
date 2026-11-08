# Sistema y Decisiones de Diseño UX/UI — Impulsa

Este documento detalla los principios, tokens visuales, decisiones de arquitectura y la justificación de los cambios implementados en el rediseño de **Impulsa** para su presentación en el portafolio de diseño de producto.

---

## 1. Identidad Visual y Paleta de Diseño

### 1.1. Propósito de la Identidad
Impulsa proyecta una imagen comercial **elegante, cercana y contemporánea**, diseñada con intención y equilibrio. Se aleja deliberadamente de los tonos azules genéricos de la banca corporativa tradicional y de las interfaces saturadas de estímulos.

- **Símbolo de marca:** Emblema geométrico minimalista que representa impulso y avance ascendente en verde petróleo (`#145965`) con un detalle geométrico en acento cálido (`#E5AF63`).
- **Tratamiento tipográfico:** Tipografía Inter con jerarquía definida y una pequeña etiqueta interactiva **"Demo"** que informa discretamente el contexto ficticio sin recurrir a franjas invasivas.

### 1.2. Tokens de Color

| Token | Código HEX | Propósito y Aplicación |
|-------|------------|------------------------|
| **Verde petróleo principal** | `#145965` | Color primario de marca, botones principales, enlaces activos e indicadores de foco. Ratio de contraste > 7:1 sobre fondo blanco. |
| **Verde petróleo oscuro** | `#103E46` | Estados hover y active en botones primarios, aportando profundidad táctil. |
| **Fondo general** | `#F5F7F8` | Fondo base de la aplicación. Proporciona una atmósfera descansada y luminosa. |
| **Superficie** | `#FFFFFF` | Contenedores de tarjetas, paneles, barras y diálogos modales. |
| **Texto principal** | `#172B35` | Títulos, nombres de contacto y etiquetas clave. Contraste óptimo (13:1). |
| **Texto secundario** | `#526571` | Subtítulos, nombres de negocio, textos de apoyo y placeholders. Contraste 5.3:1 (cumple WCAG AA). |
| **Texto terciario** | `#8396A2` | Metadatos secundarios, fechas relativas atenuadas e íconos decorativos. |
| **Bordes suaves** | `#DFE7EB` | Delimitadores sutiles entre secciones y contornos de tarjetas sin saturación visual. |
| **Acento cálido** | `#E5AF63` | Utilizado con moderación en la etapa "Interesado", avisos de atención y pequeños toques de énfasis. |

### 1.3. Estados de Urgencia y Tiempo (Sin Exclusividad del Color)
- **Vencidos ("Requieren atención"):** Fondo suave (`#FEF3F2`), borde suave (`#FECDCA`), ícono de alerta e indicador textual explícito (`Hace X días`). Se descartan deliberadamente fondos rojos extensos o bordes rojos invasivos en toda la tarjeta.
- **Para hoy:** Fondo suave petróleo (`#EBF5F7`), borde suave (`#C6E2E7`) y texto `Hoy`.
- **Próximos seguimientos:** Fondo neutro suave (`#F2F4F7`), borde suave (`#EAECF0`) e ícono de reloj.
- **Etapas comerciales:** Cada etapa cuenta con su propia etiqueta con texto visible, ícono y borde sutil, evitando depender de códigos cromáticos aislados.

### 1.4. Tipografía y Escala
Se utiliza la familia tipográfica **Inter** con alternativa de sistema sans-serif:
- **Display / H1:** 24px - 28px (`text-2xl` a `text-3xl`), font-bold, tracking-tight.
- **H2 (Secciones):** 16px - 18px (`text-base` a `text-lg`), font-bold.
- **H3 (Tarjetas):** 14px - 15px (`text-sm` a `text-base`), font-bold.
- **Cuerpo principal:** 12px - 14px (`text-xs` a `text-sm`), font-normal o font-medium.
- **Micro-etiquetas y Badges:** 10px - 11px, font-semibold.

### 1.5. Escala de Espaciado y Radios
- Espaciado modular basado en múltiplos de 4 (8px, 12px, 16px, 20px, 24px, 32px).
- **Radio de tarjetas:** 14px (`rounded-tarjeta`), proporcionando esquinas contemporáneas sin bordes caricaturescos.
- **Radio de botones e inputs:** 8px a 10px (`rounded-lg`).
- **Sombras:** Sombra de tarjeta muy ligera (`0 1px 3px rgba(23, 43, 53, 0.04)`), reservando la elevación media para modales y notificaciones.

---

## 2. Arquitectura de Información y Navegación

### 2.1. Estructura de Navegación
1. **Mi día:** Centro de trabajo matutino del asesor comercial.
2. **Contactos:** Directorio consolidado para búsqueda, filtrado y edición.
3. **Oportunidades:** Vista de avance comercial desde la captación hasta el cierre.
4. **Resultados:** Indicadores clave y conversión sobre datos registrados.

### 2.2. Experiencia en Escritorio
- **Barra lateral fija de 240 px:** Acompaña al usuario en todo momento con la marca, acceso a las 4 pantallas y contadores de pendientes urgentes.
- **Navegación activa elegante:** Fondo suave `#F0F7F9` y texto `#145965` con acento visual en lugar de contrastes agresivos.
- **"Restablecer demo" al pie de la barra lateral:** Se traslada a la zona inferior de la barra de navegación para no competir con las acciones comerciales y conservar el diálogo de confirmación.
- **Área de lectura controlada:** Ancho máximo acotado (`max-w-5xl` a `max-w-6xl`) con espaciado exterior de 32 px para evitar dispersión visual en monitores panorámicos.

### 2.3. Experiencia en Móvil
- **Cabecera superior compacta:** Muestra el logo, el acceso a la nota de demo y el botón de restablecer.
- **Barra inferior de navegación fija:** 4 botones táctiles con íconos y etiquetas de texto claras, asegurando áreas de contacto táctil de al menos 48 px.
- **Sin desbordamiento horizontal:** Contenido estructurado en una sola columna con márgenes laterales de 16 a 20 px y separación inferior adecuada para que la barra flotante no tape botones de acción.

---

## 3. Justificación de Decisiones de Rediseño

### 3.1. Eliminación de Botones "Nuevo Contacto" Duplicados
- **Problema previo:** Existían hasta 3 botones de "Nuevo contacto" compitiendo simultáneamente (en barra superior, en menú lateral y en el encabezado de página).
- **Decisión de diseño:** Centralizar una **única acción principal visible por pantalla**, ubicada de manera predecible en la esquina superior derecha del encabezado de página. Esto reduce la carga cognitiva y aclara cuál es el llamado primario a la acción.

### 3.2. Rediseño de la Pantalla "Mi día" como Centro de Trabajo
- **Fecha actual en español:** Ubicada sobre el título para situar temporalmente al asesor al inicio de su jornada.
- **Métricas secundarias compactas:** Tres tarjetas neutrales (Vencidos, Para hoy, Próximos) que informan el volumen sin restar protagonismo visual a las tareas concretas.
- **Organización por secciones prioritarias:**
  1. *Requieren atención:* Los contactos postergados encabezan la lista porque representan el mayor riesgo de abandono.
  2. *Para hoy:* Compromisos inmediatos del día.
  3. *Próximos seguimientos:* Visibilidad hacia adelante ordenada cronológicamente.
- **Contador por sección:** Cada título incluye la cantidad exacta de elementos (ej. `Requieren atención (2)`).

### 3.3. Rediseño de Tarjetas de Contacto
- **Avatar con iniciales:** Ayuda a identificar visualmente al cliente antes de leer el texto.
- **Mayor jerarquía en el nombre:** El nombre del emprendedor resalta en negrita, seguido del nombre comercial como dato complementario.
- **Bloque de "Próxima acción" con fondo suave:** Contenedor diferenciado que resalta qué se debe hacer en la interacción.
- **Tratamiento calmado para seguimientos vencidos:** Se reemplazaron los fondos rojos extensos y marcos pesados por una etiqueta de fecha puntual en color vino/rojo suave (`Hace 2 días`) y un punto indicador, manteniendo la serenidad en la interfaz.

### 3.4. Tabla en Directorio de Contactos
- **Escritorio:** Presentación en tabla estructurada con columnas alineadas (Contacto, Negocio, Necesidad, Etapa, Origen, Próximo seguimiento, Acción). Esto facilita el escaneo vertical rápido de decenas de prospectos.
- **Móvil:** Transformación adaptativa a tarjetas apiladas individuales para mantener legibilidad sin desplazamiento horizontal.

### 3.5. Tablero de Oportunidades: Adaptación Móvil Accesible
- **Problema previo:** En pantallas pequeñas, 5 columnas Kanban apretadas generaban desbordamiento horizontal o tarjetas comprimidas ilegibles.
- **Decisión de diseño:**
  - En escritorio: Tablero de 5 columnas con selector accesible de etapa por tarjeta.
  - En móvil: Selector desplegable de etapas que permite filtrar y revisar una columna a la vez con tarjetas de ancho completo.

### 3.6. Tratamiento de la Nota "Demo"
- Se retiró la franja superior invasiva que ocupaba espacio vertical valioso.
- Se integró una pastilla interactiva **"Demo"** junto al logotipo. Al pulsarla, despliega un diálogo conciso:
  > *“Esta demostración utiliza datos ficticios. Los cambios se guardan únicamente en este navegador. No ingreses información personal real”.*

---

## 4. Accesibilidad (WCAG 2.1 Nivel AA)

- **Foco visible:** Indicador de foco consistente `outline: 2px solid #145965` con separación de 2 px en todos los controles interactivos.
- **Etiquetas explícitas:** Todos los campos de formulario cuentan con `<label>` visible vinculado mediante `htmlFor`/`id`.
- **Áreas táctiles:** Botones y enlaces con altura mínima de 40 a 48 px en vistas táctiles.
- **Regiones de anuncio accesible:** Diálogos modales con atributos `role="dialog"`, `aria-modal="true"`, `aria-labelledby` y manejo de tecla `Escape`.
- **Preferencia de movimiento:** Soporte para `@media (prefers-reduced-motion: reduce)` que minimiza animaciones y transiciones.

---

## 5. Wireframes Esquemáticos del Rediseño

### 5.1. Pantalla "Mi día" (Escritorio)
```text
+---------------------------------------------------------------------------------------+
| [I] Impulsa [Demo]                                                                    |
+-------------------+-------------------------------------------------------------------+
|                   | Domingo, 8 de noviembre                                           |
| MI DÍA (activo)   | Mi día                                        [+ Nuevo contacto]  |
| Contactos (8)     | Tus próximos contactos, en un solo lugar                          |
| Oportunidades     | ----------------------------------------------------------------- |
| Resultados        | [ Vencidos: 2 ]         [ Para hoy: 2 ]       [ Próximos días: 2 ]|
|                   | ----------------------------------------------------------------- |
|                   | REQUIEREN ATENCIÓN (2)                                            |
|                   | +-------------------------------+ +-------------------------------+ |
|                   | | (BM) Bertha M.  [Hace 2 días] | | (MT) Marcos T.  [Hace 1 día]  | |
|                   | | Bodega San Pedro              | | Taller de Calzado Rápido      | |
|                   | | Necesidad: Capital abarrotes  | | Necesidad: Máquina aparadora  | |
|                   | | [Próxima acción: Llamar...]   | | [Próxima acción: Enviar...]   | |
|                   | | [Contactado] [Visita]         | | [Contactado] [Campaña]        | |
|                   | | [Ver detalle] [Registrar...]  | | [Ver detalle] [Registrar...]  | |
|                   | +-------------------------------+ +-------------------------------+ |
|                   | PARA HOY (2)                                                      |
|                   | +-------------------------------+ +-------------------------------+ |
|                   | | (RH) Rosa H.          [Hoy]   | | (WC) Walter C.        [Hoy]   | |
|                   | | Panadería El Buen Trigo       | | Ferretería El Tornillo        | |
|                   | | Necesidad: Horno rotatorio    | | Necesidad: Solución POS cobro | |
| [↺ Restablecer]   | | [Ver detalle] [Registrar...]  | | [Ver detalle] [Registrar...]  | |
+-------------------+-------------------------------------------------------------------+
```

### 5.2. Directorio de Contactos (Tabla en Escritorio)
```text
+---------------------------------------------------------------------------------------+
| Contactos                                                         [+ Nuevo contacto]  |
| [ Buscar contacto o negocio...         ] [ Todas las etapas v ] [ Todos los orígenes v] |
| ------------------------------------------------------------------------------------- |
| CONTACTO Y NEGOCIO     | NECESIDAD           | ETAPA       | PRÓXIMO SEGUIMIENTO| ACCIÓN |
| -----------------------+---------------------+-------------+--------------------+------- |
| (BM) Bertha M.         | Capital abarrotes   | Contactado  | [Hace 2 días]      | [Ver]  |
|      Bodega San Pedro  | fin de mes...       |             | Llamar por boletas |        |
| -----------------------+---------------------+-------------+--------------------+------- |
| (RH) Rosa H.           | Horno rotatorio     | Interesado  | [Hoy]              | [Ver]  |
|      Panadería El Trigo| antes de campaña... |             | Revisar proforma   |        |
+---------------------------------------------------------------------------------------+
```

> [!NOTE]
> Estas decisiones corresponden a una **revisión y refinamiento visual de diseño de producto**. Todas las hipótesis de distribución e interacción permanecen sujetas a validación mediante pruebas con usuarios reales.
