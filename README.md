# Órbita — campamento educativo

Juego en español para navegador, teléfono o computadora. Centro y personajes ficticios. No representa a la NASA ni a Space Camp.

Abre `index.html` con doble clic. No necesita servidor, instalación ni conexión. En teléfono, abre el archivo con un navegador que permita HTML local. Solo los enlaces de Fuentes requieren internet.

Al entrar aparece una guía de tres pasos. Antes de cada estación hay un tutorial con objetivo, controles, pasos y una práctica breve. «Cómo jugar» repite la bienvenida y «Ayuda de esta estación» permite consultar los pasos durante la actividad.

Incluye seis días, tres niveles, controles táctiles y de teclado, chequeos previos, botón de malestar sin penalización, 30 preguntas de debrief con explicaciones, siete mitos, clasificador accesible por selección o arrastre, comparador, glosario y diploma imprimible. El día acuático se completa por observación en niveles básicos. El nivel avanzado usa casos y aprobación médica ficticios; no pide datos de salud ni habilita buceo real.

El progreso y el alias se guardan solo en el navegador cuando permite almacenamiento local. En algunos navegadores el almacenamiento de archivos locales no está disponible. «Borrar progreso local» permite reiniciar.

## Controles

- MAT: mantener «Apoyos» en pantalla, o A y P en teclado; seleccionar eje y marcar exhalación. El giro visual es opcional y respeta la preferencia de movimiento reducido.
- Silla lunar: botones mantenidos, flechas para caminar, espacio para saltar y B para frenar.
- 5DF: impulsos breves para trasladarse y controles +/− para las tres velocidades angulares. Un impulso opuesto frena. La vista es superior; la vertical está bloqueada.
- Misión: alternar control y tripulación, repetir, confirmar y ejecutar. Cada ciclo completo otorga 10 puntos de coordinación. No hay penalización por malestar, pausas, observación o intentos.
- Ingeniería: definir, idear, construir, probar, observar y mejorar. La física del ensayo es cualitativa y no predice vuelos reales.

## Pruebas

Dentro del juego: pestaña «Pruebas físicas», 11 verificaciones del modelo utilizado.

Con Node.js 18 o posterior, sin instalar paquetes:

```sh
node --test tests/physics.test.cjs
```

Las pruebas usan la implementación de `index.html`: masa constante con peso aparente 1/6, descarga 5/6, conservación del impulso entre contactos, frenado mediante impulso opuesto, vertical bloqueada y tres rotaciones independientes.

Son modelos educativos ideales. No verifican la ingeniería de un aparato real ni la aptitud de una persona. El 5DF idealiza fricción cero entre contactos; sus coordenadas visuales están normalizadas. La silla lunar idealiza soporte vertical constante; la duración y altura de los saltos no predicen un arnés real.

## Base documental

Contenido basado en el informe proporcionado «Entrenadores y simuladores para jóvenes astronautas», fecha de corte 7 de noviembre de 2026. Las 20 referencias con enlaces originales aparecen en «Fuentes», conservando su numeración. Las siete afirmaciones del quiz corresponden a la sección 11 del informe. No se agregaron referencias inventadas ni se incluyó el documento original en el repositorio.

Los tiempos, recorridos, controles y reglas cualitativas de ensayo son decisiones de diseño del juego. Los programas reales y sus requisitos pueden cambiar; se presentan según el informe.

## Verificación realizada

Se ejecutaron pruebas de sintaxis, física e interacción DOM para las seis estaciones, 30 respuestas de debrief, desbloqueo, parada sin penalización, misión avanzada, clima, revisión médica ficticia, diploma, extras y referencias. La bienvenida del tutorial también se comprobó visualmente en una vista estrecha del navegador local HTTP. La herramienta bloqueó la apertura directa de `file://`; las pruebas DOM sí usan ese esquema. El diseño usa viewport móvil, controles táctiles, navegación por teclado y disposición responsive. Queda pendiente una revisión completa en un teléfono real.
