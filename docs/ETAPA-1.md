# Registro de etapa 1 — 8 de noviembre de 2026

> Registro histórico. El enfoque vigente de asesor financiero, las categorías generales y las reglas actuales de montos/cierres están en [enfoque-financiero.md](enfoque-financiero.md).

## Inspección inicial

- Base local: React 17, TypeScript, CRA 4, Router 5, Redux/Thunk, Material UI 4, DevExpress Grid/Chart/Scheduler, CanvasJS, notistack, axios y utilidades de exportación.
- Se leyó el README y la licencia GPL-3.0. No se encontraron archivos AGENTS.md aplicables.
- Rutas: Dashboard, Tasks, Sales, Clients, Contacts, Calendar, formularios de alta, leads y perfil.
- Estado: Redux cargaba usuarios y clientes desde archivos locales mediante temporizadores; no había backend funcional ni persistencia del recorrido comercial.
- Formularios: campos visuales y botones de guardado sin una operación compartida de creación/persistencia.
- Tablero: tarjetas e indicadores incrustados, categorías de facturación ajenas al alcance, enlaces `#` e iconos sin una operación conectada.
- Agenda: DevExpress Scheduler con eventos locales de 2021 y edición en memoria, sin relaciones con contactos/oportunidades.
- Tablas y gráficos: filtros/paginación de librerías, series y datos rusos incrustados, importes en rublos y contadores estáticos.
- Traducción: textos rusos e ingleses, calendario `ru-RU`, documento `lang=ru`, sin catálogo español.
- Avisos: intervalos de notificaciones de demostración en App.
- Servicios: axios estaba instalado pero las acciones consultaban datos locales; no se conservó ningún servicio externo ni telemetría.
- Había cambios previos en package.json y package-lock.json; se preservaron. No se reinstalaron ni actualizaron todas las dependencias.

## Ejecución y límite del antes/después

Antes de modificar se intentó `npm start` con el ajuste OpenSSL para Node 24. El puerto 3000 ya estaba ocupado; la instancia local respondió HTTP 200. No se presenta esto como prueba funcional del estado original.

Se intentó inspeccionar el navegador para obtener capturas. La herramienta terminó la sesión porque no pudo determinar la URL actual de Chrome con suficiente confianza para aplicar su política. No se obtuvieron capturas del antes/después ni se realizó QA visual mediante esa herramienta. No se fabricaron imágenes ni resultados de revisión visual.

La implementación se inició también en el puerto 3001 y devolvió HTTP 200 con el documento en español y el título de Impulsa.

## Cambios funcionales

- Cinco módulos: Mi día, Contactos, Oportunidades, Agenda, Resultados.
- Modelo compartido contacto → oportunidad → seguimiento, con IDs y operaciones validadas.
- Contactos con ficha, creación, edición, búsqueda y origen. Varias oportunidades por contacto.
- Seis etapas, cierre con fecha y motivos de pérdida; reapertura limpia los campos de cierre y registra actividad.
- Decisión obligatoria sobre pendientes al cerrar; cancelación preserva historial.
- Seguimientos con programación, edición, reprogramación, cancelación confirmada y realización con resultado, notas y decisión explícita de siguiente paso.
- Mi día calcula hoy, vencidos y abiertas; pestañas, búsqueda y orden definidos por el encargo.
- Agenda en lista y calendario es-PE, sin inventar horas. Fichas y acciones compartidas.
- Resultados derivados de registros, sin indicadores estáticos, crecimiento supuesto ni predicciones.
- Persistencia local versionada, validación de carga y escritura, detección de cambios entre pestañas, errores visibles y reset confirmado.
- Textos españoles, HTML es-PE, moneda PEN, día comercial de Perú, foco de modales gestionado por Material UI, foco visible y diseño adaptable.
- Avisos únicamente después de acciones, uno a la vez. Actividad reciente únicamente desde operaciones realizadas.

## Retirado e integrado

Ventas se representa como oportunidades ganadas y sus resultados. Clientes/contactos se unifican en Contactos. Las tareas útiles pasan a seguimientos; se retiraron facturación, perfil/foto original, datos rusos, contadores fijos, avisos automáticos e iconos que duplicaban navegación.

