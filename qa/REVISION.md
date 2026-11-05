# Revisión de la segunda versión

## Ampliación: producción de contenidos

- Corregido el solapamiento de «Un proceso»: descripción y dato ahora fluyen dentro de un mismo contenedor, sin coordenadas verticales independientes.
- Sustituido el trazo de proceso por cuatro conexiones independientes que llegan a cada nodo, incluido Revisión; se dibujan por etapas.
- Agregados tres destinos después del proceso: producción de preguntas, contenido conceptual y recursos visuales. Cada uno anima una pieza a través de cuatro estaciones, dibuja sus anillos de avance, muestra la aprobación y despliega su mosaico con contador.
- Cifras conservadas de la propuesta: 395 preguntas, 315 pantallas conceptuales y 240 recursos visuales. No se usa la cifra de ejemplo de más de 500 preguntas.
- `check-production.js`: aprobado en 1366 × 768, 1879 × 1047 y 1920 × 1080. Separación entre descripción y dato: 24 px. Las cuatro conexiones terminan dibujadas y la última alcanza el centro de Revisión. Contadores y cantidades de piezas coinciden; repetición de la animación validada.
- `check-atlas.js`: actualizado a 20 destinos y aprobado; cero errores de navegador detectados.
- `check-hovers.js`: aprobado; se mantienen los hovers visuales sin tooltips.
- Nuevas escenas revisadas en 390 × 844 y 1366 × 768; todos los diagramas de producción caben verticalmente en su área. Se compactó el mosaico para no invadir las migas de navegación.
- Capturas nuevas: `process-fixed-large.png`, `production-final-1366.png` y `production-final-390.png`.

## Ampliación: guía PDF y capacitación

- Agregados dos destinos después de los gráficos de producción: creación de guía de estudio PDF y capacitación presencial en Temuco.
- La guía visualiza selección de contenidos, síntesis y redacción, diseño editorial, validación, exportación, optimización, carga y comprobación de descarga.
- La capacitación distingue estudiantes y profesores; cubre acceso, navegación, evaluaciones, progreso y soporte. Se comunica el alcance de hasta 2 instancias por semestre indicado en la propuesta.
- La continuidad del campus se desplazó después de estos nuevos momentos para mantener un viaje de cámara progresivo, sin regresar por el mundo visual.
- `check-guides-training.js`: valida la animación completa, repetición, trazado, posición de documentos, marcador de Temuco, públicos, temas, movimiento reducido y encuadres 1920 × 1080 / 390 × 844.

## Cambios de enfoque

- Se sustituyeron las escenas independientes y sus entradas por una sola línea de tiempo espacial y reversible.
- Se eliminaron importes, comparaciones anuales y secciones de negociación. La conversación se centra en descubrir la estructura y construirla con la escuela.
- Se incorporaron skills oficiales de GSAP y una copia local de la biblioteca.

## Problemas encontrados y corregidos

1. **Destinos al explorar la línea temporal:** los saltos de GSAP suprimían callbacks de cámara. Se explicitó la sincronización al buscar un destino y se usa una transformación SVG directa de cámara.
2. **Pivotes de SVG:** el origen relativo desplazaba los objetos al escalarlos. Se cambió al origen global del mundo.
3. **Encuadres:** los contenedores padre quedaban cortados en módulos y pantallas. Se ajustaron los centros de cámara y se verificaron los objetos principales en los destinos.
4. **Interferencia de la apertura:** una animación independiente podía sobrescribir visibilidad del atlas al avanzar rápidamente. Se aisló la apertura en su propio grupo y se cancela al navegar.
5. **Teléfono móvil:** el contenido HTML y el teléfono SVG tenían escalas independientes. Ahora comparten el factor de escala del atlas y se verifica su encaje tras responder.
6. **Etiquetas durante viajes largos:** se fijan en su destino antes de aparecer, para evitar que crucen el texto de la presentación.
7. **Vacíos en los viajes:** las entradas de objetos de los planos amplios comparten la curva y duración de desplazamiento de cámara; las apariencias se secuencian por separado.

## Pruebas realizadas

- `node --check presentation.js`: sin errores.
- Suite reutilizable `qa/check-atlas.js` mediante Playwright: **aprobada**.
- 20 destinos en 1366 × 768: sin desbordamiento horizontal ni colisión entre texto y pie; controles inferiores visibles.
- 20 destinos en 390 × 844: sin desbordamiento horizontal; pregunta y retroalimentación dentro del teléfono.
- Portada y encuadres revisados también en 1440 × 900.
- Conteo del gráfico: exactamente **710** pantallas; al reorganizar la evaluación quedan exactamente **395**.
- Reversibilidad de posiciones después de saltar entre destinos.
- Navegación por botones y teclado, pausa y continuación, exploración hasta el final, notas y cierre con Escape.
- Movimiento reducido: salto al destino sin cámara en movimiento.
- Exploración de la línea temporal completa a intervalos de 0,25 s: sin muestras vacías según intersección de los objetos visibles con el encuadre. Es una comprobación geométrica, no una medición de fluidez en hardware real.
- Cero errores de ejecución detectados en el navegador durante la suite.
- Búsqueda en HTML, CSS y JS activos: sin importes, CLP, mensualidades o frases de confrontación anual.

Capturas de referencia: `atlas-portada.png`, `atlas-*.png`, `final-*.png`. Algunas capturas tempranas se conservan como evidencia de los encuadres previos a la corrección. La fuente vigente es la presentación, no esas capturas históricas.

No se midió FPS en un teléfono físico. La prueba móvil fue una emulación de tamaño de ventana; se recomienda una última prueba en el equipo y pantalla que se usarán durante la reunión.
