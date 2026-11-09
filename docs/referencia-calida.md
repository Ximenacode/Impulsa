# Interfaz cálida y compacta

Esta revisión toma la imagen entregada por la usuaria como referencia de composición: barra blanca estrecha, fondo piedra, paneles redondeados, acciones carbón y acentos salvia, lavanda y arena. Sustituye la apariencia azul/turquesa de la iteración anterior. Se conserva el contexto financiero y el conjunto de datos guardados.

## Qué cambió

La navegación lateral pasa a ser una pieza blanca compacta con iconos y etiquetas visibles. La selección oscura y el foco diferenciado permiten reconocer el módulo activo. Se conservan las cinco pantallas, el acceso a la demo y los formularios existentes.

En Mi día las prioridades se alinean por contacto, negocio, siguiente acción y vencimiento. En anchos intermedios se priorizan contacto, acción y fecha; en celular cada fila se reorganiza sin ocultar el negocio. Las fechas completas se conservan y los estados llevan texto.

El panel derecho resume las seis etapas con conteos y barras calculados a partir de las oportunidades guardadas. Al seleccionar un seguimiento muestra su detalle y Registrar resultado. No se copian de la imagen nombres, cifras, etapas incompletas ni datos comerciales.

La agenda semanal inferior permite consultar siete fechas, cambiar de semana, volver a hoy y abrir el seguimiento. Los puntos indican pendientes reales de ese día. No se asignan horas: los seguimientos continúan siendo acciones del día. No se guarda la selección de fechas ni se modifican registros al navegar.

La actividad reciente se presenta como una secuencia cronológica con eventos reales de la aplicación. Sin actividad se muestra su estado vacío. No se añaden conversaciones, cierres ni reuniones de ejemplo al historial guardado.

Tablas, Kanban, calendario, gráficos, fichas, formularios y modales comparten el nuevo tema. Se mantienen los mensajes de error, los cierres comerciales sin aprobación crediticia y la corrección confirmada de acciones con monto conocido. Las áreas blancas, el espaciado y el peso tipográfico dan la jerarquía; no se añaden fondos decorativos, degradados ni sombras pesadas.

## Paleta

| Uso | Color |
| --- | --- |
| Fondo piedra | #EEEDE9 |
| Paneles y navegación | #FFFFFF |
| Texto principal | #272925 |
| Acción principal | #292D29 |
| Selección suave | #E5EDE2 |
| Foco y texto salvia | #496343 |
| Texto secundario | #666960 |

Roboto local y Material UI Icons ya estaban instalados. No se añadieron dependencias. El resumen de etapas usa salvia, lavanda y arena como apoyo; los conteos y etiquetas siguen dando la información por texto.

## Verificación

Resultado: **41 pruebas aprobadas en 3 suites**, TypeScript sin errores y compilación de producción aprobada. El servidor local responde HTTP 200 y entrega el código actualizado. Se conservan las pruebas del recorrido comercial, los cinco módulos, el reemplazo confirmado de la demo, errores de guardado y recuperación de la sesión desde localStorage. Se añade una prueba de la agenda semanal: consulta de una fecha sin pendientes, vuelta a hoy y apertura del seguimiento sin escribir en el almacenamiento. La evidencia de esta revisión está en [test-results-referencia-calida.json](test-results-referencia-calida.json).

Las once combinaciones de contraste calculadas pasan sus umbrales: texto 4.5:1 y elementos gráficos revisados 3:1. Texto principal/blanco 14.68:1, secundario/fondo 4.77:1, acción carbón/blanco 13.98:1 y foco/fondo 5.69:1. Informe: [contraste.json](contraste.json). Es una comprobación limitada de combinaciones, no una certificación completa.

La inspección visual real continúa pendiente. El host del navegador no estaba disponible; el intento con Chrome se detuvo porque la herramienta no pudo verificar la URL. No se obtuvieron capturas verificadas ni se sustituyó esa comprobación por imágenes simuladas. Queda revisar composición, ajuste de fechas, desplazamiento y foco en 1440, 768 y 390 px, además de lector de pantalla.

La implementación no cambia el esquema v3 ni la clave `impulsa.crm.v1`, no carga otra semilla sobre datos existentes y no hace push ni publicación.
