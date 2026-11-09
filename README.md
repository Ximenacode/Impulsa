# Impulsa

**Captación y seguimiento comercial de productos financieros.**

Adaptación personal de práctica, realizada con asistencia de IA, del [proyecto crm-with-leads de Mihail Nesterov (mihailnesterov)](https://github.com/mihailnesterov/crm-with-leads). Se conservan LICENSE (GPL-3.0), las atribuciones y los avisos de terceros. El código original no se presenta como autoría de la diseñadora. La descripción recibida se conserva en [docs/README-recibido.md](docs/README-recibido.md).

## Problema y usuario propuestos

Impulsa apoya a un asesor de una entidad financiera que capta y da seguimiento a posibles clientes, especialmente pequeños negocios en Perú. Distingue la necesidad financiera del cliente, el producto de interés y la próxima acción del asesor. La propuesta de experiencia es una hipótesis del encargo; no se realizaron entrevistas, pruebas con usuarios ni mediciones de impacto comercial.

Los ejemplos usan categorías generales: financiamiento para capital de trabajo, financiamiento para maquinaria, cuenta de ahorro y cuenta para gestionar ingresos del negocio. No son productos oficiales de Caja Trujillo ni de otra entidad. No se inventan tasas, comisiones, requisitos ni promociones.

El recorrido implementado es: **registrar contacto → crear oportunidad → programar seguimiento → registrar resultado → definir otra acción o cerrar**.

## Base original / Cambios de esta versión

| Base original | Cambios de esta versión |
| --- | --- |
| Manager, módulos de clientes/contactos, ventas, leads y tareas | Impulsa: Mi día, Contactos, Oportunidades, Agenda y Resultados |
| Tarjetas y datos de demostración independientes | Registros vinculados e indicadores calculados |
| Datos rusos, rublos y periodos de 2021 | Pequeños negocios ficticios, PEN, español es-PE y fechas relativas a la primera carga |
| Formularios sin persistencia del recorrido completo | Guardado local, validación y recuperación explícita ante datos inválidos |
| Tablero de tareas estático | Kanban de oportunidades con seis etapas, conteos y próxima acción |
| Perfil/foto original y avisos automáticos | Asesor de demostración con iniciales y confirmaciones después de acciones |
| Presentación azul de Material UI | Fondo cálido, navegación blanca compacta, acciones carbón, acentos salvia/lavanda y paneles con jerarquía común |

## Funcionalidades

- **Mi día:** indicadores compactos de hoy, vencidos y oportunidades abiertas; urgentes y prioridades en columnas, resumen de las seis etapas a la derecha y detalle al seleccionar. Debajo, agenda semanal de contactos y actividad reciente. Pestañas, búsqueda y registro de resultado; en móvil el detalle se abre en diálogo. La agenda muestra fechas reales, sin asignar horas inventadas.
- **Contactos:** alta, edición, búsqueda, origen, número opcional visible en listado y ficha, oportunidades e historial relacionados.
- **Oportunidades:** Kanban de seis etapas y lista filtrable; necesidad financiera, producto de interés y próxima acción del asesor. **Monto solicitado** aparece solo para financiamiento y no representa aprobación ni desembolso. Las cuentas no muestran monto. El botón de cambio de etapa permite operar con teclado; arrastrar abre el mismo formulario antes de guardar.
- **Seguimientos:** programar, editar, reprogramar, completar con resultado/notas y próxima decisión, o cancelar con confirmación.
- **Cierres:** fecha, motivo de pérdida y explicación para Otro; decisión obligatoria sobre pendientes. **Propuesta enviada** significa información comercial compartida. **Ganado** es un cierre comercial registrado en la demo: no implica aprobación automática ni desembolso. No hay evaluación crediticia. Reapertura coherente y actividad real.
- **Agenda:** calendario mensual localizado, lista accesible y filtro por fecha, sin inventar horas.
- **Resultados:** contactos por origen, oportunidades por etapa, ganadas/perdidas, abiertas, motivos de pérdida y ganadas por origen. Conversión = ganadas / (ganadas + perdidas) × 100; cuenta cierres comerciales de la demo, no aprobaciones. No se suman montos como ventas o ingresos del banco. Sin cierres se indica expresamente. No hay filtro de periodo ni predicciones.

Los números de la semilla (`000 000 001` y similares) son marcadores ficticios sin uso operativo. No hay llamadas ni envíos. Usa solo datos ficticios.

## Tecnologías y requisitos

Se conservan React 17, TypeScript 4, React Router 5, Redux, Material UI 4, Material UI Icons, Roboto local y DevExpress Scheduler. No se añadieron paquetes. La compatibilidad con Node moderno se aplica dentro del proceso de CRA 4 / Webpack 4 mediante `scripts/run-cra.cjs`.

Entorno utilizado: Windows, PowerShell y Node **24.12.0**, con las dependencias existentes del proyecto. npm es el gestor correspondiente a `package-lock.json`. Arranque, pruebas y compilación se comprueban en este entorno; no se repitió una instalación limpia.

## Instalación y ejecución

Desde la carpeta del repositorio:

```powershell
npm ci
npm start
```

Si las dependencias ya están instaladas, basta `npm start`. Abre la URL que indique la consola, normalmente **http://localhost:3000**. Si está ocupado:

```powershell
$env:PORT = '3001'
npm start
```

Desde la carpeta de trabajo compartida, primero usa `cd crm-with-leads`. Para detener el servidor, Ctrl+C.

```powershell
npm test -- --watchAll=false --runInBand
.\node_modules\.bin\tsc.cmd --noEmit
npm run build
node scripts/check-contrast.cjs
```

`npm run build` genera `build/`; no publica la aplicación. No se hicieron commits, push, despliegue ni publicación. El registro técnico final se encuentra en [resultados-y-mejoras.md](docs/resultados-y-mejoras.md).

## Persistencia y conservación de datos

Los cambios se guardan únicamente en `localStorage`, bajo la clave estable `impulsa.crm.v1`. El esquema actual es **versión 3**. La migración v1 → v2 añade teléfono vacío; v2 → v3 marca los productos anteriores como **sin clasificar**, conservando sus textos e importes sin interpretarlos como financiamiento. Se mantienen IDs, fechas, relaciones e historial. La lectura no escribe ni carga otra semilla.

### Cargar los ejemplos financieros

Usa **Cargar demostración financiera** en la barra lateral, en el aviso de registros anteriores o dentro de **Demo** en móvil. Se explica que reemplazará todos los registros de Impulsa y se solicita confirmación. Cancelar conserva el almacenamiento exactamente como estaba. No se carga automáticamente sobre datos existentes.

Al confirmar se reemplazan juntos contactos, oportunidades, seguimientos y actividad anterior. El estado visible cambia solo después de guardar; si el almacenamiento falla, la confirmación muestra el error y conserva el conjunto anterior. Los datos nuevos permanecen al volver a cargar la sesión. La actividad reciente registra únicamente la carga que acabas de realizar; el historial de seguimientos incluye un caso financiero ficticio realizado.

Los cuatro casos principales de esta demo son:

| Contacto | Necesidad | Oportunidad | Próxima acción |
| --- | --- | --- | --- |
| Ana R. · Bodega Los Sauces | Comprar mercadería | Financiamiento de capital de trabajo | Confirmar monto y destino del financiamiento |
| Luis M. · Cafetería La Esquina | Separar sus ahorros personales del dinero del negocio | Cuenta de ahorro | Conversar sobre sus necesidades de ahorro |
| Rosa C. · Taller Buen Camino | Adquirir maquinaria | Financiamiento para equipo | Confirmar monto y destino del financiamiento |
| José P. · Comercio Sol Andino | Organizar los ingresos de su negocio | Cuenta para gestionar ingresos | Explicar información general y confirmar su interés |

Se mantienen dos casos de apoyo, Elena V. y Marco T., para mostrar cierres comerciales Ganado y Perdido; no representan aprobaciones. En la nueva demo no aparece la advertencia de producto anterior sin clasificar.

Ana y Rosa ya tienen un monto solicitado; su próxima acción es confirmarlo junto al destino. Para datos guardados de demostraciones anteriores, el aviso **Revisar próximas acciones** muestra el texto guardado y la propuesta. Solo **Confirmar actualización** modifica las acciones pendientes reconocidas de la demo con monto registrado; conserva fechas, estados, relaciones y acciones personalizadas. Cancelar no escribe. No es necesario reemplazar la base con otra demo para hacer esta corrección. Los formularios también ofrecen **Usar esta acción**; nunca sustituyen lo escrito automáticamente.

Puedes seguir consultando y editando registros anteriores. Si eliges una categoría financiera en una oportunidad anterior, el formulario advierte que reemplazará su producto e importe al guardar; el importe previo no se reutiliza como monto solicitado. No se eliminan ni convierten silenciosamente precios de la versión anterior.

La lectura migrada no reemplaza el almacenamiento: el esquema actualizado se escribe en la siguiente acción guardada. Se valida antes de aceptar los registros. Datos dañados o versiones desconocidas se bloquean y se informa del problema; el restablecimiento requiere confirmación. Un fallo de guardado conserva lo escrito. Los cambios detectados en otra pestaña requieren recargar y no se pisan deliberadamente.

La semilla se genera una sola vez. Fechas sin hora usan `YYYY-MM-DD`, día comercial `America/Lima`, formato es-PE e importes PEN. La presentación es **Domingo, 8 de noviembre de 2026**; la actividad añade hora de 24 horas. Borrar los datos del navegador elimina los cambios; no hay sincronización ni copia de seguridad. No ingreses información personal real.

## Estructura

`src/impulsa/`: modelo y transiciones (`model.ts`), persistencia, textos, tema y tokens, páginas, fichas/formularios, Kanban, panel Próximo paso y calendario. `src/store/store.ts` conserva la sesión compartida en Redux. `src/App.tsx` mantiene el punto de entrada.

Los archivos CanvasJS recibidos se conservan con sus avisos, pero no se importan al bundle. Los gráficos actuales usan HTML/CSS y valores reales del prototipo. Consulta [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## Caso de estudio y evidencia

El diseño vigente basado en la referencia recibida se documenta en [Interfaz cálida y compacta](docs/referencia-calida.md). La [iteración azul y turquesa](docs/rediseno-azul-turquesa.md) se conserva como registro anterior. El contexto comercial se documenta en [Enfoque comercial financiero](docs/enfoque-financiero.md).

El diagnóstico de los datos antiguos y la verificación completa del botón, los cinco módulos y la persistencia están en [Verificación de la carga de demostración](docs/verificacion-carga-demo.md).

- [Problema y alcance](docs/problema-y-alcance.md)
- [Usuario y supuestos](docs/usuario-y-supuestos.md)
- [Revisión inicial](docs/revision-inicial.md)
- [Flujo principal](docs/flujo-principal.md)
- [Decisiones de diseño](docs/decisiones-de-diseno.md)
- [Antes y después](docs/antes-y-despues.md)
- [Plan de prueba de usabilidad — sin ejecutar](docs/plan-de-prueba.md)
- [Resultados técnicos y mejoras](docs/resultados-y-mejoras.md)
- [Registro de etapa 1](docs/ETAPA-1.md) y [guía histórica de etapa 1](README-IMPULSA.md)

## Capturas y limitaciones

No se obtuvieron capturas verificadas del rediseño: el host del navegador no estaba disponible y el acceso alternativo se detuvo al no poder verificar la URL. No hay imágenes simuladas. La inspección visual real en 1440/768/390 px y la revisión con tecnologías de asistencia quedan pendientes, aunque se implementaron reglas adaptables y se comprueba comportamiento de componentes en jsdom.

Esta demo no es un sistema de producción. No incorpora backend, autenticación, IA dentro del producto, integraciones, llamadas, mensajes, analítica, evaluación crediticia ni decisiones de aprobación. No representa condiciones oficiales de una entidad. Las dependencias originales son antiguas y no se modernizaron masivamente. La detección entre pestañas no proporciona transacciones multiusuario.

## Asistencia de IA y contribución personal

Codex asistió en la inspección, implementación, propuesta visual, pruebas técnicas y documentación inicial a partir del encargo. Las comprobaciones técnicas no validan la usabilidad ni demuestran mejoras de negocio. La diseñadora debe revisar el caso antes de presentarlo y completar su contribución personal en [usuario-y-supuestos.md](docs/usuario-y-supuestos.md) y [resultados-y-mejoras.md](docs/resultados-y-mejoras.md).
