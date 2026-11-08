# Impulsa — Seguimiento Comercial para Asesores de Negocio

> **Proyecto personal de práctica para portafolio UX/UI**  
> Diseñado y estructurado con asistencia de Inteligencia Artificial como base de trabajo, sujeto a revisión, iteración y validación por parte de la diseñadora de producto.

---

## 📌 Resumen del Proyecto

**Impulsa** es un prototipo de aplicación web orientada a asesores de negocios y microfinanzas que atienden a pequeños emprendedores (bodegas, panaderías, talleres, ferreterías, etc.).

Su propósito es resolver una necesidad comercial cotidiana: **organizar contactos dispersos y transformar el interés de un cliente potencial en una próxima acción concreta.**

> *“Organiza tus contactos y convierte el interés en una próxima acción.”*

Al iniciar su jornada laboral, el asesor debe poder responder con claridad:
1. **¿A quién debo contactar hoy?**
2. **¿Qué necesita esa persona?**
3. **¿Qué conversamos anteriormente?**
4. **¿Cuál es la próxima acción acordada?**

---

## 🎯 Problema e Hipótesis Inicial

> [!IMPORTANT]
> **Aviso de transparencia metodológica:**  
> Este proyecto parte de una **hipótesis de trabajo inicial** basada en la observación del flujo de captación comercial. **No constituye el resultado de una investigación de campo ni de entrevistas concluidas.**

### La hipótesis:
Un asesor suele recopilar prospectos en visitas a campo, ferias o por recomendaciones. Sin una herramienta ágil y enfocada:
- Los datos y acuerdos quedan dispersos en libretas físicas o chats personales.
- Se olvidan fechas acordadas para llamadas o visitas.
- Se pierde el contexto de las necesidades del emprendedor entre una interacción y otra.
- No se define una próxima acción con fecha, por lo que el interés se diluye.

*Nota:* Impulsa busca apoyar la organización y el seguimiento personal del asesor. No se afirma ni se asume que incremente las ventas sin pruebas de campo reales.

---

## 👤 Usuario Objetivo (Proto-Persona)

- **Rol:** Asesor de negocios / microfinanzas enfocado en pequeños emprendedores.
- **Contexto:** Trabajo híbrido entre visitas presenciales de campo y gestión de oficina/teléfono.
- **Necesidad:** Capturar prospectos en menos de un minuto, revisar compromisos del día sin perderse en menús complejos y mantener un registro histórico claro de acuerdos.

---

## 🎨 Sistema y Dirección Visual

El rediseño visual de Impulsa se construyó bajo un enfoque **elegante, cercano y contemporáneo**, con composición equilibrada y detalles cuidados:

- **Paleta de Color:**
  - Verde petróleo principal: `#145965` (marca, botones principales, foco visible).
  - Verde petróleo oscuro: `#103E46` (estados hover y active).
  - Fondo general: `#F5F7F8` (superficie base luminosa y descansada).
  - Superficies: `#FFFFFF` (tarjetas, paneles y modales).
  - Texto principal: `#172B35` (contraste óptimo 13:1).
  - Texto secundario: `#526571` (subtítulos y metadatos, contraste 5.3:1).
  - Bordes suaves: `#DFE7EB` (delimitadores sutiles).
  - Acento cálido: `#E5AF63` (utilizado con moderación en estados clave).
- **Tipografía:** Familia **Inter** con escala jerárquica clara (Display, H1, H2, H3, Body y Micro).
- **Identidad de Marca:** Emblema geométrico sutil y etiqueta interactiva **"Demo"** con diálogo explicativo accesible (se retiró la franja invasiva superior).
- **Botones deduplicados:** Una sola acción primaria visible por pantalla (*"Nuevo contacto"*), situada de manera predecible en el encabezado de cada sección.
- **Controles secundarios:** La acción *"Restablecer demo"* se reubicó en la parte inferior de la barra lateral, conservando su diálogo de confirmación.

