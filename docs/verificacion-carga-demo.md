# Corrección de contenido y carga de demostración

## Origen de los textos anteriores

La entrada ejecutada es `src/index.tsx` → `App.tsx` → `impulsa/ImpulsaApp.tsx`. La carga de sesión consulta primero `localStorage`, clave `impulsa.crm.v1`. Si existe un conjunto válido, no vuelve a generar los ejemplos iniciales.

Los títulos Control de inventario, Carta digital, Catálogo de servicios y Registro de pedidos pertenecían a demostraciones anteriores. La migración v1/v2 conserva sus textos, seguimientos y actividad y añade `productCategory: legacy`; esa es la causa de la etiqueta Producto anterior sin clasificar. No se convierten automáticamente esos casos en productos financieros.

No se inspeccionó el almacenamiento del perfil real de Chrome: el host de acceso al navegador no está disponible. Este diagnóstico se comprobó reproduciendo un conjunto heredado completo con esos cuatro títulos, necesidades antiguas, seguimientos de catálogo/inventario e historial antiguo.

## Corrección realizada sin cambiar el diseño

- Se ajustó la semilla para los casos solicitados de Ana, Luis, Rosa y José, con necesidades, oportunidades y acciones relacionadas coherentes. Luis tiene interés en ahorro; Rosa, en financiamiento para equipo.
- La carga confirmada usa `replaceWithFinancialDemo`: genera un conjunto completo, valida las relaciones, sustituye solo la clave de Impulsa y devuelve la sesión guardada.
- La interfaz despacha esa sesión al store del Provider que está mostrando la aplicación, obtenido con `useStore`. La prueba utiliza un Provider independiente para comprobar que estado visible y persistencia se actualizan juntos.
- La actividad anterior se reemplaza por el evento real Demostración financiera cargada. El seguimiento realizado ficticio de Elena conserva un resultado financiero sin aprobación ni desembolso. No se fabrican eventos automáticos de uso.
- Si el guardado falla, se muestra el error en la confirmación, que permanece abierta; estado y almacenamiento anteriores se conservan y se puede reintentar. Los conflictos entre pestañas siguen informándose sin sobrescribirlos.
- No se modificaron estilos, distribución, navegación, etapas ni reglas de cierre. No se incorporaron condiciones oficiales ni evaluación crediticia.

## Cómo cargarla

1. Abre el proyecto local actualizado. La dirección local comprobada es `http://localhost:3000`.
2. Pulsa **Cargar demostración financiera** en la barra lateral o el aviso de registros anteriores. En móvil está dentro de **Demo**.
3. Lee la confirmación: sustituirá contactos, oportunidades, seguimientos y actividad de Impulsa en este navegador. No elimina otras claves de almacenamiento.
4. Cancela si necesitas conservar el conjunto actual. Al confirmar se cargan seis contactos, seis oportunidades y cinco seguimientos: los cuatro casos principales y dos casos adicionales para mostrar Ganado/Perdido.
5. Tras la carga, la advertencia de registros heredados desaparece. Recargar no vuelve a generar IDs ni reintroduce los datos antiguos.

El reemplazo no es una migración del significado de registros antiguos. Es una decisión explícita de cargar otros ejemplos. Los datos anteriores se mantienen hasta que se confirma y el guardado termina correctamente.

## Comprobaciones

Pruebas automatizadas: **36 aprobadas en 3 suites**, con evidencia en [test-results-carga-demo.json](test-results-carga-demo.json). TypeScript: aprobado. `npm run build`: compilación de producción aprobada, sin errores de aplicación. Se conserva el aviso de deprecación `fs.F_OK` de las herramientas originales. La hoja CSS generada conserva el mismo hash de la revisión anterior: no se cambió el diseño.

| Comprobación | Después de confirmar | Después de reconstruir una sesión desde el almacenamiento |
| --- | --- | --- |
| Mi día | Acciones de Ana/Luis y próximos de Rosa/José; panel con necesidad correcta | Mismos datos |
| Contactos | Personas/negocios y fichas con necesidad, oportunidad e historial relacionado | Mismos datos |
| Oportunidades | Los cuatro títulos financieros y ninguna etiqueta heredada | Mismos datos |
| Agenda | Los cuatro seguimientos financieros conectados | Mismos datos |
| Resultados | Ganado 1, Perdido 1, abiertas 4, conversión 50 % | Mismos valores |
| Identificadores e historial | Estado visible igual a lo serializado; evento de carga y seguimiento realizado financiero | Conjunto exactamente igual, sin regeneración |

Además se comprobaron cancelar sin escritura, fallo de cuota sin cambiar datos/estado, reintento correcto y ausencia de los cuatro títulos antiguos, seguimientos de catálogo/inventario y advertencia heredada en el nuevo conjunto.

## Pendiente

La reconstrucción de sesión se verificó en jsdom con lectura real de su localStorage y un Provider nuevo; no equivale a recargar el perfil real de Chrome. Queda pendiente la comprobación directa en el navegador de la usuaria y confirmar la URL que utiliza. Si abre una versión publicada, los cambios locales no la actualizan por sí solos. No se hizo commit, push ni publicación.
