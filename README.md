# Impulsa

Aplicación web para organizar la captación y el seguimiento comercial de pequeños negocios.

## Descripción y objetivo

Impulsa ayuda a mantener en un mismo lugar la información de contactos, sus oportunidades comerciales y las próximas acciones de seguimiento. Distingue la necesidad del negocio, el producto de interés y la etapa de cada oportunidad.

## Usuario al que está dirigido

Asesores comerciales que atienden a pequeños negocios y necesitan dar seguimiento a sus contactos y oportunidades. La aplicación es una demostración y no está conectada a una entidad financiera.

## Funcionalidades principales

- Registrar y buscar contactos.
- Crear oportunidades vinculadas a contactos y actualizar su etapa en un tablero Kanban.
- Programar, reprogramar y completar seguimientos con su resultado y una próxima acción opcional.
- Consultar pendientes en Mi día y en la Agenda.
- Registrar cierres comerciales y consultar resúmenes de contactos y oportunidades.
- Guardar los datos de la sesión en el almacenamiento local del navegador.

## Recorrido de uso

1. Registra un contacto y los datos del negocio.
2. Crea una oportunidad para ese contacto y completa su necesidad y producto de interés.
3. Programa un seguimiento y consúltalo en Mi día o en la Agenda.
4. Registra el resultado, programa otra acción si corresponde y actualiza la oportunidad cuando sea necesario.
5. Consulta los resultados de las oportunidades.

## Tecnologías

React 17, TypeScript, React Router, Redux, Material UI, DevExpress Scheduler y Create React App 4. Las dependencias se administran con npm y están registradas en `package-lock.json`.

## Instalación y ejecución

Desde la carpeta del proyecto:

```powershell
npm ci
npm start
```

Abre la dirección local que indique la consola; normalmente es `http://localhost:3000`. Para detener el servidor, usa Ctrl+C.

## Capturas

No hay capturas de pantalla disponibles en el repositorio.

## Limitaciones

- Es una demostración local: no tiene servidor, cuentas de usuario, sincronización entre dispositivos ni integraciones externas.
- Los registros de ejemplo son ficticios. No se realizan llamadas ni se envían mensajes.
- Los cierres y resúmenes representan actividad comercial registrada en la aplicación; no equivalen a aprobación de crédito ni a desembolsos.
- Los datos se guardan en el almacenamiento local del navegador y pueden perderse al borrar sus datos.
- No se afirma que la propuesta haya sido validada con usuarios.

Para detalles técnicos de persistencia y migraciones, consulta [enfoque financiero](docs/enfoque-financiero.md). El [flujo principal](docs/flujo-principal.md) describe el comportamiento de los módulos; [resultados y mejoras](docs/resultados-y-mejoras.md) reúne incidencias, comprobaciones y etapas anteriores.

## Créditos, licencia y asistencia de IA

La aplicación parte del repositorio [crm-with-leads](https://github.com/mihailnesterov/crm-with-leads), de Mihail Nesterov. Se conserva el reconocimiento al proyecto original. Consulta [LICENSE](LICENSE) para los términos de la licencia GPL-3.0 y [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) para los avisos de terceros.

Se utilizó asistencia de IA durante la inspección, implementación y documentación del proyecto. La asistencia no sustituye la revisión de sus cambios ni atribuye a la IA la autoría del repositorio original.

El documento [README-IMPULSA.md](README-IMPULSA.md) se conserva únicamente como referencia histórica de la primera etapa.