---

## 🛠️ Alcance de mi Participación en UX/UI

*Este apartado define el rol y los puntos clave para revisión y ajuste personal:*
- **Definición de hipótesis y enfoque:** Planteamiento del problema comercial y delimitación de supuestos.
- **Estructuración del flujo:** Diseño del recorrido principal (Mi día → Captura rápida → Detalle contextualizado → Registro de interacción).
- **Decisiones de interfaz y accesibilidad:** Jerarquía visual, contraste cromático institucional, formularios con etiquetas visibles, navegación operable por teclado y adaptación móvil táctil (mínimo 44 px).
- **Preparación de instrumentos de prueba:** Diseño del guion de pruebas de usabilidad y de la matriz de evaluación para futuras sesiones con usuarios reales.
- **Revisión y personalización:** Ajuste continuo del código y los flujos generados con asistencia de IA para adecuarlos a mis criterios de diseño.

---

## 📂 Documentación UX/UI en la Carpeta `/docs`

Puedes consultar el desglose detallado del proceso en los siguientes documentos:

1. [**Problema y Alcance**](docs/problema-y-alcance.md): Justificación del problema comercial, objetivos, alcance real de la versión 1.0 y limitaciones.
2. [**Perfil de Usuario y Supuestos**](docs/usuario-y-supuestos.md): Proto-persona de asesor comercial, escenario ilustrativo y matriz de supuestos pendientes de validar.
3. [**Flujo Principal de Usuario**](docs/flujo-principal.md): Diagrama en Mermaid y descripción paso a paso del ciclo de captación y seguimiento.
4. [**Decisiones de Diseño y Accesibilidad**](docs/decisiones-de-diseno.md): Sistema visual completo, tokens, razones de cambios, accesibilidad WCAG AA y wireframes esquemáticos.
5. [**Plan y Guion de Pruebas de Usabilidad**](docs/plan-de-prueba.md): Guion estructurado con 5 tareas clave y plantilla de registro en blanco para moderador.
6. [**Resultados y Mejoras Pendientes**](docs/resultados-y-mejoras.md): Comprobaciones técnicas ejecutadas, cambios de rediseño y aspectos pendientes de validar con usuarios.

---

## 💻 Tecnologías Utilizadas

- **React 19** con **TypeScript** (tipado estricto `noUnusedLocals`, `strict: true`)
- **Vite** para desarrollo y empaquetado rápido (con ruta base relativa para despliegue directo en GitHub Pages)
- **Tailwind CSS** con tokens de diseño personalizados
- **Lucide React** para iconografía semántica consistente
- **Almacenamiento:** `localStorage` del navegador (sin backend externo)

---

## ✨ Funcionalidades Implementadas

1. **Pantalla "Mi día" (Centro de trabajo):**
   - Fecha actual en español en el encabezado.
   - Resumen cuantitativo compacto con superficies neutras: *Vencidos*, *Para hoy* y *Próximos días*.
   - Secciones priorizadas con contadores: *Requieren atención*, *Para hoy* y *Próximos seguimientos*.
   - Tarjetas de contacto rediseñadas con iniciales en avatar, bloque destacado de *Próxima acción* y botón directo *“Registrar seguimiento”*.
   - Tratamiento de vencidos con tono vino/rojo suave en la etiqueta temporal (`Hace 2 días`), evitando fondos rojos extensos.
2. **Directorio de Contactos:**
   - Búsqueda en tiempo real por nombre de contacto o nombre del negocio.
   - Filtros ordenados por etapa comercial y canal de origen (visita, referido, campaña).
   - Tabla estructurada legible en escritorio y presentación en tarjetas apiladas en móvil.
3. **Ficha de Detalle del Contacto:**
   - Separación visual nítida en 3 bloques: Información general, **Próxima acción pendiente** (futuro) e **Historial de conversaciones** (pasado).
   - Edición rápida de datos generales y cambio accesible de etapa comercial.
   - Capacidad de marcar un seguimiento como atendido, reprogramarlo o registrar una nueva nota.
