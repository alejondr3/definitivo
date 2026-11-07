<p align="center"><img src="assets/portada.svg" alt="Órbita: menos mirar, más explorar. Campamento educativo ficticio." width="100%"></p>

<p align="center"><strong>Un giro. Un salto. Un problema por resolver.</strong><br>Seis días para descubrir ciencia con las manos en los controles.</p>

<p align="center"><a href="#juega-en-tu-navegador">Empezar a jugar</a> · <a href="#míralo-en-movimiento">Ver el juego</a> · <a href="#seis-retos-una-bitácora">Explorar los retos</a> · <a href="#la-ciencia-se-comprueba">Pruebas de física</a></p>

---

## Juega en tu navegador

**Descarga [index.html](https://github.com/alejondr3/definitivo/raw/refs/heads/main/index.html), ábrelo con doble clic y entra al campamento.**

Sin instalar paquetes. Sin cuenta. Sin servidor. Sin conexión para jugar. Todas las ilustraciones, estilos y funciones del juego están dentro de ese único archivo. En teléfono, abre el archivo con un navegador que permita HTML local. Los enlaces de la bibliografía sí necesitan internet.

La primera vez aparece una guía breve. Antes de cada reto puedes practicar una decisión; durante la actividad, una pista indica tu siguiente paso. No hace falta saber de naves para empezar.

> **Tu misión es aprender.** Órbita es un centro ficticio. Participas en un campamento educativo; el diploma final no es una certificación de vuelo.

## Míralo en movimiento

<p align="center"><img src="assets/orbita-en-movimiento.gif" alt="Animación de las escenas del juego: anillos MAT, salto con arnés, trayectoria 5DF y ensayo del cohete virtual." width="720"></p>

El GIF se renderizó con las mismas funciones canvas del juego. Muestra modelos educativos idealizados, no prestaciones de aparatos reales.

<details><summary><strong>Ver capturas del campamento y del primer reto</strong></summary>

![Mapa del campamento con ilustración original, progreso y acceso a los retos](assets/campamento.png)

![Escena MAT con eje destacado, apoyos y guía de respiración](assets/reto-mat.png)

</details>

## Seis retos, una bitácora

| Día | Entra en acción | Descubre |
| :-- | :-- | :-- |
| **01 · MAT** | Mantén los apoyos, reconoce el eje destacado y sigue el círculo de respiración. | Cabeceo, alabeo y guiñada. Atender instrucciones no equivale a pilotar una nave. |
| **02 · Silla lunar** | Salta, mira tu estela y frena dentro de la baliza. | El peso aparente baja a un sexto; la masa y la inercia siguen iguales. |
| **03 · 5DF** | Da impulsos, sigue tu trayectoria, ajusta una pieza y regresa. | Un impulso inicia el movimiento y otro lo cambia. La vertical está bloqueada. |
| **04 · Equipo** | Alterna roles, alinea una señal y encuentra un indicador que contradice al registro. | Emitir, repetir, confirmar y ejecutar: comunicación cerrada. |
| **05 · Ingeniería** | Edita las aletas con deslizadores, observa un ensayo animado y vuelve a probar. | Definir → idear → construir → probar → observar → mejorar. |
| **06 · Agua** | Compara dos movimientos tras el mismo impulso, con y sin arrastre. | El agua frena. Un entrenador acuático no equivale a una caminata espacial. |

Las señales, registros y reglas del cohete son rompecabezas del juego, no procedimientos operativos ni modelos de vuelo validados.

### Lo que acompaña a la aventura

- **Objetivos que responden:** pasos visibles y pistas que cambian con tu situación.
- **Una bitácora propia:** seis insignias educativas y 25 puntos de aprendizaje por cada día cerrado. No se premia tolerar malestar ni se compara la aptitud de jugadores.
- **Tres niveles:** Campamento (9+), Academia y Academia Avanzada. El avanzado amplía la misión y habilita la escena acuática con aprobación médica ficticia.
- **Sonido a tu elección:** señales suaves, apagadas al comenzar.
- **Movimiento regulable:** ilustraciones animadas y un modo reducido; se respeta la preferencia del sistema.
- **Más para explorar:** siete mitos del informe, clasificador por arrastre o selección, comparador profesional, glosario y 30 preguntas con explicación.
- **Un cierre para recordar:** diploma educativo imprimible al cerrar las seis reflexiones, jugando o como observador.

## Controles que se aprenden jugando

| Actividad | Teléfono / pantalla | Teclado |
| :-- | :-- | :-- |
| MAT | Un dedo mantiene **Apoyos**; otro toca eje y exhalación. | Mantener **A + P** y elegir los botones. |
| Silla lunar | Mantener caminar o frenar; tocar saltar. | **← →**, **espacio**, **B**. |
| 5DF | Un toque por impulso; el opuesto contrarresta. **+ / −** cambian el giro. | Flechas: un impulso por pulsación. |
| Misión e ingeniería | Tocar, elegir y deslizar según la pista. | Tabulador, Enter y controles nativos. |

**¿Te pasaste de la baliza?** Frena y vuelve a probar. **¿No quieres usar un aparato?** Continúa como observador. No hay penalización por intentos, observación o malestar.

## Ciencia con límites claros

Cada estación dice qué representa y qué deja fuera: no reproduce vacío, radiación, microgravedad prolongada ni dinámica completa de una nave.

El MAT es una demostración inspirada, no una copia del MASTIF ni un control de nave. La silla lunar descarga peso, no masa. El 5DF reduce fricción, pero la gravedad terrestre sigue actuando. El agua añade arrastre. Los ensayos de ingeniería son cualitativos y no predicen un lanzamiento real.

Antes de cada aparato hay una revisión educativa del técnico y del operador certificado. **Avisar malestar** permanece visible: detiene la actividad sin quitar puntos. La escena acuática usa personajes ficticios; no pide información de salud ni autoriza buceo real. En niveles básicos se completa mediante observación.

En el caso real, Space Camp lo opera el U.S. Space and Rocket Center en Huntsville, centro oficial de visitantes de NASA Marshall, **pero no parte de la NASA**. Órbita no representa a esas entidades ni utiliza sus logos.

## La ciencia se comprueba

En el juego, abre **Pruebas físicas** para ejecutar 11 verificaciones. Con Node.js 18 o posterior, sin instalar dependencias:

```sh
node --test tests/physics.test.cjs
```

Para ejecutar también las pruebas de interacción (requieren instalar la dependencia de desarrollo `jsdom`):

```sh
npm ci
npm run test:interaction
```

Los 10 casos externos ejecutan la implementación de `index.html`: masa constante, peso aparente 1/6, descarga 5/6, conservación de cantidad de movimiento, impulso opuesto, tres rotaciones y vertical bloqueada.

Se verificó el recorrido completo mediante pruebas DOM: tutoriales, seis estaciones, 30 respuestas, desbloqueos, parada, misión avanzada, señal y discrepancia, ensayo y mejora, revisión médica ficticia, diploma y extras. Se inspeccionaron la portada y el MAT en escritorio y en una vista móvil de 390 px, sin desbordamiento horizontal. Esto comprueba el software educativo; no valida equipos reales ni la aptitud de una persona. La prueba física en un teléfono real sigue pendiente.

<details><summary><strong>Usar una dirección local opcional</strong></summary>

El juego funciona con doble clic. Si prefieres una URL local y tienes Python instalado:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8765/`. Este servidor solo sirve el archivo; el juego no tiene backend.

</details>

## Arte y fuentes

La dirección visual combina consola verde, ilustración vectorial y sprites dibujados en código. **El arte incluido no usa imágenes de modelos generativos de imagen ni material de bancos de imágenes.** La portada, las seis ilustraciones y las escenas se construyen con SVG/canvas propios. Los archivos de `assets/` presentan el repositorio; el juego no necesita descargarlos.

El contenido histórico, los límites y las condiciones siguen el informe proporcionado **«Entrenadores y simuladores para jóvenes astronautas»**, con fecha de corte **7 de noviembre de 2026**. Sus **20 referencias con enlaces originales** están en Fuentes. Las siete afirmaciones del quiz corresponden a la sección 11 del informe. Los programas reales pueden cambiar; se presentan según esa base documental.

El progreso, las preferencias y el alias se guardan solo en el navegador cuando lo permite. No se envían a servidores. **Reiniciar aventura** borra el progreso local.

---

<p align="center"><strong>Observa. Prueba. Vuelve a intentarlo.</strong><br><sub>La curiosidad sí tiene lugar en la consola.</sub></p>
