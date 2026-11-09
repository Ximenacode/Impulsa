# Enfoque comercial financiero vigente

Impulsa apoya a un asesor de una entidad financiera que capta y da seguimiento a posibles clientes, especialmente pequeños negocios. Conserva el diseño y los flujos; no es una herramienta de evaluación crediticia ni de aprobación.

## Tres datos distintos

| Necesidad del cliente | Producto financiero general | Ejemplo de próxima acción del asesor |
| --- | --- | --- |
| Comprar mercadería | Financiamiento para capital de trabajo | Consultar cuánto financiamiento necesita |
| Adquirir maquinaria | Financiamiento para maquinaria | Comprender el destino del financiamiento |
| Ahorrar como emprendedor | Cuenta de ahorro | Coordinar una conversación |
| Gestionar ingresos del negocio | Cuenta para gestionar ingresos del negocio | Explicar información general del producto |

La revisión de carga completa utiliza estos casos concretos:

| Contacto y negocio | Necesidad | Oportunidad | Próxima acción del asesor |
| --- | --- | --- | --- |
| Ana R., Bodega Los Sauces | Comprar mercadería | Financiamiento de capital de trabajo | Consultar monto necesario y destino del financiamiento |
| Luis M., Cafetería La Esquina | Separar sus ahorros personales del dinero del negocio | Cuenta de ahorro | Conversar sobre sus necesidades de ahorro |
| Rosa C., Taller Buen Camino | Adquirir maquinaria | Financiamiento para equipo | Conocer el equipo que necesita y el monto solicitado |
| José P., Comercio Sol Andino | Organizar los ingresos de su negocio | Cuenta para gestionar ingresos | Explicar información general y confirmar su interés |

Elena V. y Marco T. son casos financieros adicionales de Ganado y Perdido para conservar la demostración de indicadores. Son seis contactos, seis oportunidades y cinco seguimientos: cuatro pendientes y uno realizado. El realizado pertenece a Elena y expresa su deseo de continuar, sin aprobación ni desembolso.

Otra acción posible es confirmar si desea continuar con la solicitud. Las categorías son generales: no representan productos oficiales de Caja Trujillo ni de otra entidad. No se incorporan tasas, comisiones, requisitos ni promociones inventadas.

## Montos y etapas

Monto solicitado aparece únicamente para financiamiento y puede quedar sin registrar. Las cuentas no tienen campo de monto y sus tarjetas, fichas y paneles no muestran importe. El modelo rechaza importes en categorías de cuentas. Resultados utiliza conteos y conversión comercial; se retiró la suma monetaria de oportunidades ganadas. Ningún monto se presenta como precio de una asesoría, ingreso del banco, importe aprobado o desembolsado.

Se conservan Nuevo, Contactado, Interesado, Propuesta enviada, Ganado y Perdido. Propuesta enviada significa información comercial compartida. Ganado significa cierre comercial registrado en la demo y no implica aprobación automática ni desembolso. Los cierres siguen solicitando resolver seguimientos pendientes. La conversión conserva Ganadas / (Ganadas + Perdidas) × 100 y no mide aprobación crediticia.

## Registros anteriores y nueva demostración

La clave local sigue siendo `impulsa.crm.v1`; el esquema es v3. v1 → v2 agrega teléfono vacío; v2 → v3 agrega categoría `legacy` (sin clasificar). Se conservan todos los valores anteriores, sin asumir que un precio de diseño o consultoría sea un monto solicitado. Esos importes se conservan internamente para no perder información, pero se ocultan en tarjetas y fichas y no se suman a resultados. La carga no modifica localStorage; una operación guardada persiste el esquema actualizado.

Si se edita una oportunidad anterior, el formulario permite conservar su producto sin clasificar o elegir una categoría financiera. Antes de reclasificar advierte que al guardar se reemplazará el producto y su importe. Nunca precarga el importe anterior como monto solicitado. Si se elige una cuenta, el nuevo registro no contiene monto.

Para probar los nuevos casos, pulsa **Cargar demostración financiera** en la barra lateral o el aviso de registros anteriores. En móvil, está dentro de **Demo**. La confirmación explica que reemplaza todos los contactos, oportunidades, seguimientos e historial. Cancelar mantiene los registros guardados. No se fuerza el restablecimiento ni se sustituyen los registros silenciosamente.

### Origen de los textos antiguos

`load` consulta primero `localStorage`. Si hay una versión anterior válida, conserva sus textos y relaciones mediante `decode`; no llama a la semilla nueva. Por eso los títulos originales y sus seguimientos pueden seguir visibles antes de confirmar la carga. La migración identifica registros heredados, no los convierte en productos financieros. La semilla vigente no contiene los ejemplos de inventario, cartas o catálogos.

### Comportamiento comprobado de la carga

La confirmación ejecuta `replaceWithFinancialDemo`, que genera y valida un conjunto completo, lo guarda y después actualiza el mismo store de Redux que utiliza el Provider de la interfaz. No combina listas antiguas y nuevas. La actividad anterior se reemplaza por el evento real de carga confirmada; no se inventan operaciones automáticas para aparentar uso.

Si falla el guardado, se muestra un error dentro de la confirmación y se conservan tanto el estado visible como el valor almacenado. Se puede reintentar. Si otra pestaña cambió los datos, se informa del conflicto y no se sobrescriben. Al reconstruir la sesión desde el almacenamiento se conservan exactamente los identificadores, relaciones, fechas y registros nuevos.

## Alcance de comprobaciones

La revisión vigente de contenido, confirmación, estado visible y persistencia está detallada en [verificacion-carga-demo.md](verificacion-carga-demo.md): 36 pruebas aprobadas en 3 suites, incluida la carga desde un conjunto heredado completo y revisión de los cinco módulos antes y después de reconstruir la sesión. La siguiente ejecución de 34 pruebas corresponde a la revisión anterior.

Verificación final: **34 pruebas aprobadas, 2 suites, 0 fallos**, con evidencia en [test-results-financiero.json](test-results-financiero.json). `tsc --noEmit` y `npm run build` aprobados. Cubre flujos existentes, categorías financieras, monto condicional, cuentas sin monto, migración conservadora, carga confirmada, cancelación sin escritura y resultados de cierres. También se revisaron enlaces Markdown locales y espacios de la diferencia, sin errores. Se conserva el aviso de deprecación `fs.F_OK` de la herramienta original, que no impide compilar.

Los conteos y la conversión consideran todos los registros conservados, incluidos los anteriores sin clasificar cuando existen; el aviso de versión anterior permanece visible. Para revisar exclusivamente los nuevos casos ficticios debe cargarse la demostración financiera mediante su confirmación. No se inventan ni se suman ingresos bancarios.

La prueba de interfaz automatizada recorre Contactos, Oportunidades/Kanban, Mi día, Agenda/calendario y Resultados en jsdom. No se presenta como una prueba de usabilidad ni como inspección visual en navegador real. No se publicaron cambios ni se hicieron commits. Se conservan LICENSE y las atribuciones del proyecto original.