4. **Tablero de Oportunidades:**
   - Cinco etapas comerciales: *Nuevo*, *Contactado*, *Interesado*, *Cerrado con venta*, *Cerrado sin venta*.
   - Tablero de 5 columnas en escritorio y **selector de etapa adaptable en móvil** para evitar desplazamiento horizontal excesivo.
   - Al cerrar sin venta: registro opcional del motivo de descarte.
   - Al cerrar con seguimiento pendiente: confirmación guiada para completar o conservar el recordatorio.
5. **Panel de Resultados y Conversión:**
   - Métricas de demostración: Total de prospectos, Cierres con venta y Tasa de Conversión `(Cerrados con venta / Total) × 100`.
   - Barras de progreso simples para comparar distribución por etapa y origen.
   - Identificación explícita de datos como demostrativos.
6. **Manejo de Datos y Resiliencia:**
   - 8 contactos iniciales con fechas relativas dinámicas al día actual.
   - Manejo seguro de fechas en formato ISO local (`YYYY-MM-DD`) para prevenir desfases de zona horaria UTC.
   - Botón de confirmación para **Restablecer datos de demostración**.

---

## ⚠️ Limitaciones y Manejo de Datos

- **Datos 100% ficticios:** Ningún contacto, teléfono o negocio corresponde a personas reales.
- **Almacenamiento local exclusivo:** Todos los datos se almacenan en el `localStorage` del navegador. No se transmiten a servidores externos ni son aptos para datos bancarios, documentos de identidad o información sensible.
- **Relación 1 a 1:** Cada contacto posee una única oportunidad comercial activa en esta primera versión.

---

## 🤖 Declaración de Asistencia de Inteligencia Artificial

En cumplimiento con las buenas prácticas de transparencia académica y profesional:
- La arquitectura técnica inicial, la redacción base de los documentos y el código de los componentes en React/TypeScript fueron generados con asistencia de modelos de IA (Google Antigravity), siguiendo las directrices, requerimientos y supervisión de la diseñadora de producto.
- Este prototipo constituye un punto de partida funcional sujeto a revisión crítica, ajustes visuales, pruebas de usabilidad con usuarios y mejoras continuas por parte de la autora.

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### Pasos
1. Clonar o descargar el repositorio:
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd <NOMBRE_DE_CARPETA>
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo local:
   ```bash
   npm run dev
   ```

4. Abrir en tu navegador la dirección indicada en la terminal (habitualmente `http://localhost:5173`).

5. Compilar para producción:
   ```bash
   npm run build
   ```

---

## 📸 Capturas de Pantalla y Enlace a Demo

> *Espacios reservados para añadir los enlaces finales tras la publicación:*

- **Demo interactiva:** `[Ver demostración en línea](https://<TU_USUARIO>.github.io/impulsa/)` *(Reemplazar con el enlace de GitHub Pages o Vercel)*
- **Captura 1 — Pantalla "Mi día":** `![Mi día - Impulsa](docs/screenshots/mi-dia.png)` *(Colocar imagen en `docs/screenshots/mi-dia.png`)*
- **Captura 2 — Detalle del Contacto:** `![Detalle del Contacto](docs/screenshots/detalle-contacto.png)` *(Colocar imagen en `docs/screenshots/detalle-contacto.png`)*
- **Captura 3 — Directorio de Contactos:** `![Directorio de Contactos](docs/screenshots/contactos-tabla.png)` *(Colocar imagen en `docs/screenshots/contactos-tabla.png`)*
- **Captura 4 — Tablero de Oportunidades:** `![Tablero de Oportunidades](docs/screenshots/oportunidades.png)` *(Colocar imagen en `docs/screenshots/oportunidades.png`)*
