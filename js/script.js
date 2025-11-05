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
let asteroidesImg = [];
let asteroidesCargados = 0;
let asteroidesPosicion = [];
let estrellasImg = [];
let estrellasCargadas = 0;

// Inicio del juego
function canvasStars(){
    //Obtengo el elemento canvas
    canvas = document.getElementById("miCanvas");
    canvasSize = canvas.width;

    //Especifico el contexto 2D
    ctx = canvas.getContext("2d");

    //Llamo a la función que pinta el fondo de las estrellas
    poblarEstrellas();

    //Llamo a la función que pinta la nave
    cargarNave();

    //Llamo a la función que pinta la base
    pintarBase();

    //Llamo a la función que pinta los asteroides
    poblarArrayAsteroides();

    //Añado el escuchador del teclado
    window.addEventListener('keydown', moverNave, true);

    //Lamada al temporizador
    temporizador();

}

//Cargo las imagenes de las estrellas en el array
function poblarEstrellas(){
    for (i = 1; i <= 7; i++){
        const estrella = new Image();
        estrella.src = `../img/estrella${i}.svg`;
        estrella.onload = () => {
            estrellasCargadas++;
            if(estrellasCargadas === 7) pintarFondo();
        }
        estrellasImg.push(estrella);
    }
}

// Pinto el fondo con estrellas
function pintarFondo(){

    //Pinto el fondo de negro
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.rect(0,0,canvasSize,canvasSize); // posición x, y, ancho y alto
    ctx.closePath();
    ctx.fill();

    //Pinto 100 estrellas
    for(i= 0; i < 100; i++){
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

function cargarNave(){
    naveImg = new Image();
    naveImg.src = "../img/nave.svg";
    naveImg.onload = () => {
        fondoNave = ctx.getImageData(naveX, naveY, naveTamanio, naveTamanio);
        ctx.drawImage(naveImg, naveX, naveY, naveTamanio, naveTamanio);
    }
}

// Pinto la base
function pintarBase(){
    baseImg = new Image();
    baseImg.src = "../img/base.svg";
    baseImg.onload = () => {
        ctx.drawImage(baseImg, canvasSize - naveTamanio, canvasSize - naveTamanio, naveTamanio, naveTamanio);
    }
}

function poblarArrayAsteroides(){
    for(i= 1 ; i <= 9; i++){
        const asteroide = new Image();
        asteroide.src = `../img/asteroide${i}.svg`;

        asteroide.onload = () =>  {
            asteroidesCargados++;
            if(asteroidesCargados === 9) {
                pintarAsteroides();
            }
        };

        asteroidesImg.push(asteroide);
    }
}

// Pintar asteroides
function pintarAsteroides(){
    asteroidesPosicion = [];
    for(i = 0; i < 30; i++){

        let x = Math.random() * 570;
        let y = Math.random() * 570;
        const indiceAsteroide = Math.floor(Math.random() * 9);

        // Comprouebo que no hay asteroirdes en la nave
        if (x < 30 && y < 30){
            x += 30;
            y += 30;
        }

        // Compruebo que no hay asteroides en la base
        if( x > 540 && y > 540){
            x -= 30;
            y -= 30;
        }

        // Pinto el asteroide
        const asteroide = asteroidesImg[indiceAsteroide];
        ctx.drawImage(asteroide, x, y, naveTamanio, naveTamanio);

        asteroidesPosicion.push({x, y});
    }
}

// Muevo la nave
function moverNave(evento){
    //Detecto la tecla que estoy pulsando
    switch(evento.keyCode){
        //Izquierda: 37 o 65 (flecha izquierda o letra A)

        case 37:
        case 65:
            //Actualizar el contador
            actualizarContador();
            //Compruebo si se va a salir por la izquierda
            if(naveX === 0){
                break;
            }

            //Borro la nave (pintando fondoNave encima)
            ctx.putImageData(fondoNave, naveX, naveY);
            //Actualizo la x
            naveX -= 30;
            //Capturo el fondo que voy a tapar
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            //Muevo la nave
            ctx.drawImage(naveImg, naveX, naveY, naveTamanio, naveTamanio);
            //Compruebo la colisión
            detectarColision();
            break;

         //Derecha: 39 o 68 (flecha derecha o letra D)
        case 39:
        case 68:
            //Actualizar el contador
            actualizarContador();
            //Compruebo si se va a salir por la derecha
            if (naveX === 570){
                break;
            }
            //Borro la nave (pintando fondoNave encima)
            ctx.putImageData(fondoNave, naveX, naveY);
            //Actualizo la x
            naveX += 30;
            //Capturo el fondo que voy a tapar
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            //Muevo la nave
            ctx.drawImage(naveImg, naveX, naveY, naveTamanio, naveTamanio);
            //Compruebo la colisión
            detectarColision();
            break;

        //Arriba: 38 o 87 (flecha arriba o letra W)
        case 38:
        case 87:
            //Actualizar el contador
            actualizarContador();
            //Compruebo si se va a salir por arriba
            if (naveY===0){
                break;
            }
            //Borro la nave (pintando fondoNave encima)
            ctx.putImageData(fondoNave, naveX, naveY);
            //Actualizo la y
            naveY -= 30;
            //Capturo el fondo que voy a tapar
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            //Muevo la nave
            ctx.drawImage(naveImg, naveX, naveY, naveTamanio, naveTamanio);
            //Compruebo la colisión
            detectarColision();
            break;

        //Abajo: 40 o 83 (fle3cha abajo o letra S)
        case 40:
        case 83:
            //Actualizar el contador
            actualizarContador();
            //Compruebo si se va a salir por abajo
            if (naveY === 570){
                break;
            }
            //Borro la nave (pintando fondoNave encima)
            ctx.putImageData(fondoNave, naveX, naveY);
            //Actualizo la y
            naveY += 30;
            //Capturo el fondo que voy a tapar
            fondoNave = ctx.getImageData(naveX, naveY, 30, 30);
            //Muevo la nave
            ctx.drawImage(naveImg, naveX, naveY, naveTamanio, naveTamanio);
            //Compruebo la colisión
            detectarColision();
            break;
    }
}

//Actualizo el contador y detecto si se ha quedado sin movimientos
function actualizarContador(){
    //Decremento en cada movimiento
    contador--;

    //Capturo el elemento en el que escribir la puntuación
    const spanPuntuacion = document.getElementById("puntuacion");

    //Actualizo el contador
    spanPuntuacion.innerHTML = contador;

    //Compruebo el valor para cambiar el color del texto
    if (contador < 6){
        spanPuntuacion.style.color = "red";
    } else if (contador < 11){
        spanPuntuacion.style.color = "orange";
    } else{
        spanPuntuacion.style.color = "#0F0";
    }

    // Compruebo si se ha quedado sin puntos
    if (contador === 0){
        const mensaje = "¡Lo siento! Te has quedado sin puntos. \nPincha Aquí para volver a intentarlo."
        finalizar(mensaje);
    }
}

// Detecto las colisiones con las base u otros asteroides
function detectarColision(){
    const pixels = 900; //Porque la imagen es de 30x30 pixels
    const elementos = pixels*4; //porque cada pixel tiene 4 bytes (RGBA)

    //Recorro en busca del rojo (asteroide) o del azul (base)
    for (let i=0; i<elementos; i += 4){

        //Asteroides
        for(const pos of asteroidesPosicion){
            if(
                naveX < pos.x + naveTamanio &&      // el borde derecho de la nave pasa del borde izquierdo del asteroide
                naveX + naveTamanio > pos.x &&      // el borde izquierdo de la nave está antes del borde derecho del asteroide
                naveY < pos.y + naveTamanio &&      // el borde inferior de la nave pasa del borde superior del asteroide
                naveY + naveTamanio > pos.y
            ){
                const mensaje = "¡Lo siento! Has chocado con un asteoride. \nPincha AQUÍ para volver a intentarlo.";

            finalizar(mensaje);

            break;
            }
        }

        //Base
        const basePos = canvasSize - naveTamanio;

        if(
            naveX < basePos + naveTamanio &&
            naveX + naveTamanio > basePos &&
            naveY < basePos + naveTamanio &&
            naveY + naveTamanio > basePos
        ){
            const mensaje = "¡Enhorabuena! Has llegado a la base. \nPincha AQUÍ para volver a jugar.";
            finalizar(mensaje);
            break;
        } 
    }
}

function temporizador(){
    //Decremento 500 milisegundos
    let ms = tiempo.getMilliseconds() - 500;
    tiempo.setMilliseconds(ms);

    //Muestro la nueva fecha
    let texto = rellenaCeros(tiempo.getMinutes()) + ":" + rellenaCeros(tiempo.getSeconds());
    const spanTiempo = document.getElementById("tiempo");
    spanTiempo.innerHTML = texto;

    //Comprueba el valor para cambiar el color del texto
    if(tiempo.getSeconds() < 6){
        spanTiempo.style.color = "red";
    } else if (tiempo.getSeconds() < 11) {
        spanTiempo.style.color = "orange";
    } else {
        spanTiempo.style.color = "#0F0";
    }

    //Compruebo si llega a 0 para finalizar el juego o continuar
    if(tiempo.getSeconds() <= 0){
        const mensaje = "¡Lo siento! Se ha terminado el tiempo. \nPincha AQUÍ para volver a intentarlo.";
        finalizar(mensaje);
    } else {
        //Hago un loop para que se ejecute cada 500ms
        stop = setTimeout(temporizador, 500);
    }
}

function rellenaCeros(numero){
    if(numero < 10){
        return "0" +  numero;
    } else {
        return numero;
    }
}

// Finalizo el juego
function finalizar(mensaje){
    //Capturo el elemento en el que voy a escribir
    const spanMensaje = document.getElementById("mensaje");

    //Escribo el mensaje en ese elemento
    spanMensaje.innerText = mensaje;

    //Bloqueo el movimiento del teclado
    window.removeEventListener("keydown", moverNave, true);
    clearTimeout(stop);
}

// Reinicio el juego
function reiniciar(){
    window.location.reload();
}