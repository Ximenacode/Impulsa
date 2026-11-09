# Impulsa — etapa 1

> Registro histórico de la primera etapa, anterior a la corrección del enfoque financiero. La versión vigente, su esquema y sus instrucciones se describen en [README.md](README.md).

Adaptación funcional del [prototipo crm-with-leads de Mihail Nesterov](https://github.com/mihailnesterov/crm-with-leads). Se conserva el README original, LICENSE (GPL-3.0) y los avisos de terceros. El código original no se atribuye a la diseñadora del producto.

Impulsa organiza contactos, oportunidades y seguimientos para un asesor comercial que atiende pequeños negocios en Perú. Esta definición es una hipótesis de producto; no se realizaron entrevistas ni validación con usuarios.

## Ejecutar en Windows

Desde la carpeta del proyecto:

```powershell
cd "D:\UNCP XIMENA\SEMESTRES\hackaton\hackaton\crm-with-leads"
npm ci
npm start
```

Con dependencias ya instaladas basta `npm start`. Abre la URL local que indique la consola, normalmente http://localhost:3000. Si está ocupada, responde a la consola o usa:

```powershell
$env:PORT = '3001'
npm start
```

El script de arranque permite usar la base CRA 4 / Webpack 4 con Node moderno habilitando su proveedor OpenSSL en el proceso hijo. No se actualizaron masivamente las dependencias. El archivo de bloqueo corresponde a npm; se preservaron los cambios de dependencias que ya existían al iniciar este trabajo.

```powershell
npm run build
npm test -- --watchAll=false --runInBand
.\node_modules\.bin\tsc.cmd --noEmit
```

La salida de compilación se guarda en `build/`. No se hizo commit, push, despliegue ni publicación.

## Recorrido para revisar

1. En Mi día, pulsa **Nuevo contacto**. Solo nombre y negocio son obligatorios; se propone un origen que puedes cambiar.
2. En la ficha del contacto, crea una oportunidad. Un contacto admite varias oportunidades.
3. Programa un seguimiento desde la oportunidad. El contacto se deriva de esa relación.
4. En Mi día o Agenda, usa **Editar o reprogramar**, o **Registrar resultado**.
5. Al registrar el resultado, selecciona explícitamente programar la próxima acción o finalizar sin otra acción.
6. Usa **Editar o cambiar etapa** para cerrar o reabrir una oportunidad. Perdido exige un motivo; Otro exige explicación. Si hay pendientes, decide mantenerlos o cancelarlos.
7. Consulta Resultados y recarga: los cambios deben mantenerse.

Los seguimientos cancelados y realizados se conservan en el historial de la oportunidad y en la lista de Agenda. Las oportunidades cerradas no admiten nuevas acciones hasta reabrirlas; los seguimientos mantenidos sí se pueden completar, cancelar o reprogramar.

## Datos y almacenamiento

- No hay backend, autenticación, IA, analítica ni integraciones. No se hacen llamadas ni se envían mensajes reales.
- La semilla usa negocios ficticios, nombres abreviados e importes nuevos en PEN. No incluye teléfonos, documentos, fotos ni correos reales.
- Las fechas de demostración se calculan desde el día de la primera carga y se guardan una sola vez.
- `localStorage`, clave `impulsa.crm.v1`, esquema `version: 1`. Identificadores generados con Web Crypto.
- Se validan estructura, identificadores, relaciones, estados, importes, fechas y reglas de cierre al cargar y guardar.
- Un fallo de guardado conserva el formulario. Datos dañados o versiones desconocidas bloquean la carga sin reemplazarlos.
- **Restablecer demostración** solicita confirmación y reemplaza exclusivamente los datos de Impulsa.
- La versión 1 es el primer esquema. No existe migración desde los datos rusos originales. Una futura versión deberá implementar una migración explícita en `decode`; por ahora toda versión desconocida se rechaza.
- Se detectan cambios de otra pestaña comparando el valor guardado antes de escribir y mediante el evento `storage`; se pide recargar. No hay sincronización entre dispositivos ni transacciones distribuidas entre pestañas.
- Borrar los datos del navegador elimina los cambios. Usa solo información ficticia.

## Reglas de cálculo

- Día comercial: `America/Lima`. Fechas programadas sin hora en `YYYY-MM-DD`, sin interpretar cadenas como fechas UTC.
- Hoy y vencidos incluyen solo pendientes. Próximos incluye pendientes posteriores a hoy. Realizados se ordena por fecha de realización descendente.
- Contactos por origen; oportunidades por etapa; ganadas y perdidas; motivos de pérdida; ganadas por origen del contacto.
- Conversión = ganadas / (ganadas + perdidas) × 100. Sin cierres se muestra **Sin oportunidades cerradas**.
- No hay filtro de periodo: se consideran todos los registros. El monto ganado suma los importes estimados de oportunidades ganadas; las que no tienen monto no agregan importe.
- Fechas y números usan `es-PE`; importes usan `Intl.NumberFormat` con moneda PEN. No se calculan tasas financieras ni predicciones.

## Estructura

Se conservan React 17, TypeScript, React Router 5, Redux, Material UI 4, Roboto local y DevExpress Scheduler. `src/App.tsx` conserva el punto de entrada; Redux mantiene la sesión compartida. No se incorporó ningún paquete nuevo.

- `src/impulsa/model.ts`: registros, validación, transiciones y cálculos puros.
- `src/impulsa/persistence.ts`: lectura y escritura con manejo de errores.
- `src/impulsa/texts.ts`: textos y opciones en español.
- `src/impulsa/Pages.tsx`: cinco módulos conectados.
- `src/impulsa/RecordForms.tsx` / `Records.tsx`: formularios y fichas compartidos.
- `src/impulsa/Calendar.tsx`: calendario existente adaptado a seguimientos de día completo, con formularios comunes.
- `scripts/source-audit.cjs`: auditoría de importaciones locales usando TypeScript. Las pruebas, declaraciones y archivos de configuración tienen puntos de entrada propios.

Las pantallas originales dependían principalmente de registros incrustados y formularios sin guardado compartido. Se sustituyeron esas capas por componentes conectados y se retiraron los archivos sin referencias, dejando la auditoría previa en `docs/auditoria-referencias.json`. Los archivos CanvasJS se conservan con sus avisos originales en `src/vendors/`, pero **no se importan ni distribuyen en el bundle de Impulsa**. Los gráficos de resultados usan HTML/CSS y valores del modelo.

## Segunda etapa

Pendientes: rediseño visual completo, sistema de diseño, documentación narrativa del caso UX/UI, revisión visual en navegador y móvil, y pruebas con usuarios si se planifican. No se afirma impacto comercial ni validación de la hipótesis.

El estado de las comprobaciones y las limitaciones del entorno se registra en `docs/ETAPA-1.md`.