La auditoría de importaciones previa a retirar componentes y datos está en `auditoria-referencias.json`. LICENSE, README original y avisos de CanvasJS se conservaron. CanvasJS ya no participa en la aplicación ejecutada. No se hicieron commits ni publicaciones.

## Comprobaciones

- `npm test -- --watchAll=false --runInBand --json --outputFile=docs/test-results.json`: **23 pruebas aprobadas, 2 suites**, sin snapshots. Evidencia detallada en `test-results.json`.
- `.\node_modules\.bin\tsc.cmd --noEmit`: aprobado, sin errores de tipos.
- `npm run build`: **compilación final aprobada**, sin advertencias de aplicación. Se generaron `build/` y el archivo de avisos de terceros de CRA. El proceso conserva una advertencia de deprecación de Node (`fs.F_OK`) procedente de la herramienta antigua; no impidió compilar.
- HTTP local en el puerto 3001: 200, documento `es-PE`, título y descripción de Impulsa.
- `git diff --check`: sin errores de espacios. Git informa únicamente de conversión futura LF → CRLF según la configuración del equipo.
- Búsqueda en los JavaScript de producción: sin CanvasJS, testfirm.ru, Manager CRM ni Nikolay. No se incorporaron servicios externos.
- Auditoría de importaciones: se retiraron 50 archivos de prototipo sin referencias desde la entrada de la aplicación. Se conservaron pruebas, declaraciones, configuración y los dos archivos de terceros con sus avisos.

Cobertura de las comprobaciones solicitadas:

| Comprobación | Evidencia automatizada |
| --- | --- |
| Crear y editar contacto | Recorrido de interfaz; identidad y fecha de creación en modelo |
| Crear oportunidad vinculada | Recorrido de interfaz y varias oportunidades por contacto |
| Programar seguimiento | Recorrido de interfaz |
| Reprogramar | Recorrido de interfaz y transición sin duplicar registros |
| Completar y registrar resultado | Interfaz y transición atómica con fecha de realización |
| Crear próxima acción | Interfaz; relación, estado y fecha validados en modelo |
| Cerrar Ganado | Interfaz, fecha de cierre y cálculo de conversión |
| Cerrar Perdido con motivo | Interfaz, motivo Otro con explicación obligatoria |
| Resolver pendientes al cerrar | Interfaz exige decisión; modelo prueba mantener y cancelar sin eliminar |
| Actualización de resultados | Interfaz y cálculo de conversión, orígenes y pérdidas |
| Persistencia al recargar | Desmontar/cargar/montar y restauración desde localStorage |
| Español | Etiquetas consultadas por nombre accesible; calendario es-PE; documento HTML revisado por HTTP |
| Teclado básico | Tab, foco inicial, regreso al disparador y confirmación al descartar |

Adicionalmente se probaron límites de fecha al cruzar medianoche UTC, años bisiestos, reaperturas, intento de completar dos veces, restricciones de oportunidades cerradas, datos dañados/versiones desconocidas, cuotas de almacenamiento, conflictos entre pestañas, errores iniciales de lectura/escritura y restablecimiento explícitamente confirmado. El calendario se monta en jsdom y abre una ficha desde un evento.

Las primeras ejecuciones revelaron etiquetas de filtros sin asociación al input (corregidas con IDs) y consultas de pruebas que incluían controles ocultos detrás de un modal (acotadas al diálogo). Una ejecución inicial terminó con un error de React tras el fallo de prueba; la ejecución final terminó con código 0. Se registra el resultado final sin ocultar el alcance de las comprobaciones.

No se realizaron entrevistas ni pruebas con usuarios. La prueba automatizada de teclado en jsdom no sustituye una revisión con tecnologías de asistencia ni la prueba en navegador real.

## Riesgos y pendientes

La pila de 2021 se conserva por alcance; el script de compatibilidad permite compilar con Node moderno, pero no constituye modernización de dependencias. La demo no es una aplicación de producción ni un servicio multiusuario. localStorage depende del navegador y no es una copia de seguridad. La detección de cambios entre pestañas no equivale a una base de datos transaccional.

El rediseño visual completo y el relato UX/UI quedan para la segunda etapa, junto con la revisión visual pendiente por la limitación del navegador.
