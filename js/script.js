// Declaración de variables
let canvas, ctx;
let canvasSize;
let naveX = 0; //Posición original en x de la nave
let naveY = 0; //Posición original en y de la nave
let nave = new Image(); //Imagen para capturar la nave
let fondoNave = new Image(); //Imagen para capturar el fondo;
let contador = 40; // Contador de movimientos
let tiempo = new Date(15000); //Para tener solo 15 segundos en milisegundos
let stop; //Para parar el temporizador
const naveTamanio = 30;
let naveImg;
let baseImg;
let brujulaImg;
let asteroidesImg = [];
let asteroidesCargados = 0;
let asteroidesPosicion = [];
let estrellasImg = [];
let estrellasCargadas = 0;
let brujulasPosicion = [];
const separacionMin = 70;

// Inicio del juego
function canvasStars() {
    //Obtengo el elemento canvas
    canvas = document.getElementById("miCanvas");
    canvasSize = canvas.width;

    //Especifico el contexto 2D
    ctx = canvas.getContext("2d");

    brujulaImg = new Image();
    brujulaImg.src = "../img/brujula.svg";
    baseImg = new Image();
    baseImg.src = "../img/base.svg";
    naveImg = new Image();
    naveImg.src = "../img/nave.svg";

    //Llamo a la función que pinta el fondo de las estrellas
    poblarEstrellas();
    poblarAsteroides();
}

let fondoListo = false;
let asteroidesListos = false;

function cargarSiListo() {
    if (fondoListo && asteroidesListos) {
        //Llamo a la función que pinta la nave
        cargarNave();

        //Llamo a la función que pinta la base
        cargarBase();

        //Llamo a la función que pinta las brújulas
        cargarBrujulas();

        //Añado el escuchador del teclado
        window.addEventListener('keydown', moverNave, true);

        //Lamada al temporizador
        temporizador();
    }
}

//Cargo las imagenes de las estrellas en el array
function poblarEstrellas() {
    for (i = 1; i <= 7; i++) {
        const estrella = new Image();
        estrella.src = `../img/estrella${i}.svg`;
        estrella.onload = () => {
            estrellasCargadas++;
            if (estrellasCargadas === 7) {
                pintarFondo();
                fondoListo = true;
                cargarSiListo();
            }
        }
        estrellasImg.push(estrella);
    }
}

// Pinto el fondo con estrellas
function pintarFondo() {

    //Pinto el fondo de negro
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.rect(0, 0, canvasSize, canvasSize); // posición x, y, ancho y alto
    ctx.closePath();
    ctx.fill();

    //Distribuyo 100 estrellas
    for (i = 0; i < 100; i++) {
        const indiceEstrella = Math.floor(Math.random() * 7);
        const estrella = estrellasImg[indiceEstrella];
        const escalaEstrellas = 0.55;
        console.log(estrella);
        //Posiciones x e y aleatorias
        const x = Math.random() * canvasSize;
        const y = Math.random() * canvasSize;

        //Pinto un punto blanco en esa posición
        fondoNave = ctx.getImageData(naveX, naveY, naveTamanio, naveTamanio);
        ctx.drawImage(estrella, x, y, estrella.width * escalaEstrellas, estrella.height * escalaEstrellas)
        //ctx.drawImage(estrella, x , y , Math.PI * 2); //posición x, y, radio (px), inicio del arco (en grados) fin del arco (en grados)
    }

    //Guardo el fondo de detrás de la nave como imagen
    fondoNave = ctx.getImageData(0, 0, 30, 30);

}

function cargarNave() {
    if (naveImg.complete) {
        fondoNave = ctx.getImageData(naveX, naveY, naveTamanio, naveTamanio);
        ctx.drawImage(naveImg, naveX, naveY, naveTamanio, naveTamanio);
    } else {
        naveImg.onload = () => {
            fondoNave = ctx.getImageData(naveX, naveY, naveTamanio, naveTamanio);
            ctx.drawImage(naveImg, naveX, naveY, naveTamanio, naveTamanio);
        }
    }
}

// Pinto la base
function cargarBase() {
    if (baseImg.complete) {
        ctx.drawImage(baseImg, canvasSize - naveTamanio, canvasSize - naveTamanio, naveTamanio, naveTamanio)
    }
    baseImg.onload = () => {
        ctx.drawImage(baseImg, canvasSize - naveTamanio, canvasSize - naveTamanio, naveTamanio, naveTamanio);
    }
}

function poblarAsteroides() {
    for (i = 1; i <= 9; i++) {
        const asteroide = new Image();
        asteroide.src = `../img/asteroide${i}.svg`;

        asteroide.onload = () => {
            asteroidesCargados++;
            if (asteroidesCargados === 9) {
                pintarAsteroides();
                asteroidesListos = true;
                cargarSiListo();
            }
        };

        asteroidesImg.push(asteroide);
    }
}

