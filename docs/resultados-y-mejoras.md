# Resultados técnicos y mejoras

## Implementación

Impulsa apoya a un asesor de una entidad financiera en la captación y seguimiento comercial de posibles clientes, especialmente pequeños negocios. Se conserva el recorrido, teléfono, Kanban, Agenda e historial. El sistema vigente sigue la referencia entregada: navegación blanca compacta, fondo piedra, acciones carbón y acentos salvia/lavanda/arena. Las paletas azul/turquesa y cálida/verde anteriores quedan como iteraciones históricas.

El esquema actual es v3. La migración desde v1/v2 conserva IDs, fechas, relaciones, historial, textos e importes y clasifica los productos anteriores como sin clasificar. No interpreta esos importes como solicitudes ni los muestra en indicadores financieros. La lectura no escribe. La opción Cargar demostración financiera reemplaza los registros solo tras confirmación; cancelar conserva el valor guardado. Véase [enfoque-financiero.md](enfoque-financiero.md).

## Comprobaciones técnicas

**Revisión vigente de la referencia cálida:** **41 pruebas aprobadas en 3 suites**, TypeScript y compilación de producción aprobados. Incluye el recorrido existente, carga completa, conservación del almacenamiento, fechas españolas, corrección confirmada de acciones, selección de urgentes y agenda semanal. Evidencia: [test-results-referencia-calida.json](test-results-referencia-calida.json). Implementación y límites: [referencia-calida.md](referencia-calida.md). La revisión visual en navegador quedó pendiente: el host no estaba disponible y el acceso alternativo no pudo verificar la URL. El servidor local entrega la versión actualizada con HTTP 200.

**Iteración azul/turquesa anterior:** 40 pruebas aprobadas en 3 suites. Evidencia histórica: [test-results-diseno-azul.json](test-results-diseno-azul.json) y [rediseno-azul-turquesa.md](rediseno-azul-turquesa.md).

**Revisión anterior de la carga completa:** 36 pruebas aprobadas en 3 suites, TypeScript y compilación de producción aprobados. Se verificaron los casos de Ana/Luis/Rosa/José, relaciones, reemplazo de historial, cancelación, fallo y reintento del guardado y los cinco módulos después de cargar y reconstruir la sesión. Evidencia histórica: [test-results-carga-demo.json](test-results-carga-demo.json). Alcance: [verificacion-carga-demo.md](verificacion-carga-demo.md).

**Primera corrección financiera:** 34 pruebas aprobadas en 2 suites, TypeScript sin errores y compilación de producción aprobada. La evidencia histórica está en [test-results-financiero.json](test-results-financiero.json); el detalle de migración y semántica comercial está en [enfoque-financiero.md](enfoque-financiero.md). Las ejecuciones que siguen documentan las iteraciones anteriores.

- Pruebas de etapa 2: **30 aprobadas, 2 suites, 0 fallos**. Comando: `npm test -- --watchAll=false --runInBand --json --outputFile=docs/test-results-etapa-2.json`. Evidencia en [test-results-etapa-2.json](test-results-etapa-2.json).
- TypeScript: `tsc --noEmit` aprobado, sin errores.
- Servidor de desarrollo: compilado correctamente y HTTP 200 en el puerto 3001.
- Dependencias: `npm ls --depth=0` terminó con código 0. Se preservaron tres paquetes extra ya presentes (`bindings`, `file-uri-to-path`, `nan`); no se instaló ni actualizó ningún paquete.
- Enlaces Markdown locales: revisados, sin destinos inexistentes. Se corrigió la ruta relativa de la copia del README recibido.
- `git diff --check`: sin errores de espacios; quedan únicamente avisos del equipo sobre conversión LF → CRLF.
- Compilación de producción: `npm run build` **aprobado**, código 0, con el ajuste final de contraste incluido en `build/`. No hay advertencias de aplicación; la herramienta antigua emite el aviso de Node sobre `fs.F_OK`.

`test-results.json` y `ETAPA-1.md` corresponden a la primera etapa. Una primera ejecución de interacción de etapa 2 encontró una consulta de prueba que incluía la tabla oculta detrás del modal; se acotó al diálogo. La ejecución final de las 30 pruebas concluyó con código 0.

