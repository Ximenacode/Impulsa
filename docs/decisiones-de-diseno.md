# Decisiones de Diseño UX/UI — Impulsa

Este documento detalla la justificación y los principios aplicados en la arquitectura, interacción y diseño visual de **Impulsa**, explicando el propósito detrás de cada decisión.

---

## 1. Identidad Visual y Paleta Cromática

### Color Principal: Verde Petróleo (`#15565F`)
- **Propósito:** Transmitir solidez institucional, serenidad y cercanía humana, distanciándose del azul corporativo tradicional de la banca masiva y del rojo/naranja de urgencia comercial.
- **Diferenciación de marca:** Es una identidad propia y sobria; no utiliza logotipos, colores ni elementos de identidad de Caja Trujillo ni de ninguna entidad financiera existente.
- **Contraste accesible:** Cumple con el ratio WCAG AA (mínimo 4.5:1 sobre fondo blanco y texto blanco sobre verde petróleo `#15565F` alcanza ratio > 6:1).

### Fondo y Superficies (`#F8FAFC` y `#FFFFFF`)
- **Propósito:** Mantener una base limpia, luminosa y descansada para la vista en jornadas de uso prolongado.
- **Evitar la fatiga cognitiva:** Se restringe deliberadamente el uso de sombras pesadas, degradados llamativos, bordes redondeados excesivos y tarjetas multicolores innecesarias.

### Indicadores de Estado y No-Exclusividad del Color
- **Principio WCAG 1.4.1 (Uso del color):** Ningún estado se comunica únicamente mediante color.
- **Implementación:**
  - *Vencido:* Fondo suave ámbar/rojizo cálido (`#FEF2F2`), borde suave, ícono de alerta de reloj y etiqueta textual explícita `Vencido (hace X días)`.
  - *Para hoy:* Fondo suave esmeralda/petróleo (`#F0FDF4` / `#F0F7F8`), ícono de calendario y etiqueta `Hoy`.
  - *Próximo:* Fondo pizarra neutro (`#F8FAFC`), ícono de calendario y etiqueta con la fecha legible (ej. `Jueves, 12 nov`).
  - *Etapas comerciales:* Etiquetas con texto claro (ej. `Nuevo`, `Contactado`, `Interesado`, `Cerrado con venta`, `Cerrado sin venta`) con colores de baja saturación para no competir con el contenido principal.

---

## 2. Navegación y Arquitectura de Información

### Estructura de Secciones:
1. **Mi día:** Pantalla principal de trabajo. Enfocada en la acción inmediata del día a día.
2. **Contactos:** Directorio completo para consulta, filtrado y edición de toda la cartera.
3. **Oportunidades:** Vista panorámica del estado comercial de los prospectos.
4. **Resultados:** Indicadores globales para evaluar el rendimiento sobre los datos registrados.

### Navegación Responsiva
- **Escritorio:** Barra lateral izquierda fija (*Sidebar*). Permite saltar entre secciones con un clic y mantener visible el estado activo y el botón de acción rápida `+ Nuevo contacto`.
- **Móvil:** Barra de navegación inferior (*Bottom Navigation Bar*) fija para los pulgares, complementada con una cabecera superior compacta con acceso al botón `+ Nuevo contacto` y al menú de utilidades (restablecer datos de prueba).

---

## 3. Jerarquía Visual y Pantallas Clave

### Pantalla "Mi día": Enfoque en el orden de urgencia
- **Resumen superior:** Tres métricas cuantitativas concisas (Vencidos, Para hoy, Próximos) que funcionan como ancla visual para evaluar la carga de trabajo en un segundo.
- **Ordenamiento algorítmico prioritario:**
  1. Seguimientos vencidos en la parte superior: el contacto postergado representa el mayor riesgo de pérdida de relación.
  2. Seguimientos programados para hoy: el compromiso del día.
  3. Próximos seguimientos (ordenados cronológicamente): visibilidad hacia adelante sin abrumar.
- **Acción en el punto de necesidad:** Cada tarjeta incluye el botón directo `Registrar seguimiento`, evitando que el usuario deba entrar al detalle para una acción rutinaria de registro.

### Detalle del Contacto: Separación entre Pasado y Futuro
- **Problema detectado en la hipótesis:** Los asesores confunden las notas de lo ocurrido con lo que falta por hacer.
- **Solución de diseño:**
  - **Caja de Próxima Acción (Futuro):** Ubicada arriba, con fondo diferenciado, fecha límite destacada y botón para completar o reprogramar.
  - **Historial de Conversaciones (Pasado):** Presentado en formato de línea de tiempo descendente (lo más reciente arriba), con fecha de registro, tipo de interacción y notas inmutables.

### Tablero de Oportunidades: Accesibilidad ante todo
- **Decisión crítica:** No depender exclusivamente del arrastre con mouse (*drag-and-drop*), el cual presenta serias barreras de accesibilidad motriz y dificultades ergonómicas en pantallas táctiles de teléfonos móviles.
- **Solución:** Cada tarjeta incluye un selector de etapa claro y accesible (`<select>` o botones de estado), permitiendo mover un prospecto entre etapas tanto con teclado, pantalla táctil o ratón en un solo paso.

---

## 4. Formularios y Prevención de Errores

### Principios aplicados:
- **Etiquetas siempre visibles:** Cada campo de formulario cuenta con un `<label>` accesible vinculado mediante `htmlFor` / `id`. No se utilizan etiquetas flotantes que desaparecen ni se depende exclusivamente del atributo `placeholder`.
- **Formularios breves:** Solo dos campos son estrictamente obligatorios al crear un contacto (*Nombre* y *Necesidad identificada*). Los demás son opcionales para no frenar la captación en campo.
- **Regla de integridad en seguimientos:** Si el usuario ingresa una fecha de seguimiento, es obligatorio indicar qué acción realizará, y viceversa. Esto evita entradas confusas como "Llamar" sin fecha o "Mañana" sin saber el motivo.
- **Mensajes de error en contexto:** Los errores de validación se muestran directamente debajo del campo correspondiente, con texto descriptivo y atributos `aria-invalid="true"` y `aria-describedby`.
- **Fechas sin alteración de zona horaria:** Las fechas se procesan y almacenan en formato de cadena ISO local (`YYYY-MM-DD`), evitando que conversiones horarias de JavaScript desplacen la fecha al día anterior o posterior.

---

## 5. Accesibilidad (A11y - WCAG 2.1 Nivel AA)

| Criterio | Solución Implementada en Impulsa |
|----------|----------------------------------|
| **1.3.1 Información y relaciones** | Estructura semántica completa (`<main>`, `<nav>`, `<header>`, `<article>`, `<button>`, `<label>`). |
| **1.4.3 Contraste mínimo** | Ratios de contraste superiores a 4.5:1 para texto normal y 3:1 para componentes de interfaz. |
| **2.1.1 Teclado** | Todas las acciones (abrir modales, registrar notas, filtrar, buscar, cambiar etapas) son 100% operables mediante teclado (`Tab`, `Enter`, `Escape`, `Space`). |
| **2.4.7 Foco visible** | Indicadores de foco consistentes y de alto contraste (`ring-2 ring-petroleo-700 ring-offset-2`). |
| **2.5.5 Tamaño del objetivo táctil** | Botones, campos y enlaces con un área táctil mínima de 44x44 píxeles en dispositivos móviles. |
| **4.1.2 Nombre, función, valor** | Atributos ARIA en diálogos modales (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) y regiones de anuncio en vivo (`role="status"`, `aria-live="polite"`). |
