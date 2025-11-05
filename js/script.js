// Declaración de variables
// ====== CONSTANTES DE CONFIGURACIÓN ======
const NAVE_TAMANIO = 30;
const SEPARACION_MIN = 70;
const CANTIDAD_BRUJULAS = 3;
const BONUS_TIEMPO = 3;
const BONUS_MOVIMIENTO = 5;

// ====== CANVAS Y CONTEXTO ======
let canvas, ctx;
let canvasSize;

// ====== NAVE ======
let naveX = 0; 
let naveY = 0; 
let naveImg;
let fondoNave = new Image();
const rastroNave = [];

// ====== IMÁGENES Y RECURSOS ======
let baseImg;
let brujulaImg;
const asteroidesImg = [];
let asteroidesCargados = 0;
const estrellasImg = [];
let estrellasCargadas = 0;

// ====== POSICIONES DE ELEMENTOS ======
const brujulasPosicion = [];
const asteroidesPosicion = [];

// ====== PUNTUACIÓN Y TIEMPO ======
let contadorBrujulas = 0;
let contadorMovimientos = 40;
let tiempo = new Date(15000);
let stop;

// ====== ESTADO DEL JUEGO ======
let juegoIniciado = false;

function canvasStars() {
    canvas = document.getElementById("miCanvas");
    canvasSize = canvas.width;

    ctx = canvas.getContext("2d");

    brujulaImg = new Image();
    brujulaImg.src = "../img/brujula.svg";
    baseImg = new Image();
    baseImg.src = "../img/base.svg";
    naveImg = new Image();
    naveImg.src = "../img/nave.svg";

    poblarEstrellas();
    poblarAsteroides();
}

let fondoListo = false;
let asteroidesListos = false;

function cargarSiListo() {
    if (fondoListo && asteroidesListos) {
        cargarBase();
        cargarBrujulas();
        cargarNave();

        window.addEventListener('keydown', moverNave, true);
    }
}

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

function pintarFondo() {

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.rect(0, 0, canvasSize, canvasSize);
    ctx.closePath();
    ctx.fill();

    for (i = 0; i < 100; i++) {
        const indiceEstrella = Math.floor(Math.random() * 7);
        const estrella = estrellasImg[indiceEstrella];
        const escalaEstrellas = 0.55;
        console.log(estrella);

        const x = Math.random() * canvasSize;
        const y = Math.random() * canvasSize;

        //Pinto un punto blanco en esa posición
        fondoNave = ctx.getImageData(naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO);
        ctx.drawImage(estrella, x, y, estrella.width * escalaEstrellas, estrella.height * escalaEstrellas)
    }

    //Guardo el fondo de detrás de la nave como imagen
    fondoNave = ctx.getImageData(0, 0, 30, 30);

}

function cargarNave() {
    if (naveImg.complete) {
        fondoNave = ctx.getImageData(naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO);
        ctx.drawImage(naveImg, naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO);
    } else {
        naveImg.onload = () => {
            fondoNave = ctx.getImageData(naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO);
            ctx.drawImage(naveImg, naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO);
        }
    }
}

