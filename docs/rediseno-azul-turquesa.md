# Rediseño azul y turquesa de Impulsa

Registro de una iteración anterior. La apariencia vigente sigue la nueva referencia de la usuaria: [Interfaz cálida y compacta](referencia-calida.md). Los resultados de contraste descritos aquí corresponden al sistema anterior; `contraste.json` se genera con los colores actuales.

Revisión del 8 de noviembre de 2026. Se conserva el seguimiento comercial financiero, las cinco pantallas, el Kanban, los formularios y el almacenamiento local. No se hizo push ni publicación. La composición sigue la paleta y la distribución solicitadas en el encargo; no se atribuyen detalles a una imagen que no pudo inspeccionarse en esta revisión.

## Sistema visual implementado

- Navegación azul profundo **#122B46**, acciones y selección **#008F8B**, fondo **#F5F7FA** y superficies blancas. El texto oscuro de los botones turquesa supera el contraste de texto normal; en hover el fondo se oscurece y el texto es blanco.
- Jerarquía compartida de títulos, cifras, texto y metadatos; Roboto local, bordes finos, radios moderados y sombra mínima. No se añadieron degradados ni dependencias.
- **Mi día:** tres indicadores compactos con iconos discretos, un bloque breve de urgentes que selecciona el primer vencido y una lista central. El panel derecho muestra próximas citas cuando no hay selección y contexto/acción al seleccionar.
- **Contactos:** tabla blanca con cabecera diferenciada, identidad, negocio y teléfono alineados; en celular cada fila se convierte en un bloque.
- **Oportunidades:** próxima acción destacada, fecha separada, categoría breve y monto solo para financiamiento. La columna del Kanban comunica la etapa sin repetirla dentro de cada tarjeta. Se conserva la lista y el cambio de etapa por formulario.
- **Agenda y Resultados:** calendario, tarjetas, filtros, indicadores y gráficos con los mismos tokens. Los eventos conservan controles de teclado y acceso a la ficha. No cambian las fórmulas ni se suman montos como ingresos.
- **Formularios y modales:** campos agrupados en dos columnas; contexto y campos largos a todo el ancho. En celular pasan a una columna. Estados de error, selección, hover y foco coherentes.

Hasta 980 px la navegación pasa a una franja superior con etiquetas. Por debajo de 768 px se usa una columna y el detalle de Mi día abre un diálogo. El Kanban conserva desplazamiento interno y la lista es la opción inicial en móvil. Estas reglas están implementadas; falta verificar la composición real en los anchos indicados más abajo.

## Textos y conservación de datos

Las etiquetas vigentes son **Registrar resultado** y **Origen del contacto**. Las fechas se muestran como **Domingo, 8 de noviembre de 2026**. La actividad añade hora de 24 horas de Lima; una fecha comercial sin hora mantiene su día original.

Ana y Rosa ya tienen monto solicitado en la nueva semilla; ambas usan **Confirmar monto y destino del financiamiento**. Cuando un formulario corresponde a financiamiento con monto registrado, ofrece esa acción mediante **Usar esta acción**. Requiere un clic y no borra lo escrito.

Los datos guardados no se reemplazan al iniciar. Si hay acciones pendientes conocidas de la demo anterior que preguntan por un monto ya registrado, aparece **Revisar próximas acciones**. El diálogo compara acción guardada y propuesta por contacto. Solo **Confirmar actualización** cambia esas acciones y registra el evento; conserva contactos, oportunidades, fechas, canales, estados y relaciones. Acciones personalizadas, realizadas, canceladas o sin monto no se modifican. Cancelar no escribe. No se reclasifican registros heredados.

**Cargar demostración financiera** conserva su confirmación separada y reemplaza el conjunto completo: contactos, oportunidades, seguimientos e historial de demostración. No es necesario utilizarla para corregir las acciones anteriores. Un error de guardado conserva el estado previo y se muestra dentro del diálogo. La clave sigue siendo `impulsa.crm.v1` y el esquema sigue siendo v3.

## Verificación ejecutada

| Comprobación | Resultado |
| --- | --- |
| Jest: `npm test -- --watchAll=false --runInBand --json --outputFile=docs/test-results-diseno-azul.json` | **40 aprobadas, 3 suites, 0 fallos** |
| TypeScript: `tsc --noEmit` | Código 0, sin errores |
| Producción: `npm run build` | Compilación aprobada; solo aviso de deprecación `fs.F_OK` de las herramientas antiguas |
| Contraste: `node scripts/check-contrast.cjs` | **11 combinaciones aprobadas** |
| Servidor local | HTTP 200 en localhost:3000; bundle actualizado con los textos del rediseño |
| Integridad documental | Enlaces Markdown locales revisados; `git diff --check` sin errores, solo avisos LF/CRLF del equipo |

Las pruebas de interacción cubren creación y edición de contactos/oportunidades, reprogramación, registro de resultado y próxima acción, cierre y reapertura, Kanban, calendario localizado, indicadores y navegación móvil condicionada por ancho. Las pruebas de carga de demo recorren **Mi día, Contactos, Oportunidades, Agenda y Resultados** antes y después de reconstruir la sesión desde el almacenamiento.

Las nuevas pruebas comprueban fechas españolas, corrección explícita de acciones, cancelación sin escritura, conservación de datos y selección de urgentes sin persistir. Los errores de guardado, conflictos entre pestañas y datos inválidos conservan su cobertura. La recarga se comprueba reconstruyendo la sesión y volviendo a montar la aplicación en jsdom; no se presenta como una recarga manual de Chrome.

Evidencia: [test-results-diseno-azul.json](test-results-diseno-azul.json) y [contraste.json](contraste.json).

El cálculo de contraste incluye texto principal/blanco **13.86:1**, texto secundario/fondo **4.94:1**, texto oscuro/turquesa **4.76:1**, texto blanco/hover **5.70:1**, blanco/navegación **14.39:1** y borde de campo/blanco **3.31:1**. No es una certificación completa de accesibilidad.

## Pendiente y límites

No se completó la inspección visual real ni se obtuvieron capturas verificadas del rediseño. El host del navegador no estaba disponible y la herramienta de acceso alternativo detuvo la revisión porque no pudo verificar la URL. No se continuó la automatización tras ese bloqueo.

Queda revisar en navegador real **1440, 768 y 390 px**: densidad de Mi día, ajuste de fechas largas, tabla y Kanban, alturas del calendario, formularios/modales, zoom, foco y desbordamientos. También quedan las pruebas con lector de pantalla y usuarios. Las pruebas en jsdom y el contraste calculado no sustituyen esa revisión.

La aplicación sigue siendo una demo local, sin productos oficiales, tasas, requisitos, evaluación crediticia, aprobaciones ni desembolsos. El cierre Ganado conserva su significado comercial. No se sobrescribieron los datos del navegador durante esta implementación.
