# SPACE STARS - VERSIÓN PERSONALIZADA

**Space stars** es un juego desarrollado en `HTML5`, `CSS`y `JavaScrip`. El objetivo es mover una nave desde el punto de salida hasta la base sin chocar con ningún asteroide antes de que se terminen  tanto el tiempo como los movimientos.

Esta versión sigue la plantilla utilizada en el ejercicio propuesto y añade nuevas funcionalidades respecto a la jugabilidad y la estética del mismo. 

## Estructura de archivos
**index.html**
Estructura básica de la página y punto de entrada del juego. Incluye:
- Fuentes personalizadas de *Google fonts*
- Enlace al CSS de estilos.
- Enlace al JavaScript con las funciones del juego.
- Contenedor del panel de información (mensaje, movimiento, tiempo y contador de brújulas).
- Canvas de 600x600 donde se dibujarán los elementos visuales del juego.

**css/style.css**
Estilos gráficos del juego.
- Grid de estilos del panel de información.
- Tipografías para conseguir estilo retro.
- Tiempo iniciado en verde.

**js/script.js**
Contiene la lógica completa del juego:
- Carga y gestión de recursos (nave, base, estrellas, asteroides y brújulas).
- Pintado del fondo y recursos visuales cargados previamente.
- Movimiento de la nave y rastro.
- Detección de colisiones:
    - nave-asteroides
    - nave-base
    - nave-brújulas
- Control de contador de movimientos, temporizador y contador de brújulas recogidas.
- Reinicio y finalización del juego.

## Variaciones visuales
### Imágenes
Se añaden imágenes `SVG` personalizadas para majorar la estética del juego:
- Asteroides
- Estrellas
- Nave
- Brújulas
- Base

### Estilos CSS
- Fuentes:  Audiowide para el titular y Inconsolata para el resto de textos.
- Panel de información a tres columnas utilizando `display: grid`.

## Carga y orden de pintado
Para evitar errores en el pintado del fondo cuando la nave recoge brújulas, se ha orquestado el orden de carga y pintado mediante la bandera **fondoListo** y **asteroidesListos**.

El flujo se establece del siguiente modo:
1. `poblarEstrellas()`: carga 7 SVG. Al terminar llama a la función `pintarFondo()`, establece la bandera `fondoListo = true` y llama a la función `cargarSiListo()`.
2. `poblarAsterodies()`: carga 9 SVG. Al terminar establece la bandera `asteroidesListos = true` y llama a la función `cargarSiListo()`.
3. `cargarSiListo()`: cuando las dos banderas están establecidas como **true**:
    1. cargarBase()
    2. cargarBrujulas()
    3. cargarNave() (caputa `fondoNave`y dibuja la nave)
    4. Activa el `eventListener` del teclado.

## Funciones clave (resumen)

- **Inicio y orquestación**

    1. `canvasStars()`
    Inicializa canvas, contexto, tamaños y arranca la carga de estrellas/asteroides.

    2. cargarSiListo()
    Comprueba `fondoListo` y `asteroidesListos` y, si se cumple, pinta base, brújulas y nave y activa teclado.

- **Fondo y asteroides**

    1. `poblarEstrellas()` / `pintarFondo()`
    Dibuja un fondo negro y 100 estrellas aleatorias (SVG escaladas).

    2. `poblarAsteroides()` / `pintarAsteroides()`
    Genera 25 asteroides con tamaño aleatorio (20–30 px) y separación mínima:

        - Se usa una comprobación por distancia entre centros:
        `comprobarDistancia(x1,y1,t1, x2,y2,t2)` y se establece `distancia >= (t1/2 + t2/2 + margen)`
        para evitar solapes visibles.

- **Ítems (brújulas)**

    1. `cargarBrujulas()`
    Coloca 3 brújulas evitando nave, base y asteroides (mismo criterio de distancia entre centros).
    Al recoger una se hace: +5 movimientos, +3 segundos y se elimina del tablero.

- **Nave, movimiento y rastro**

    1. `cargarNave()`
    Captura el fondo de la casilla de la nave (30×30) y dibuja el svg.

    2. `moverNave(e)`
    - Borra la nave actual con `putImageData(fondoNave, naveX, naveY)`.
    - Gestiona el rastro: se almacena la posición previa con su fondo y se dibuja con alpha decreciente (efecto “ghost”).
    - Actualiza coordenadas (pasos de 30 px), vuelve a capturar fondo y dibuja.
    - Llama a `detectarColision()`.
    - Disminuye el contador con `restarContador()` y actualiza el panel de información.

- **Colisiones**

    1. `detectarColision()`
    Compara los bordes de los rectángulos para comprobar si se tocan dos elementos:
    - Nave vs asteroide (usando el tamaño real `t`).
    - Nave vs base (casilla objetivo).
    - Nave vs brújula (20×20): al colisionar, incrementa contadores, repinta el fondo y elimina la brújula del array.

- **Panel de información y estados**

    1. `restarContador()` / `sumarContador()`
    Actualizan el marcador, cambian el color según umbrales (verde/naranja/rojo) y ajustan el tiempo con el bonus de brújula.
    2. `temporizador()`
    Disminuye el tiempo cada 500 ms y finaliza si llega a 0.
    3. `finalizar(mensaje)`
    Muestra mensaje, desactiva teclado y detiene el temporizador.
    4. `reiniciar()`
    Recarga la página.

## Funcionalidades extra añadidas
- Asteroides con tamaño variable y separación mínima por distancia de centros.
- Brújulas recolectables con doble bonus (+5 movimientos y +3 tiempo).
- Rastro de la nave con desvanecimiento progresivo.
- Orquestación de carga para evitar repintados de fondo erróneo.
- Panel de información ampliado con contador de recogida de brújulas.

## Explicación de código
### Prevención de solapación de asteorides
```
if (comprobarDistancia(x, y, tamanioA, pos.x, pos.y, pos.tamanioA) < SEPARACION_MIN) {
    valido = false;
    break;
}

function comprobarDistancia(x1, y1, t1, x2, y2, t2) {
    const distX = (x1 + t1 / 2) - (x2 + t2 / 2);;
    const distY = (y1 + t1 / 2) - (y2 + t2 / 2);
    return Math.hypot(distX, distY);
}
```
Se comprueba geométricamente la distancia entre los centros de los asteorides y, si no se cumple la distancia mínima establecida, no se realiza el dibujado. De este modo, se evita que se muestren asteroides superpuestos en el canvas.

### Colocación de las brújulas
```
const fondo = ctx.getImageData(x, y, brujulaTamanio, brujulaTamanio);
ctx.drawImage(brujulaImg, x, y, brujulaTamanio, brujulaTamanio);
brujulasPosicion.push({ x, y, brujulaTamanio, fondo });
```

Antes de dibujar las brújulas, se guarda el fondo con estrellas y se introduce en el array `brujulasPosicion()` como parte del objeto, que contiene también las coordenadas en los ejer X e Y y el tamaño de las brújulas.

De este modo, cuando se realice una colisión entre la nave y una brújula, podremos repintar el fondo sin que se vean artefactos extraños.

### Efecto del rastro de la nave
const alpha = 0.5 * (1 - punto.edad / maxEdad);
ctx.globalAlpha = alpha;
ctx.drawImage(naveImg, punto.x, punto.y, NAVE_TAMANIO, NAVE_TAMANIO);
```
const alpha = 0.5 * (1 - punto.edad / maxEdad);
ctx.globalAlpha = alpha;
ctx.drawImage(naveImg, punto.x, punto.y, NAVE_TAMANIO, NAVE_TAMANIO);
ctx.globalAlpha = 1.0;
```

