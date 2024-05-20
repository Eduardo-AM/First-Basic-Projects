// Variable global
let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Resalta el DIV según el tab que se presiona
    mostrarSeccion();

    // Muesta/Oculta sección según el tab que se presiona
    cambiarSeccion();

    // Paginación siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    // Comprueba pagina actual para ocultar/mostrar paginación
    botonesPaginador();

    // Muestra el resumen de la cita (o mensaje de error si no pasa la validación)
    mostrarResumen();

    // Almacena el nombre de la cita en el objeto
    nombreCita();

    // Almacena la fecha de la cita en el objeto
    fechaCita();

    // Deshabilitar fechas pasadas
    deshabilitarFechasPasadas();

    // Almacena la hora de la cita en el objeto
    horaCita();
}

function mostrarSeccion() {
    
    // Elimina "mostrar-seccion" de la sección anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    // Añade "mostrar-seccion" a la sección que debe mostrarse
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Elimina la clase "actual" en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resaltar tab actual (añade la clase "actual")
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // Llamar la función de mostrar sección
            mostrarSeccion();

            // Llamar la función de los botones del paginador
            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const { servicios } = db;

        // Generar el HTML
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

            // DOM Scripting
            // Generar nombre del servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            // Generar precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            // Generar el DIV contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // Seleccionar servicio con un click
            servicioDiv.onclick = seleccionarServicio;

            // Inyectar nombre y precio al DIV de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Inyectarlo al HTML
            document.querySelector('#servicios').appendChild(servicioDiv);

        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    
    // Forzar click en el DIV
    let elemento;

    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt( elemento.dataset.idServicio );

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        // console.log(servicioObj);

        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const { servicios } = cita; // Destructuring
    cita.servicios = servicios.filter( servicio => servicio.id !== id); // Array method

    //console.log(cita);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita; // Destructuring
    cita.servicios = [...servicios, servicioObj];

    //console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        //console.log(pagina);
        botonesPaginador();
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        //console.log(pagina);
        botonesPaginador();
    })
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); // Cambia la sección que se muestra por la de la página
}

function mostrarResumen() {
    // Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia el HTML previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    // Validación de objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Nombre, Fecha, Hora o Servicios';

        noServicios.classList.add('invalidar-cita');

        // Agregar a resumen Div
        resumenDiv.appendChild(noServicios);

        return;
    }

    // Mostrar el resumen de la cita

    // Heading para los datos de la cita
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    
    resumenDiv.appendChild(headingCita);

    // Nombre
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Fecha
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    // Hora
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    // Servicios
    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    // Heading para los servicios
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    // Iterar sobre el arreglo de servicios
    servicios.forEach( servicio => {
        const { nombre, precio } = servicio; // Destructuring

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        cantidad += parseInt(totalServicio[1].trim());

        // Colocar el texto y el precio en el DIV
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

    })

    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a pagar: </span> $${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        // Validación del nombre
        if ( nombreTexto === '' || nombreTexto.length < 3 ) {
            mostrarAlerta('Nombre no válido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    })
}

function mostrarAlerta(mensaje, tipo) {
    
    // Si hay una alerta previa, entonces no crea otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }
    
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    // Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar alerta despues de cierto tiempo
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        
        const dia = new Date(e.target.value).getUTCDay();

        if ([0].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Domingos día no válido', 'error');
        } else {
            cita.fecha = fechaInput.value;

            //console.log(cita);
        }

        // Método para cambiar idioma y opciones de la fecha    >   "toLocaleDateString"

        // const opciones = {
        //     weekday: 'long',
        //     month: 'long',
        //     year: 'numeric',
        //     day: 'numeric'
        // }

        // console.log(dia.toLocaleDateString('es-ES', opciones));
    })
}

function deshabilitarFechasPasadas() {
    const inputFecha = document.querySelector('#fecha');

    const fechaActual = new Date();
    const dia = fechaActual.getDate() + 1;
    const mes = fechaActual.getMonth() + 1;
    const year = fechaActual.getFullYear();

    // Formato deseado: AAAA-MM-DD -> El que usa HTML

    let fechaDeshabilitar;

    if ([10,11,12].includes(mes)) {
        fechaDeshabilitar = `${year}-${mes}-${dia}`;
    } else {
        fechaDeshabilitar = `${year}-0${mes}-${dia}`;
    }

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0] < 08 || (hora[0] >= 12 & hora[0] < 17) || hora[0] >= 21) {
            mostrarAlerta('Horario no válido', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            cita.hora = horaCita;

            //console.log(cita);
        }

    })
}