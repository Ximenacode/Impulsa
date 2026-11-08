# Perfil de Usuario y Supuestos Pendientes de Validar — Impulsa

## 1. Perfil Hipotético de Usuario (Proto-Persona)

> [!NOTE]
> Este perfil es una **herramienta de diseño basada en supuestos** para guiar la toma de decisiones iniciales. No se fundamenta en un estudio etnográfico ni en una muestra estadística de campo.

```
+-------------------------------------------------------------------------+
| PROTO-PERSONA: "Carlos — Asesor de Microfinanzas y Negocios"             |
+-------------------------------------------------------------------------+
| Rol: Asesor comercial de campo y ventanilla para pequeños emprendedores |
| Experiencia digital: Nivel medio (usa smartphone, mensajería y hojas de  |
|                      cálculo básicas de escritorio)                     |
| Contexto: Combina visitas a talleres y tiendas con trabajo de escritorio|
+-------------------------------------------------------------------------+
```

### Características y Comportamientos Supuestos
- **Rutina híbrida:** Inicia la mañana en oficina o revisando pendientes desde su teléfono, luego realiza visitas de prospección en zonas comerciales o mercados, y finaliza registrando acuerdos.
- **Sobrecarga de estímulos:** Recibe mensajes y llamadas continuas de clientes potenciales preguntando por requisitos, montos o condiciones de financiamiento.
- **Herramientas actuales:** Cuaderno físico de notas, notas en el teléfono, chats de mensajería marcados como "no leídos" para recordar responder más tarde.
- **Tolerancia a la fricción:** Baja. Si un formulario solicita más de 6 campos obligatorios en el momento de la captación, prefiere no llenarlo y dejarlo para "después" (lo que suele derivar en olvido).

### Necesidades Clave Identificadas
1. **Acceso instantáneo a la lista de tareas del día:** Saber con exactitud a quién debe contactar sin tener que revisar contacto por contacto.
2. **Contextualización inmediata:** Antes de marcar un número o realizar una visita, recordar qué tipo de negocio tiene el cliente, cuál es su necesidad primordial y qué fue lo último que conversaron.
3. **Agilidad en la captura de prospectos:** Poder registrar a un nuevo contacto en menos de 45 segundos mientras está en la calle o tras una llamada breve.
4. **Claridad en el compromiso:** Asegurar que cada contacto con interés mantenga una fecha y una acción específica asignada.

---

## 2. Caso de Uso Ilustrativo (Escenario de Referencia)

> **Escenario:** Ana es asesora de negocios. Durante una visita a una zona comercial, conversa con la dueña de una panadería que necesita capital para comprar un nuevo horno antes de la campaña navideña.
>
> 1. Ana abre **Impulsa** y registra el contacto:
>    - Nombre del contacto: *Rosa Huamán*
>    - Negocio: *Panadería El Buen Trigo*
>    - Necesidad: *Financiamiento para adquisición de horno rotatorio*
>    - Producto de interés: *Financiamiento*
>    - Origen: *Visita*
>    - Próxima acción: *Llamar para coordinar revisión de requisitos*
>    - Fecha: *Jueves de esta semana*
> 2. Al llegar el jueves, Ana abre **Impulsa** en su pantalla de inicio (**Mi día**).
> 3. En la sección "Para hoy", visualiza a Rosa Huamán con el motivo y la acción acordada.
> 4. Tras la llamada telefónica, Ana presiona **Registrar seguimiento**, anota que Rosa tiene las cotizaciones listas y programa la entrega de documentos para el lunes siguiente, actualizando el estado de la oportunidad a "Interesado".

---

## 3. Matriz de Supuestos Pendientes de Validar con Usuarios Reales

| # | Hipótesis / Supuesto de Diseño | Riesgo si es falso | ¿Cómo validarlo en pruebas futuras? |
|---|--------------------------------|-------------------|-----------------------------------|
| **H1** | El asesor prefiere una pantalla inicial ("Mi día") enfocada exclusivamente en tareas pendientes antes que un dashboard de indicadores numéricos. | El usuario podría sentir que le falta una vista global estratégica o sentirse abrumado por las listas. | Observar si en la prueba de usabilidad el usuario comprende de inmediato qué hacer al iniciar sesión y qué sección busca primero. |
| **H2** | Registrar únicamente *nombre*, *necesidad* y *origen* es suficiente para capturar un prospecto sin generar resistencia. | Podría faltar un dato crítico (por ejemplo, número telefónico o dirección) que obligue a recurrir a otra libreta. | Medir la tasa de éxito al llenar el formulario y registrar qué campos adicionales el usuario intentó ingresar espontáneamente. |
| **H3** | Forzar la asociación bidireccional entre *próxima acción* y *fecha de contacto* evita seguimientos huérfanos sin causar frustración. | El usuario podría querer agendar una acción sin fecha definida o una fecha sin saber qué hará, sintiendo el formulario rígido. | Evaluar errores de validación durante la prueba al interactuar con el formulario de seguimiento. |
| **H4** | Los asesores diferencian con claridad entre "Historial de conversaciones" y "Próxima acción pendiente" en una misma ficha. | El usuario podría confundir el campo de notas pasadas con el compromiso futuro. | Solicitar al usuario que agregue una nota de lo conversado y verificar en qué campo intenta escribirla. |
| **H5** | La transición de etapas comerciales en una lista accesible (dropdown o selector de estado) es más clara y rápida en móvil que un tablero tipo Kanban de arrastrar y soltar. | El usuario podría preferir la metáfora espacial de arrastrar tarjetas si está habituado a herramientas de escritorio como Trello. | Comparar el tiempo y satisfacción de cambio de etapa entre móvil y escritorio. |
