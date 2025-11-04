// Declaración de variables
let canvas, ctx;
let naveX = 0; //Posición original en x de la nave
let naveY = 0; //Posición original en y de la nave
let nave = new Image(); //Imagen para capturar la nave
let fondoNave = new Image(); //Imagen para capturar el fondo;
let contador = 40; // Contador de movimientos
let tiempo = new Date(15000); //Para tener solo 15 segundos en milisegundos
let stop; //Para parar el temporizador

// Inicio del juego
function canvasStars(){
    //Obtengo el elemento canvas
    canvas = document.getElementById("miCanvas");

    //Especifico el contexto 2D
    ctx = canvas.getContext("2d");

    //Llamo a la función que pinta el fondo de las estrellas
    pintarFondo();

    //Llamo a la función que pinta la nave
    pintarNave();

    //Llamo a la función que pinta la base
    pintarBase();

    //Llamo a la función que pinta los asteroides
    pintarAsteroides();

    //Añado el escuchador del teclado
    window.addEventListener('keydown', moverNave, true);

    //Lamada al temporizador
    temporizador();

}

// Pinto el fondo con estrellas
function pintarFondo(){

    //Pinto el fondo de negro
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.rect(0,0,600,600); // posición x, y, ancho y alto
    ctx.closePath();
    ctx.fill();

    //Pinto 100 estrellas
    for(i= 0; i < 100; i++){
        //Posiciones x e y aleatorias
        const x = Math.random() * 600;
        const y = Math.random() * 600;

        //Pinto un punto blanco en esa posición
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x , y , 3 , 0 , Math.PI * 2); //posición x, y, radio (px), inicio del arco (en grados) fin del arco (en grados)
        ctx.closePath();
        ctx.fill();
    }

    //Guardo el fondo de detrás de la nave como imagen
    fondoNave = ctx.getImageData(0, 0, 30, 30);

}

// Pinto la nave
function pintarNave(){
    ctx.fillStyle = "green";
    ctx.beginPath();
        ctx.rect(0, 0, 30, 30); //esquina superior izquierda, tamaño 30x30
    ctx.closePath();
    ctx.fill();

    //Guardo la nave como imagen
    nave = ctx.getImageData(0, 0, 30, 30);
}

// Pinto la base
function pintarBase(){
    ctx.fillStyle = "blue";
    ctx.beginPath();
        ctx.rect(570, 570, 30, 30); // esquina inferior derecha, tamaño 30x30
    ctx.closePath();
    ctx.fill();
}

// Pintar asteroides
function pintarAsteroides(){
    for(i = 0; i < 30; i++){

        const x = Math.random() * 570;
        const y = Math.random() * 570;

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
        ctx.fillStyle = "red";
        ctx.beginPath();
            ctx.rect(x, y, 20, 20);
        ctx.closePath();
        ctx.fill();
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
            ctx.putImageData(nave, naveX, naveY);
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
            ctx.putImageData(nave, naveX, naveY);
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
            ctx.putImageData(nave, naveX, naveY);
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
            ctx.putImageData(nave, naveX, naveY);
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
        const mensaje = "¡Lo siento! Te has quedado sin puntos. Pincha Aquí para volver a intentarlo."
        finalizar(mensaje);
    }
}

// Detecto las colisiones con las base u otros asteroides
function detectarColision(){
    const pixels = 900; //Porque la imagen es de 30x30 pixels
    const elementos = pixels*4; //porque cada pixel tiene 4 bytes (RGBA)

    //Recorro en busca del rojo (asteroide) o del azul (base)
    for (let i=0; i<elementos; i += 4){

        //Asteroide (255, 0, 0)
        if(fondoNave.data[i] === 255 && fondoNave.data[i+1] === 0 &&fondoNave.data[i+2] === 0 ){
            const mensaje = "¡Lo siento! Has chocado con un asteoride. Pincha AQUÍ para volver a intentarlo.";

            finalizar(mensaje);

            break;
        }

        //Base (0, 0, 255)
        if(fondoNave.data[i] === 0 && fondoNave.data[i+1] === 0 && fondoNave.data[i+2] === 255){
            const mensaje = "¡Enhorabuena! Has llegado a la base. Pincha AQUÍ para volver a jugar.";
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
        const mensaje = "¡Lo siento! Se ha terminado el tiempo. Pincha AQUÍ para volver a intentarlo.";
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
    spanMensaje.innerHTML = mensaje;

    //Bloqueo el movimiento del teclado
    window.removeEventListener("keydown", moverNave, true);
    clearTimeout(stop);
}

// Reinicio el juego
function reiniciar(){
    window.location.reload();
}