# Revisión inicial y evidencia

La revisión se basa en código y registros técnicos, no en una evaluación de usuarios. La [auditoría de la etapa 1](ETAPA-1.md) y su [lista de referencias](auditoria-referencias.json) documentan la base anterior. Al iniciar la etapa 2 se revisaron modelo, formularios, páginas, estilos, calendario, pruebas y documentación de la etapa 1.

| Evidencia observada | Interpretación o dificultad potencial | Cambio implementado |
| --- | --- | --- |
| Base original: datos y tarjetas incrustados; altas sin guardado compartido | El recorrido no permite practicar un caso completo | Modelo compartido y persistencia en etapa 1 |
| Base original: facturación, avisos automáticos, rublos, fechas de 2021 | Contenido ajeno al escenario propuesto | Datos ficticios peruanos y avisos posteriores a acciones |
| Etapa 1: Mi día mostraba tarjetas con varias acciones | Podría dificultar concentrarse en un solo seguimiento | Filas breves y panel Próximo paso en etapa 2 |
| Etapa 1: oportunidades solo en lista | No permite comparar visualmente etapas en columnas | Kanban con conteos, próxima acción y alternativa de lista |
| Etapa 1: contactos sin teléfono | Falta el campo solicitado por la usuaria | Teléfono opcional y migración conservadora |
| Etapa 1: ficha del contacto mostraba oportunidades pero no todo su historial | La actividad exige abrir oportunidades por separado | Historial derivado de todas las oportunidades del contacto |
| Etapa 1: estilos azules y controles de tamaños variados | Falta una dirección visual común | Tokens cálidos/verdes y tema único de Material UI |
| Etapa 1: cálculo de conversión y reglas de cierre probados | No constituye evidencia sobre facilidad de uso | Se conservan los cálculos; se propone una prueba futura |

## Límite de las capturas

No hay capturas verificadas de la base original ni de la etapa 1. En la primera etapa la herramienta no pudo identificar con seguridad la URL de Chrome. Al iniciar la segunda etapa el inventario informó que el host de acceso al navegador no estaba disponible. No se capturaron ventanas ajenas al proyecto ni se generaron imágenes simuladas del antes/después.

La dificultad potencial descrita en la tabla es interpretación de diseño y queda pendiente de contrastar con usuarios.

## Corrección del enfoque comercial

Observación del código: la semilla y las ayudas de las primeras iteraciones incluían servicios de diseño/consultoría y un importe presentado como precio. La usuaria aclaró expresamente que el producto apoya a un asesor de una entidad financiera. Por ello se corrigieron los ejemplos y los formularios para distinguir necesidad financiera, producto de interés y acción del asesor. Se añadió clasificación por producto, monto solicitado solo para financiamiento, semántica comercial de los cierres y carga confirmada de la nueva demo. La discrepancia de alcance se basa en el contenido observado y la aclaración de la usuaria, no en una investigación inventada. Véase [enfoque-financiero.md](enfoque-financiero.md).