// Pintar asteroides
function pintarAsteroides() {
    const numeroAsteroides = 25;

    for (i = 0; i < numeroAsteroides; i++) {
        let x, y, tamanioAsteriode;
        let valido = false;

        while (!valido) {
            tamanioAsteriode = Math.random() * (30 - 20) + 20;
            x = Math.random() * (canvasSize - tamanioAsteriode);
            y = Math.random() * (canvasSize - tamanioAsteriode);

            //Evitar la nave (0,0) y la base (570, 570);
            if ((x < 60 && y < 60) || (x > 540 && y > 540)) continue;


            valido = true;
            for (const pos of asteroidesPosicion) {
                if (comprobarDistancia(x, y, tamanioAsteriode, pos.x, pos.y, pos.tamanioAsteriode) < separacionMin) {
                    valido = false
                    break;
                }
            }
        }

        // Pinto el asteroide
        const indiceAsteroide = Math.floor(Math.random() * 9);
        const asteroide = asteroidesImg[indiceAsteroide];
        ctx.drawImage(asteroide, x, y, tamanioAsteriode, tamanioAsteriode);

        asteroidesPosicion.push({ x, y, tamanioAsteriode });
    }
}

function cargarBrujulas() {
    const brujulaTamanio = 20;


    for (let i = 0; i < 3; i++) {
        let x, y;
        let valido = false;

        while (!valido) {
            x = Math.floor(Math.random() * (canvasSize - brujulaTamanio));
            y = Math.floor(Math.random() * (canvasSize - brujulaTamanio));

            //Evitar la nave (0,0) y la base (570, 570);
            if ((x < 60 && y < 60) || (x > 540 && y > 540)) continue;

            valido = true;

            for (const pos of asteroidesPosicion) {
                if (comprobarDistancia(x, y, brujulaTamanio, pos.x, pos.y, pos.tamanioAsteriode) < separacionMin) {
                    valido = false
                    break;
                }
            }

            if (valido) {
                for (const pos of brujulasPosicion) {
                    if (comprobarDistancia(x, y, brujulaTamanio, pos.x, pos.y, pos.brujulaTamanio) < separacionMin) {
                        valido = false
                        break;
                    }
                }
            }
        }

        const fondo = ctx.getImageData(x, y, brujulaTamanio, brujulaTamanio);

        if (brujulaImg.complete) {
            ctx.drawImage(brujulaImg, x, y, brujulaTamanio, brujulaTamanio);
        } else {
            brujulaImg.onload = () => {
                ctx.drawImage(brujulaImg, x, y, brujulaTamanio, brujulaTamanio);
            }
        }

        brujulasPosicion.push({ x, y, brujulaTamanio, fondo });
    }
}

function comprobarDistancia(x1, y1, t1, x2, y2, t2) {
    const distX = (x1 + t1 / 2) - (x2 + t2 / 2);;
    const distY = (y1 + t1 / 2) - (y2 + t2 / 2);
    return Math.hypot(distX, distY);
}

// Muevo la nave
function moverNave(evento) {
    //Detecto la tecla que estoy pulsando
    switch (evento.keyCode) {
        //Izquierda: 37 o 65 (flecha izquierda o letra A)

        case 37:
        case 65:
            //Actualizar el contador
            restarContador();
            //Compruebo si se va a salir por la izquierda
            if (naveX === 0) {
                break;
            }

            //Borro la nave (pintando fondoNave encima)
            ctx.putImageData(fondoNave, naveX, naveY);
            //Actualizo la x
            naveX -= 30;
            //Compruebo la colisión
            detectarColision();

            //Capturo el fondo que voy a tapar
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            //Muevo la nave
            ctx.drawImage(naveImg, naveX, naveY, naveTamanio, naveTamanio);
            
            break;

        //Derecha: 39 o 68 (flecha derecha o letra D)
        case 39:
        case 68:
            //Actualizar el contador
            restarContador();
            //Compruebo si se va a salir por la derecha
            if (naveX === 570) {
                break;
            }
            //Borro la nave (pintando fondoNave encima)
            ctx.putImageData(fondoNave, naveX, naveY);
            //Actualizo la x
            naveX += 30;
            //Compruebo la colisión
            detectarColision();
            //Capturo el fondo que voy a tapar
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            //Muevo la nave
            ctx.drawImage(naveImg, naveX, naveY, naveTamanio, naveTamanio);
            break;

        //Arriba: 38 o 87 (flecha arriba o letra W)
        case 38:
        case 87:
            //Actualizar el contador
            restarContador();
            //Compruebo si se va a salir por arriba
            if (naveY === 0) {
                break;
            }
            //Borro la nave (pintando fondoNave encima)
            ctx.putImageData(fondoNave, naveX, naveY);
            //Actualizo la y
            naveY -= 30;
            //Compruebo la colisión
            detectarColision();
            //Capturo el fondo que voy a tapar
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            //Muevo la nave
            ctx.drawImage(naveImg, naveX, naveY, naveTamanio, naveTamanio);
            break;

        //Abajo: 40 o 83 (fle3cha abajo o letra S)
        case 40:
        case 83:
            //Actualizar el contador
            restarContador();
            //Compruebo si se va a salir por abajo
            if (naveY === 570) {
                break;
            }
            //Borro la nave (pintando fondoNave encima)
            ctx.putImageData(fondoNave, naveX, naveY);
            //Actualizo la y
            naveY += 30;
            //Compruebo la colisión
            detectarColision();
            //Capturo el fondo que voy a tapar
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            //Muevo la nave
            ctx.drawImage(naveImg, naveX, naveY, naveTamanio, naveTamanio);
            break;
    }
}