function cargarBase() {
    if (baseImg.complete) {
        ctx.drawImage(baseImg, canvasSize - NAVE_TAMANIO, canvasSize - NAVE_TAMANIO, NAVE_TAMANIO, NAVE_TAMANIO)
    }
    baseImg.onload = () => {
        ctx.drawImage(baseImg, canvasSize - NAVE_TAMANIO, canvasSize - NAVE_TAMANIO, NAVE_TAMANIO, NAVE_TAMANIO);
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
                if (comprobarDistancia(x, y, tamanioAsteriode, pos.x, pos.y, pos.tamanioAsteriode) < SEPARACION_MIN) {
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


    for (let i = 0; i < CANTIDAD_BRUJULAS; i++) {
        let x, y;
        let valido = false;

        while (!valido) {
            x = Math.floor(Math.random() * (canvasSize - brujulaTamanio));
            y = Math.floor(Math.random() * (canvasSize - brujulaTamanio));

            //Evitar la nave (0,0) y la base (570, 570);
            if ((x < 60 && y < 60) || (x > 540 && y > 540)) continue;

            valido = true;

            for (const pos of asteroidesPosicion) {
                if (comprobarDistancia(x, y, brujulaTamanio, pos.x, pos.y, pos.tamanioAsteriode) < SEPARACION_MIN) {
                    valido = false
                    break;
                }
            }

            if (valido) {
                for (const pos of brujulasPosicion) {
                    if (comprobarDistancia(x, y, brujulaTamanio, pos.x, pos.y, pos.brujulaTamanio) < SEPARACION_MIN) {
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
    if(!juegoIniciado){
        juegoIniciado = true;
        temporizador();
    }
    switch (evento.keyCode) {
        case 37:
        case 65:
            restarContador();
            if (naveX === 0) break;
            
            // Borrar la nave actual
            ctx.putImageData(fondoNave, naveX, naveY);
            
            // Borrar todo el rastro anterior
            borrarRastro();
            
            // Añadir posición actual al rastro
            rastroNave.push({x: naveX, y: naveY, edad: 0, fondo: ctx.getImageData(naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO)});
            
            // Mover
            naveX -= 30;
            detectarColision();
            
            // Dibujar rastro actualizado
            dibujarRastro();
            
            // Capturar fondo y dibujar nave
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            ctx.drawImage(naveImg, naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO);
            break;

        case 39:
        case 68:
            restarContador();
            if (naveX === 570) break;
            
            ctx.putImageData(fondoNave, naveX, naveY);
            borrarRastro();
            rastroNave.push({x: naveX, y: naveY, edad: 0, fondo: ctx.getImageData(naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO)});
            naveX += 30;
            detectarColision();
            dibujarRastro();
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            ctx.drawImage(naveImg, naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO);
            break;

        case 38:
        case 87:
            restarContador();
            if (naveY === 0) break;
            
            ctx.putImageData(fondoNave, naveX, naveY);
            borrarRastro();
            rastroNave.push({x: naveX, y: naveY, edad: 0, fondo: ctx.getImageData(naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO)});
            naveY -= 30;
            detectarColision();
            dibujarRastro();
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            ctx.drawImage(naveImg, naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO);
            break;

        case 40:
        case 83:
            restarContador();
            if (naveY === 570) break;
            
            ctx.putImageData(fondoNave, naveX, naveY);
            borrarRastro();
            rastroNave.push({x: naveX, y: naveY, edad: 0, fondo: ctx.getImageData(naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO)});
            naveY += 30;
            detectarColision();
            dibujarRastro();
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            ctx.drawImage(naveImg, naveX, naveY, NAVE_TAMANIO, NAVE_TAMANIO);
            break;
    }
}

function borrarRastro() {
    for (const punto of rastroNave) {
        ctx.putImageData(punto.fondo, punto.x, punto.y);
    }
}

function dibujarRastro() {
    const maxEdad = 3;
    
    for (let i = rastroNave.length - 1; i >= 0; i--) {
        const punto = rastroNave[i];
        punto.edad++;
        
        if (punto.edad >= maxEdad) {
            rastroNave.splice(i, 1);
            continue;
        }
        
        const alpha = 0.5 * (1 - punto.edad / maxEdad);
        ctx.globalAlpha = alpha;
        ctx.drawImage(naveImg, punto.x, punto.y, NAVE_TAMANIO, NAVE_TAMANIO);
    }
    
    ctx.globalAlpha = 1.0;
}

function restarContador() {
    contadorMovimientos--;

    const spanPuntuacion = document.getElementById("puntuacion");
    spanPuntuacion.innerHTML = contadorMovimientos;

    if (contadorMovimientos < 6) {
        spanPuntuacion.style.color = "red";
    } else if (contadorMovimientos < 11) {
        spanPuntuacion.style.color = "orange";
    } else {
        spanPuntuacion.style.color = "#0F0";
    }

    if (contadorMovimientos === 0) {
        const mensaje = "¡Lo siento! Te has quedado sin puntos. \nPincha Aquí para volver a intentarlo."
        finalizar(mensaje);
    }
}

function sumarContador() {
    const spanPuntuacion = document.getElementById("puntuacion");
    contadorMovimientos += BONUS_MOVIMIENTO;
    spanPuntuacion.innerHTML = contadorMovimientos;

    let segundosActuales = tiempo.getSeconds();
    tiempo.setSeconds(segundosActuales + BONUS_TIEMPO);
}

// Detecto las colisiones con las base u otros asteroides
function detectarColision() {
    const pixels = 900; //Porque la imagen es de 30x30 pixels
    const elementos = pixels * 4; //porque cada pixel tiene 4 bytes (RGBA)

    for (let i = 0; i < elementos; i += 4) {

        //Asteroides
        for (const pos of asteroidesPosicion) {
            if (
                naveX < pos.x + NAVE_TAMANIO &&      
                naveX + NAVE_TAMANIO > pos.x &&      
                naveY < pos.y + NAVE_TAMANIO &&      
                naveY + NAVE_TAMANIO > pos.y         
            ) {
                const mensaje = "¡Lo siento! Has chocado con un asteoride. \nPincha AQUÍ para volver a intentarlo.";

                finalizar(mensaje);

                break;
            }
        }

        //Base
        const basePos = canvasSize - NAVE_TAMANIO;

        if (
            naveX < basePos + NAVE_TAMANIO &&
            naveX + NAVE_TAMANIO > basePos &&
            naveY < basePos + NAVE_TAMANIO &&
            naveY + NAVE_TAMANIO > basePos
        ) {
            const mensaje = "¡Enhorabuena! Has llegado a la base. \nPincha AQUÍ para volver a jugar.";
            finalizar(mensaje);
            break;
        }

        //Brujulas
        for (let i = 0; i < brujulasPosicion.length; i++) {
            const pos = brujulasPosicion[i];
            if (
                naveX < pos.x + NAVE_TAMANIO &&
                naveX + NAVE_TAMANIO > pos.x &&
                naveY < pos.y + NAVE_TAMANIO &&
                naveY + NAVE_TAMANIO > pos.y
            ) {
                contarBrujula();
                sumarContador();

                ctx.putImageData(pos.fondo, pos.x, pos.y);

                brujulasPosicion.splice(i, 1);

                return;
            }
        }
    }
}

function contarBrujula() {
    const spanBrujulas = document.getElementById("brujulas");
    contadorBrujulas++;
    spanBrujulas.innerText = `${contadorBrujulas}/${CANTIDAD_BRUJULAS}`
    if (contadorBrujulas === CANTIDAD_BRUJULAS) {
        spanBrujulas.style.color = "#0F0";
    }

}

function temporizador() {
    let ms = tiempo.getMilliseconds() - 500;
    tiempo.setMilliseconds(ms);

    let texto = rellenaCeros(tiempo.getMinutes()) + ":" + rellenaCeros(tiempo.getSeconds());
    const spanTiempo = document.getElementById("tiempo");
    spanTiempo.innerHTML = texto;

    if (tiempo.getSeconds() < 6) {
        spanTiempo.style.color = "red";
    } else if (tiempo.getSeconds() < 11) {
        spanTiempo.style.color = "orange";
    } else {
        spanTiempo.style.color = "#0F0";
    }

    if (tiempo.getSeconds() <= 0) {
        const mensaje = "¡Lo siento! Se ha terminado el tiempo. \nPincha AQUÍ para volver a intentarlo.";
        finalizar(mensaje);
    } else {
        //Loop para que se ejecute cada 500ms
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

function finalizar(mensaje) {
    
    const spanMensaje = document.getElementById("mensaje");
    spanMensaje.innerText = mensaje;

    window.removeEventListener("keydown", moverNave, true);
    clearTimeout(stop);
}

function reiniciar() {
    window.location.reload();
}