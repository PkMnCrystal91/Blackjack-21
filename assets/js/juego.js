// Patron Modulo. Tambien es una funcion anonima autoinvocada. Crea un Scope de referencia sin nombre/anonima, lo cual hace que no sea posible llamar objetos dentro de el directamente desde consola
(() => {
    'use strict'
    //Variables globales declaradas pueden acceder a cualquier funcion

    let deck         = [];
    const tipos      = ['C','D','H','S'],
          especiales = ['A','J','Q','K'];

    let puntosJugadores = [];

    //Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo = document.querySelector('#btnNuevo');
    // Para pedir cartas
    const divCartasJugadores = document.querySelectorAll('.divCartas'),
    // Para agregar los puntos al jugador/computadora en el small
          puntosHTML = document.querySelectorAll('small');

    // Esta funcion inicializa el juego
    const inicializarJuego = ( numJugadores = 2) => {
        deck = crearDeck();

        puntosJugadores = [];
        for( let i = 0; i< numJugadores; i++ ) {
            puntosJugadores.push(0);
        }
        
        puntosHTML.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach( elem => elem.innerHTML = '' );

        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    }

    // esta funcion crea un nuevo deck
    const crearDeck = () =>  {

        //reiniciando el deck con deck = [];
        deck = [];
        // En este for insertaremos el array de tipos de cartas
        for ( let i = 2; i <= 10; i++){
            // Este for recorre las tipos de cartas del 1 al 10
            for ( let tipo of tipos){
                deck.push( i + tipo);
            }
        }

        // Insertando a la funcion las cartas especiales dentro del ciclo for 
        for ( let tipo of tipos ){
            for ( let esp of especiales ){
                deck.push( esp + tipo);
            }
        }
        // debemos instalar una third party library de underscore.js para poder obtener la funcion de barajeo de cartas _.shuffle. La libreria la metemos en un archivo JS y luego solo la invocamos por medio de _.shuffle
       
        return _.shuffle(deck);
    }


    //Esta funcion me permite tomar una nueva carta
    const pedirCarta = () => {
        if ( deck.length === 0 ) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    //Pidiendo cartas para mostrar error
    /* for ( let i = 0; i <=60; i++)
    {
        pedirCarta();
    } */

    // Obteniendo valores de las cartas 
    const valorCarta = ( carta ) => {

        const valor = carta.substring(0, carta.length - 1);
        return (isNaN( valor )) ?
                ( valor === 'A' ) ? 11 : 10
                : valor * 1;

        // Otra opcion de hacerlo   
    /*  if ( isNaN ( valor)){
            //console.log('No es un numero');
            puntos = ( valor === 'A' ) ? 11 : 10;

        }else{
            //console.log('Es un numero');
            // El valor se multiplica por uno para poder convertir el string a valor numeral
            puntos = valor * 1;
        } */    
    }


    //Nota: si el valor numeral de la carta al retornarlo en la consola se regresa color gris es porque aun se esta reconociendo como un string

    // Turno: 0 = primer jugador y el ultimo sera la computadora
    const acumularPuntos = ( carta, turno ) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = ( carta, turno ) => {

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${ carta }.png`; //3H, JD
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append( imgCarta );

    }

    // Turno de la computadora
    const turnoComputadora = ( puntosMinimos ) => {
        
        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1 );
            crearCarta(carta, puntosJugadores.length - 1 );

        } while(  (puntosComputadora < puntosMinimos)  && (puntosMinimos <= 21 ) );

        setTimeout(() => {
            if( puntosComputadora === puntosMinimos ) {
                alert('Nadie gana!!');
            } else if ( puntosMinimos > 21 ) {
                alert('Computadora gana')
            } else if( puntosComputadora > 21 ) {
                alert('Jugador Gana');
            } else {
                alert('Computadora Gana')
            }
        }, 100 );

    }

    // Click Events
    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos ( carta, 0);

        crearCarta( carta, 0);
        
        //Deshabilitar el boton pedir cartas una vez lleguemos a 21 o nos pasemos de 21
        if( puntosJugador > 21 ){
            console.warn('Sorry, you lost!!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );        
        }else if ( puntosJugador === 21 ){
            console.warn('21, Great you Won!!!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }

    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoComputadora ( puntosJugadores[0] );
    });

    btnNuevo.addEventListener('click', () => {

        console.clear();
        inicializarJuego();
        /* deck = [];
        deck = crearDeck(); */


    });

})();