//Actualizo el contador y detecto si se ha quedado sin movimientos
function restarContador() {
    //Decremento en cada movimiento
    contador--;

    const spanPuntuacion = document.getElementById("puntuacion");

    //Actualizo el contador
    spanPuntuacion.innerHTML = contador;

    //Compruebo el valor para cambiar el color del texto
    if (contador < 6) {
        spanPuntuacion.style.color = "red";
    } else if (contador < 11) {
        spanPuntuacion.style.color = "orange";
    } else {
        spanPuntuacion.style.color = "#0F0";
    }

    // Compruebo si se ha quedado sin puntos
    if (contador === 0) {
        const mensaje = "¡Lo siento! Te has quedado sin puntos. \nPincha Aquí para volver a intentarlo."
        finalizar(mensaje);
    }
}

function sumarContador() {
    const spanPuntuacion = document.getElementById("puntuacion");

    contador += 5;
    //Actualizo el contador
    spanPuntuacion.innerHTML = contador;
}

// Detecto las colisiones con las base u otros asteroides
function detectarColision() {
    const pixels = 900; //Porque la imagen es de 30x30 pixels
    const elementos = pixels * 4; //porque cada pixel tiene 4 bytes (RGBA)

    //Recorro en busca del rojo (asteroide) o del azul (base)
    for (let i = 0; i < elementos; i += 4) {

        //Asteroides
        for (const pos of asteroidesPosicion) {
            if (
                naveX < pos.x + naveTamanio &&      // el borde derecho de la nave pasa del borde izquierdo del asteroide
                naveX + naveTamanio > pos.x &&      // el borde izquierdo de la nave está antes del borde derecho del asteroide
                naveY < pos.y + naveTamanio &&      // el borde inferior de la nave pasa del borde superior del asteroide
                naveY + naveTamanio > pos.y         // el borde superior de la nave está antes del borde inferior del asperiode
            ) {
                const mensaje = "¡Lo siento! Has chocado con un asteoride. \nPincha AQUÍ para volver a intentarlo.";

                finalizar(mensaje);

                break;
            }
        }

        //Base
        const basePos = canvasSize - naveTamanio;

        if (
            naveX < basePos + naveTamanio &&
            naveX + naveTamanio > basePos &&
            naveY < basePos + naveTamanio &&
            naveY + naveTamanio > basePos
        ) {
            const mensaje = "¡Enhorabuena! Has llegado a la base. \nPincha AQUÍ para volver a jugar.";
            finalizar(mensaje);
            break;
        }

        //Brujulas
        for (let i = 0; i < brujulasPosicion.length; i++) {
            const pos = brujulasPosicion[i];
            if (
                naveX < pos.x + naveTamanio &&
                naveX + naveTamanio > pos.x &&
                naveY < pos.y + naveTamanio &&
                naveY + naveTamanio > pos.y
            ) {
                sumarContador();
                // 2. Borrar la brújula (restaurar el fondo de 20x20 donde estaba la brújula)
                ctx.putImageData(pos.fondo, pos.x, pos.y);

                brujulasPosicion.splice(i, 1);

                return;
            }
        }
    }
}

function temporizador() {
    //Decremento 500 milisegundos
    let ms = tiempo.getMilliseconds() - 500;
    tiempo.setMilliseconds(ms);

    //Muestro la nueva fecha
    let texto = rellenaCeros(tiempo.getMinutes()) + ":" + rellenaCeros(tiempo.getSeconds());
    const spanTiempo = document.getElementById("tiempo");
    spanTiempo.innerHTML = texto;

    //Comprueba el valor para cambiar el color del texto
    if (tiempo.getSeconds() < 6) {
        spanTiempo.style.color = "red";
    } else if (tiempo.getSeconds() < 11) {
        spanTiempo.style.color = "orange";
    } else {
        spanTiempo.style.color = "#0F0";
    }

    //Compruebo si llega a 0 para finalizar el juego o continuar
    if (tiempo.getSeconds() <= 0) {
        const mensaje = "¡Lo siento! Se ha terminado el tiempo. \nPincha AQUÍ para volver a intentarlo.";
        finalizar(mensaje);
    } else {
        //Hago un loop para que se ejecute cada 500ms
        stop = setTimeout(temporizador, 500);
    }
}

function rellenaCeros(numero) {
    if (numero < 10) {
        return "0" + numero;
    } else {
        return numero;
    }
}

// Finalizo el juego
function finalizar(mensaje) {
    //Capturo el elemento en el que voy a escribir
    const spanMensaje = document.getElementById("mensaje");

    //Escribo el mensaje en ese elemento
    spanMensaje.innerText = mensaje;

    //Bloqueo el movimiento del teclado
    window.removeEventListener("keydown", moverNave, true);
    clearTimeout(stop);
}

// Reinicio el juego
function reiniciar() {
    window.location.reload();
}