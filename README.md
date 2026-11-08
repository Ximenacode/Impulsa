# Impulsa — Seguimiento Comercial para Asesores de Negocio

> **Proyecto personal de práctica para portafolio UX/UI**  
> Diseñado y estructurado con asistencia de Inteligencia Artificial como base de trabajo, sujeto a revisión, iteración y validación por parte de la diseñadora de producto.

---

## 📌 Resumen del Proyecto

**Impulsa** es un prototipo de aplicación web orientada a asesores de negocios y microfinanzas que atienden a pequeños emprendedores (bodegas, panaderías, talleres, ferreterías, etc.).

Su propósito es resolver una necesidad cotidiana: **organizar contactos dispersos y transformar el interés de un cliente potencial en una próxima acción concreta.**

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

## 🛠️ Alcance de mi Participación en UX/UI

*Este apartado define el rol y los puntos clave para revisión y ajuste personal:*
- **Definición de hipótesis y enfoque:** Planteamiento del problema comercial y delimitación de supuestos.
- **Estructuración del flujo:** Diseño del recorrido principal (Mi día → Captura rápida → Detalle contextualizado → Registro de interacción).
- **Decisiones de interfaz y accesibilidad:** Jerarquía visual, contraste cromático (verde petróleo institucional con fondo claro), formularios con etiquetas visibles y navegación operable por teclado.
- **Preparación de instrumentos de prueba:** Diseño del guion de pruebas de usabilidad y de la matriz de evaluación para futuras sesiones con usuarios reales.
- **Revisión y personalización:** Ajuste continuo del código y los flujos generados con asistencia de IA para adecuarlos a mis criterios de diseño.

---

## 📂 Documentación UX/UI en la Carpeta `/docs`

Puedes consultar el desglose detallado del proceso en los siguientes documentos:

1. [**Problema y Alcance**](docs/problema-y-alcance.md): Justificación del problema comercial, objetivos, alcance de la versión 1.0 y limitaciones.
2. [**Perfil de Usuario y Supuestos**](docs/usuario-y-supuestos.md): Proto-persona de asesor comercial, escenario ilustrativo y matriz de supuestos pendientes de validar.
3. [**Flujo Principal de Usuario**](docs/flujo-principal.md): Diagrama en Mermaid y descripción paso a paso del ciclo de captación y seguimiento.
4. [**Decisiones de Diseño y Accesibilidad**](docs/decisiones-de-diseno.md): Fundamentación de paleta de colores, arquitectura, formularios sin trampas y cumplimiento WCAG AA.
5. [**Plan y Guion de Pruebas de Usabilidad**](docs/plan-de-prueba.md): Guion estructurado con 5 tareas clave y plantilla de registro en blanco para moderador.
6. [**Resultados y Mejoras Pendientes**](docs/resultados-y-mejoras.md): Estructura formal lista para consolidar métricas y retroalimentación una vez ejecutadas las pruebas reales.

---

## 💻 Tecnologías Utilizadas

- **React 19** con **TypeScript**
- **Vite** para desarrollo y empaquetado rápido
- **Tailwind CSS** para un sistema de diseño modular y tokens accesibles
- **Lucide React** para iconografía semántica
- **Almacenamiento:** `localStorage` del navegador (sin backend externo)

---

## ✨ Funcionalidades Principales

1. **Pantalla "Mi día":**
   - Resumen numérico inmediato: Vencidos (alerta sutil), Para hoy y Próximos.
   - Lista priorizada algorítmicamente (lo vencido primero para recuperar contacto).
   - Botón directo *“Registrar seguimiento”* en cada tarjeta pendiente.
2. **Directorio de Contactos:**
   - Búsqueda en tiempo real por nombre de persona o nombre del negocio.
   - Filtros combinados por etapa comercial y canal de origen (visita, referido, campaña).
   - Acceso inmediato a la ficha completa de cada contacto.
3. **Ficha de Detalle del Contacto:**
   - Separación visual nítida entre la **próxima acción pendiente** (futuro) y el **historial cronológico** de conversaciones (pasado).
   - Edición rápida de datos generales y cambio accesible de etapa comercial.
   - Capacidad de marcar un seguimiento como atendido o reprogramarlo.
4. **Tablero de Oportunidades:**
   - Columnas para las 5 etapas: *Nuevo*, *Contactado*, *Interesado*, *Cerrado con venta*, *Cerrado sin venta*.
   - Selector accesible en cada tarjeta para mover de etapa con teclado o pantalla táctil (sin depender exclusivamente de arrastrar y soltar).
   - Al cerrar sin venta: campo opcional para registrar motivo de pérdida.
   - Al cerrar con seguimiento pendiente: confirmación guiada para completar o conservar el recordatorio.
5. **Panel de Resultados y Conversión:**
   - Métricas de demostración: Total de prospectos, Cierres con venta, Oportunidades por etapa y por origen.
   - Cálculo automático de la **Tasa de Conversión**: `(Cerrados con venta / Total) × 100` con protección ante división entre cero.
6. **Manejo de Datos y Resiliencia:**
   - 8 contactos ficticios con fechas calibradas automáticamente al día de uso.
   - Fechas calculadas en formato local ISO (`YYYY-MM-DD`) para prevenir desfases de día por zonas horarias.
   - Botón de confirmación para **Restablecer datos de demostración** en cualquier momento.

---

## ⚠️ Limitaciones y Manejo de Datos

- **Datos 100% ficticios:** Ningún contacto, teléfono o negocio corresponde a personas reales.
- **Almacenamiento local exclusivo:** Todos los datos se almacenan en el `localStorage` del navegador del usuario. No se transmiten a servidores externos ni son aptos para datos bancarios, documentos de identidad o información sensible.
- **Relación 1 a 1:** Cada contacto posee una única oportunidad comercial activa en esta primera versión simplificada.

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

- **Demo interactiva:** *(Espacio reservado: añadir enlace a GitHub Pages o Vercel al publicar)*
- **Captura 1 — Pantalla "Mi día":** *(Espacio reservado para imagen)*
- **Captura 2 — Ficha de Detalle de Contacto:** *(Espacio reservado para imagen)*
- **Captura 3 — Tablero de Oportunidades:** *(Espacio reservado para imagen)*
- **Captura 4 — Vista móvil responsiva:** *(Espacio reservado para imagen)*