Las comprobaciones cubren el recorrido comercial existente y añaden conservación de datos al migrar, teléfono, agrupación/cambio de etapa del Kanban, arrastre con revisión y selección coherente en Mi día. No son pruebas con usuarios.

También se probó la variante móvil mediante `matchMedia` en jsdom: lista de oportunidades por defecto y detalle de Mi día en diálogo. Esto verifica comportamiento condicionado por ancho; no mide desbordamientos ni composición visual real.

## Contraste calculado

`node scripts/check-contrast.cjs`: **11 combinaciones aprobadas** del sistema cálido vigente. El informe [contraste.json](contraste.json) contiene colores, cociente y umbral utilizado.

| Combinación | Cociente |
| --- | --- |
| Texto principal / blanco | 14.68:1 |
| Texto secundario / fondo | 4.77:1 |
| Texto secundario / blanco | 5.59:1 |
| Blanco / acción carbón | 13.98:1 |
| Texto blanco / hover de acción | 9.44:1 |
| Blanco / navegación activa | 14.68:1 |
| Texto activo / salvia suave | 5.57:1 |
| Texto de error / fondo de error | 5.59:1 |
| Foco / fondo | 5.69:1 |
| Borde de campo / blanco | 3.49:1 |
| Barra / blanco | 3.60:1 |

Se usa 4.5:1 como umbral para texto y 3:1 para los elementos gráficos/foco revisados. El borde de los campos es #868B80 y la acción carbón usa texto blanco. Se conservan bordes decorativos discretos. Es una auditoría de estas combinaciones, no una certificación completa de accesibilidad.

## Problemas abordados

### Revisión del lenguaje anterior — registro histórico

Se simplificaron términos en una iteración anterior, pero esa corrección conservaba un enfoque de servicios que no correspondía al producto financiero. Esta iteración quedó superada por la corrección comercial: sus ejemplos ya no son la semilla vigente y sus definiciones extensas se retiraron de las tarjetas.

Evidencia histórica de aquella iteración: [test-results-lenguaje.json](test-results-lenguaje.json), 31 pruebas aprobadas con esquema v2. No se realizaron pruebas con usuarios. La evidencia vigente de la corrección financiera se encuentra en [test-results-financiero.json](test-results-financiero.json).

- Ausencia del número de contacto y del tablero solicitados: incorporados sin backend ni nuevas dependencias.
- Información permanente y actividad mezcladas en ficha: separadas por secciones; se incorpora historial de todas las oportunidades del contacto.
- Lista de Mi día con varias acciones por tarjeta: se reduce a consulta y un panel de preparación.
- Errores de almacenamiento que se podían ocultar al abrir otro formulario: permanecen visibles hasta un guardado correcto o recarga.
- Importación global de la biblioteca de iconos: sustituida por importaciones individuales para evitar trabajo innecesario en las herramientas.

## Límites y próximos pasos

El host de acceso al navegador no estaba disponible. Se implementaron reglas para escritorio, 768 px y móvil, pero faltan capturas e inspección visual real en 1440/768/390 px. Las pruebas de teclado de jsdom no sustituyen una revisión completa con lector de pantalla o navegador. El arrastre simulado no demuestra compatibilidad táctil: en móvil se ofrece lista y controles de formulario.

La pila original es antigua; se conserva por alcance. localStorage no ofrece copias de seguridad, sincronización entre equipos ni transacciones multiusuario. La app usa únicamente datos ficticios. No se ha desplegado ni publicado.

## Validación con usuarios

Pendiente. No se realizaron entrevistas, sesiones, testimonios ni mediciones de mejora. No se atribuyen resultados de negocio a esta adaptación. Véase el [plan de prueba](plan-de-prueba.md).

## Contribución personal — por completar por la diseñadora

- Qué decidí personalmente:
- Qué revisé de la propuesta asistida por IA:
- Qué modifiqué después de revisarla:
- Evidencias propias que quiero incorporar:
- Qué aprendí:

## Asistencia de IA

Codex asistió en inspección del código, implementación, propuesta visual, pruebas técnicas y redacción inicial de estos documentos a partir de las instrucciones. La diseñadora debe revisar el contenido y completar su contribución personal antes de presentarlo en portafolio. No se asume autoría propia del proyecto original ni actividades de investigación no confirmadas.
