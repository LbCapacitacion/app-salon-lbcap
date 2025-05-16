let paso = 1;
const pasoInicial = 1;

const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion();
    tabs(); //cambia la seccion cuando se presiionan los tabs
    botonesPaginador();//agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();
    consultarAPI();//consultar la api en php
    nombreCliente();//añade el nombre del cliente al objeto de cita
    idCliente();
    seleccionarFecha();

    seleccionarHora();//_Añade la hora de la cita en el objeto
    mostrarResumen();
}
function mostrarSeccion() {
    //ocultar laseccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');

    }
    //selleccionar la seccion con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);

    seccion.classList.add('mostrar');

    //quita la clase de actual al tab anteriror

    const tabAnterior = document.querySelector('.actual');

    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    //resalta el tab actual

    const tab = document.querySelector(`[data-paso="${paso}"]`);

    tab.classList.add('actual');
}
function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach(boton => {
        boton.addEventListener('click', function (e) {
            paso = parseInt(e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();

        });
    })
}

function botonesPaginador() {
    const paginaSig = document.querySelector('#siguiente');
    const paginaAnt = document.querySelector('#anterior');

    if (paso === 1) {
        paginaAnt.classList.add('ocultar');
        paginaSig.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnt.classList.remove('ocultar');
        paginaSig.classList.add('ocultar');
        mostrarResumen();
    } else {
        paginaAnt.classList.remove('ocultar');
        paginaSig.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnt = document.querySelector('#anterior');
    paginaAnt.addEventListener('click', function () {
        if (paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    });
}

function paginaSiguiente() {
    const paginaSig = document.querySelector('#siguiente');
    paginaSig.addEventListener('click', function () {
        if (paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    });
}

async function consultarAPI() {
    try {
        const url = '/api/servicios';
        const resultado = await fetch(url);//captura el servicio a consumir fetch antes conocido como ajax
        const servicios = await resultado.json();//asociamos el archivo json
        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }
}
function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');

        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function () {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio
    const { servicios } = cita;

    //identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);
    //conpmrobar si el servicio ya fue agregado

    if (servicios.some(agregado => agregado.id === id)) {
        //eliminarlo
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    } else {
        //agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }


    // const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);
    // divServicio.classList.add('seleccionado');

    console.log(cita);
}
function idCliente() {
    cita.id = document.querySelector('#id').value;

}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;


}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');

    inputFecha.addEventListener('input', function (e) {

        const dia = new Date(e.target.value).getUTCDay();
        if ([6, 0].includes(dia)) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            // console.log('correcto');
            cita.fecha = e.target.value;
        }
        // console.log(e.target.value);
        // cita.fecha = inputFecha.value;
    })
}
function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function (e) {


        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if (hora < 10 || hora > 18) {
            e.target.value = '';
            mostrarAlerta('Hora no valida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
            console.log(cita);
        }
    })
}
function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    //previene que se genere mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        alertaPrevia.remove();
    }
    //scripting de la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);
    //eliminar la alerta
    if (desaparece) {
        setTimeout(() => {
            alerta.remove();
        }, 4000);
    }

}
function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    //limpiar el contenido de resumen

    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }
    console.log(cita.servicios.length);
    if (Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('faltan datos de servicios, fecha u hora ', 'error', '.contenido-resumen', false);
        return;//detiene la ejecucion del codigo
    }

    //formatear el div de resumen

    const { nombre, fecha, hora, servicios } = cita;


    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);
    //iternado y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);


    });

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre: </span>${nombre}`;

    //formatear la fecha

    const fechaObj = new Date(fecha);

    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));

    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);


    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span>${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span>${hora} horas`;

    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';

    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);

}
async function reservarCita() {
    const { nombre, fecha, hora, servicios, id } = cita;
    const datos = new FormData();

    const idServicios = servicios.map(servicio => servicio.id);//map itera y asigna el valor retornado a la variable

    //del lado izq esta el key del post y del lado der esta la variable que contiene el dato
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);
    //console.log([...datos]);
    //return;
    //datos.append(edad,15);como no esta definido debe ser como string
    try {


        // const url = `${location.origin}/api/citas`;
        const url = '/api/citas';

        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos

        });

        const resultado = await respuesta.json();

        if (resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita creada",
                text: "Tu cita fue creada correctamente",
                button: 'Ok'
            }).then(() => {
                window.location.reload();
            })
        }

        // console.log(resultado.resultado);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita",
            button: 'Ok'
        })
    }
    //peticion hacia la api

    // console.log([...datos]);
}