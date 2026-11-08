# Problema y Alcance del Proyecto — Impulsa

## 1. Contexto
En el día a día de un asesor de negocios que atiende a pequeños emprendedores (bodegas, panaderías, talleres textiles, ferreterías, librerías, etc.), la captación y el seguimiento comercial suelen realizarse en movimiento: en visitas a campo, ferias de emprendimiento o mediante recomendaciones boca a boca.

Este proyecto personal de portafolio, titulado **Impulsa**, aborda este escenario desde la perspectiva del diseño de producto digital (UX/UI).

---

## 2. Definición del Problema (Hipótesis Inicial)

> [!IMPORTANT]
> **Aviso de transparencia metodológica:**
> Esta definición parte de una **hipótesis de trabajo** basada en la observación del flujo comercial de microfinanzas y asesoría de microempresas. **No corresponde a una investigación de campo formal ni a entrevistas concluidas.** Constituye el punto de partida que se someterá a validación.

### La hipótesis:
Un asesor de negocios atiende simultáneamente a múltiples prospectos y clientes. Sin una herramienta estructurada y pensada para su ritmo de trabajo:
1. **Dispersión de información:** Los datos de contacto, necesidades y acuerdos quedan repartidos entre cuadernos de notas, chats de mensajería instantánea y notas mentales.
2. **Pérdida de oportunidad por olvido:** Al no existir una vista consolidada de prioridades diarias, se olvidan las fechas comprometidas de contacto telefónico o visitas presenciales.
3. **Pérdida de contexto:** Cuando el asesor vuelve a contactar al emprendedor después de varios días, no recuerda qué necesidad específica tenía ni qué objeción o condición conversaron en la última interacción.
4. **Falta de claridad en el siguiente paso:** El interés del cliente no se traduce inmediatamente en una acción concreta con fecha y responsable, diluyéndose con el paso del tiempo.

---

## 3. Propuesta de Valor y Enfoque

**Lema rector:**
> *“Organiza tus contactos y convierte el interés en una próxima acción.”*

Impulsa busca resolver cuatro preguntas críticas que el asesor debe responder apenas comienza su jornada laboral:
- **¿A quién debo contactar hoy?** (Priorización por urgencia y fecha).
- **¿Qué necesita esa persona?** (Contexto claro de su negocio y requerimiento).
- **¿Qué conversamos anteriormente?** (Historial cronológico de interacciones).
- **¿Cuál es la próxima acción?** (Acción ejecutable comprometida: llamar, visitar, enviar propuesta).

> [!NOTE]
> Impulsa es una herramienta de apoyo al seguimiento y a la organización personal del asesor. **No se afirma ni se garantiza un incremento porcentual en ventas**, pues la efectividad comercial depende de factores de mercado, crédito y relación que trascienden el software.

---

## 4. Alcance Real del Prototipo (Versión Actual)

El prototipo actual se delimita a las siguientes capacidades esenciales implementadas:

### Incluido en el alcance:
- **Pantalla “Mi día” (Centro de trabajo):**
  - Encabezado con fecha actual en español y botón primario consistente "Nuevo contacto".
  - Resumen cuantitativo compacto con superficies neutras (Vencidos, Para hoy, Próximos días).
  - Tres secciones organizadas por prioridad: *Requieren atención*, *Para hoy* y *Próximos seguimientos*, con contadores visibles.
  - Tarjetas de contacto rediseñadas con iniciales en avatar, bloque suave de "Próxima acción", etiquetas discretas y acción directa "Registrar seguimiento".
- **Directorio de Contactos:**
  - Búsqueda en tiempo real por nombre de contacto o negocio.
  - Filtros ordenados por etapa comercial y canal de origen.
  - Tabla de datos estructurada en escritorio para escaneo rápido y tarjetas apiladas en móvil.
- **Ficha de Detalle de Contacto:**
  - Encabezado con nombre, negocio, origen y selector directo de etapa.
  - Bloque superior destacado para la **Próxima Acción y Seguimiento** (futuro), diferenciado del **Historial de Conversaciones** cronológico (pasado).
  - Edición rápida de datos generales y reprogramación o cierre de seguimientos.
- **Tablero de Oportunidades:**
  - Cinco etapas comerciales: *Nuevo*, *Contactado*, *Interesado*, *Cerrado con venta*, *Cerrado sin venta*.
  - Tablero de 5 columnas en escritorio con selector accesible por tarjeta.
  - Selector de etapa en móvil que muestra una lista completa de tarjetas evitando desplazamiento horizontal excesivo.
  - Al cerrar sin venta: registro opcional de motivo de descarte.
  - Al cerrar con seguimiento pendiente: confirmación para completar o mantener el recordatorio activo.
- **Panel de Resultados y Conversión:**
  - KPIs de volumen y Cierres con venta.
  - Cálculo de Tasa de Conversión: `(Cierres con venta / Total) × 100` con protección ante división entre cero.
  - Gráficos de barras sencillos para comparar oportunidades por etapa y origen.
  - Identificación explícita de datos demostrativos.
- **Persistencia local (localStorage):**
  - Conservación de cambios en el navegador local.
  - Manejo seguro de fechas en formato local ISO (`YYYY-MM-DD`).
  - Botón "Restablecer demo" situado en la barra lateral con diálogo de confirmación.

### Fuera del alcance (Limitaciones deliberadas de esta versión):
- **Sin backend ni sincronización multi-dispositivo:** Todos los datos residen en el navegador local (`localStorage`), por lo que no es apto para almacenar datos personales reales o confidenciales.
- **Sin integraciones financieras reales:** No se calculan tasas de interés, cuotas ni evaluación crediticia de entidades financieras.
- **Sin envío automatizado de mensajes o correos:** Las acciones son registros del asesor para organizar su propia gestión.
- **Sin autenticación ni perfiles de usuario:** Se asume la sesión individual de un asesor en su estación de trabajo o dispositivo móvil.
- **Relación 1 a 1 entre contacto y oportunidad:** En esta primera iteración cada contacto cuenta con una oportunidad activa para simplificar el modelo mental del usuario.
