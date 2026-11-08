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

## 4. Alcance del Prototipo (Versión 1.0)

El prototipo actual se delimita a las siguientes capacidades esenciales:

### Incluido en el alcance:
- **Pantalla “Mi día”:** Tablero de prioridades diarias con pendientes vencidos, programados para hoy y próximos seguimientos, con acceso inmediato a registrar el resultado de la acción.
- **Directorio de Contactos:** Listado estructurado con búsqueda inmediata por nombre o negocio, y filtros por etapa comercial y origen del contacto.
- **Formulario enfocado de creación y edición:** Registro rápido de datos esenciales sin campos burocráticos innecesarios, vinculando obligatoriamente la fecha con la acción si se programa un seguimiento.
- **Ficha de Detalle de Contacto:** Visualización unificada de datos del negocio, necesidad, origen, etapa comercial, historial de conversaciones y próxima acción pendiente.
- **Gestión de Oportunidades Comerciales:** Tablero accesible por etapas (Nuevo, Contactado, Interesado, Cerrado con venta, Cerrado sin venta) con registro opcional de motivo de pérdida y resolución guiada de seguimientos pendientes al cerrar.
- **Panel de Resultados:** Métricas de demostración para evaluar volumen por etapa, origen y tasa de conversión sobre datos cargados.
- **Persistencia local (localStorage):** Conservación de cambios en el navegador y capacidad de reiniciar los datos de demostración en cualquier momento.

### Fuera del alcance (Limitaciones deliberadas de esta versión):
- **Sin backend ni sincronización multi-dispositivo:** Todos los datos residen en el navegador local (`localStorage`), por lo que no es apto para almacenar datos personales reales o confidenciales.
- **Sin integraciones financieras reales:** No se calculan tasas de interés, cuotas ni evaluación crediticia de entidades financieras.
- **Sin envío automatizado de mensajes o correos:** Las acciones son registros del asesor para organizar su propia gestión.
- **Sin autenticación ni perfiles de usuario:** Se asume la sesión individual de un asesor en su estación de trabajo o dispositivo móvil.
- **Relación 1 a 1 entre contacto y oportunidad:** En esta primera iteración cada contacto cuenta con una oportunidad activa para simplificar el modelo mental del usuario.
