# Decisiones de diseño

Son decisiones implementadas a partir del encargo y de la inspección del código. No se presentan como hallazgos de entrevistas o pruebas de usabilidad.

| Decisión | Motivo | Implementación |
| --- | --- | --- |
| Fondo cálido y navegación blanca compacta | Seguir la nueva referencia y dar menos peso al marco | Fondo #EEEDE9, blanco, acciones carbón #292D29, texto #272925 y acentos salvia/lavanda/arena |
| Una familia tipográfica | Reducir variación y evitar nuevas descargas | Roboto local existente; títulos, cuerpo y metadatos con escala común |
| Tokens y tema compartido | Hacer consistentes estados y componentes | `theme.ts`, variables CSS, radios de 8–10 px y sombras discretas |
| Navegación con icono y etiqueta | Hacer visibles las cinco áreas sin depender de símbolos | Solo Material UI Icons; selección con fondo y texto, además de color |
| Resumen compacto en Mi día | Dar prioridad a los seguimientos | Tres paneles con números destacados e iconos sobre círculos suaves; urgentes con acceso al primer vencido |
| Prioridades y etapas | Facilitar el repaso comercial | Filas alineadas y resumen real de las seis etapas; al seleccionar muestra contexto y Registrar resultado. En móvil abre un diálogo |
| Agenda semanal y actividad | Consultar el día sin inventar horarios ni eventos | Siete fechas navegables, pendientes por día y actividad real en secuencia; ninguna selección modifica el almacenamiento |
| Próxima acción destacada | Reducir lectura repetida en tarjetas | Personas y negocios en una línea flexible, categorías breves, acción con mayor peso y fecha separada; el Kanban omite la etapa repetida de su columna |
| Formularios agrupados | Aprovechar el espacio sin alargar cada campo | Dos columnas en escritorio, una en móvil; campos de contexto y texto largo ocupan todo el ancho |
| Corrección de acciones con revisión | Evitar preguntar por montos ya conocidos sin modificar datos a escondidas | Sugerencia en formularios y comparación antes/después confirmada para acciones reconocidas de demostraciones anteriores |
| Tabla de contactos adaptable | Facilitar consulta entre personas, negocios y números | Cabeceras visibles; filas en bloques legibles por debajo de 768 px |
| Teléfono opcional | Incorporar el pedido sin bloquear contactos previos | Validación de formato, número visible y migración sin borrado |
| Kanban y lista | Ofrecer comparación de etapas y consulta móvil | Seis columnas con desplazamiento interno; lista por defecto en móvil |
| Revisar antes de cerrar | Hacer comprensible el efecto sobre pendientes | Un único formulario tanto desde botón como desde arrastre |
| Gráficos con escala común | Evitar diferencias visuales para valores iguales | Valores textuales, escala 0–máximo común y estado sin datos |
| Demo con explicación bajo demanda | Mantener la advertencia disponible sin ocupar el área de trabajo | Botón Demo abre explicación; en móvil también da acceso al restablecimiento |

## Formularios y accesibilidad

La usuaria corrigió el enfoque: Impulsa corresponde a un asesor de una entidad financiera, no a servicios de consultoría o diseño. Los ejemplos anteriores se sustituyen en la nueva semilla por necesidades de capital de trabajo, maquinaria, ahorro y gestión de ingresos. El formulario distingue necesidad financiera, producto general y próxima acción del asesor. Monto solicitado solo aparece para financiamiento; las cuentas no tienen monto. Las definiciones extensas se retiraron de las tarjetas y las ayudas breves se mantienen junto a los campos. Los registros anteriores se conservan como sin clasificar; cargar la nueva demo exige una decisión explícita. No se realizó una prueba de usabilidad formal.

Propuesta enviada se explica como información comercial compartida; Ganado como cierre comercial de la demo, sin aprobación ni desembolso. Se eliminó el KPI monetario para evitar confundir montos solicitados con ingresos del banco. Véase [enfoque-financiero.md](enfoque-financiero.md).

Los campos se agrupan por identidad, contexto o etapa. Las etiquetas son visibles y los obligatorios se identifican con `*`. Los errores no borran valores. Material UI gestiona foco inicial, contención y restauración; Escape cierra cuando no hay edición pendiente y pide decisión si se perderían cambios.

El foco visible usa un contorno salvia de 3 px. Las etiquetas de estados acompañan al color. Las barras tienen alternativa textual. Las animaciones respetan `prefers-reduced-motion`. Se diseñan estados hover, selección y foco compartidos. Las acciones principales conservan altura cómoda; los eventos del calendario se mantienen compactos y accesibles por teclado.

Se usan **Registrar resultado** y **Origen del contacto**. Las fechas muestran día y mes en español, por ejemplo **Domingo, 8 de noviembre de 2026**. No se transforma el día de un seguimiento por zona horaria; la actividad sí usa la hora comercial de Lima.

## Adaptación por ancho

- Escritorio: navegación lateral, Mi día en dos columnas, contactos tabulares, Kanban con desplazamiento dentro de su región.
- Hasta 980 px: navegación superior con etiquetas, contenido fluido; Mi día conserva panel mientras dispone de ancho.
- 390 px: una columna, detalle de Mi día en diálogo, contactos en bloques, lista de oportunidades por defecto y formularios dentro del ancho disponible.

Se implementaron estas reglas CSS. La comprobación visual real en 1440/768/390 px sigue pendiente: el host no estaba disponible y el acceso alternativo se bloqueó al no poder verificar la URL. No se presenta la inspección estática como QA visual.

## Contraste

Se comprobaron numéricamente once combinaciones de texto, acción principal, navegación, estados, foco, bordes de campos y barras. El botón carbón usa texto blanco y el borde de campos #868B80 supera 3:1 sobre blanco. Véase [el informe vigente](referencia-calida.md) y [contraste.json](contraste.json). La apariencia azul/turquesa queda documentada como iteración anterior. Esta comprobación no sustituye revisar la experiencia con lector de pantalla y navegador real.
