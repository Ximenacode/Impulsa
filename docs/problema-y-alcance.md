# Problema y alcance

Impulsa es una adaptación personal de práctica del [CRM de mihailnesterov](https://github.com/mihailnesterov/crm-with-leads), realizada con asistencia de IA. El planteamiento de producto es una hipótesis, no una conclusión obtenida de investigación con usuarios.

## Problema propuesto

Un asesor de una entidad financiera que capta posibles clientes, especialmente pequeños negocios, necesita reunir su contexto financiero y organizar próximas conversaciones. Impulsa se centra en ese seguimiento comercial. El prototipo original separaba clientes, contactos, tareas y ventas con datos independientes; su posible efecto sobre la tarea no se ha medido con usuarios.

## Objetivo

Hacer practicable este recorrido: registrar contacto → crear oportunidad → programar seguimiento → registrar resultado → definir otra acción o cerrar. La segunda etapa busca mejorar la lectura y la coherencia de ese recorrido.

## Alcance implementado

- Mi día orientado a vencidos y acciones de hoy, con selección y panel Próximo paso.
- Contactos con teléfono opcional, origen, necesidad, negocio y actividad vinculada.
- Oportunidades en Kanban de seis etapas y lista filtrable. Cambios accesibles con formulario; arrastre opcional con revisión antes de guardar.
- Seguimientos con resultado y siguiente paso explícitos; Agenda en lista/calendario.
- Resultados calculados, persistencia local y migración de los datos de la etapa 1.
- Sistema visual, documentación del caso y plan de una futura prueba.
- Necesidades financieras de mercadería, maquinaria, ahorro y gestión de ingresos; categorías de producto generales y monto solicitado solo para financiamiento. Carga explícita y confirmada de la nueva demo, con conservación de registros anteriores.

El teléfono y el Kanban se incorporaron por petición explícita de la usuaria al iniciar la segunda etapa. No se añadieron otras integraciones.

## Exclusiones

Backend, autenticación, permisos multiusuario, mensajes, llamadas, IA dentro del producto, datos personales reales, evaluación crediticia, aprobación, desembolso, condiciones oficiales, tasas, comisiones, requisitos, promociones, publicación y predicciones. No se realizaron entrevistas ni pruebas con usuarios.

## Criterio de revisión

El flujo debe conservar relaciones, permitir corregir errores y explicar las consecuencias de un cierre. Las pruebas técnicas comprueban comportamiento del código; la utilidad y facilidad de uso siguen pendientes de evaluación con personas.
