// CREANDO UN ARCHIVO GULP EJEMPLO

const { series, parallel, src, dest, watch } = require('gulp'); // Importar gulp
const sass = require('gulp-sass')(require('sass')); // Importar sass
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const webp = require('gulp-webp');
const concat = require('gulp-concat');

// Utilidades CSS
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

//Utilidades JS
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');

// Objeto para las rutas
const paths = {
    imagenes: 'src/img/**/*',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js'
}

// function css( done ) {
//     console.log('Compilando SASS...');

//     done(); // Función para dar finalizada una tarea
// }

// function javascript( done ) {
//     console.log('Compilando JS...');

//     done();
// }

// function minificarHTML( done ) {
//     console.log('Minificando HTML...');

//     done();
// }

// exports.css = css; // Exportar una tarea
// exports.javascript = javascript;
// exports.tareas = series(css, javascript, minificarHTML); 
// Exportar muchas tareas en serie (una tras otra) > "gulp tareas" en la terminal
// exports.default = parallel(css, javascript, minificarHTML);
// Exportar muchas tareas en forma paralela (al mismo tiempo) > "gulp" en la terminal por "default"


// FUNCION QUE COMPILA SASS

function css() {
    return src(paths.scss)
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss( [ autoprefixer(), cssnano() ] ) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('./build/css') )
}

function javascript() {
    return src(paths.js)
        .pipe( sourcemaps.init() )
        .pipe( concat('bundle.js') )
        .pipe( terser() )
        .pipe( sourcemaps.write('.') )
        .pipe( rename({ suffix: '.min' }))
        .pipe( dest('./build/js'))
}

function imagenes() {
    return src(paths.imagenes)
        .pipe( imagemin() )
        .pipe( dest('./build/img') )
        //.pipe( notify({ message: 'Imagen Minificada'}) );
}

function versionWebp() {
    return src(paths.imagenes)
        .pipe( webp() )
        .pipe( dest('./build/img') )
        //.pipe( notify({message: 'Versión webp lista'}) );
}

// ESCUCHAR POR CAMBIOS CON WATCH

function watchArchivos() {
    watch( paths.scss, css ); // * = La carpeta actual ; ** = Todos los archivos con esa extensión
    watch( paths.js, javascript);
}

exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.watchArchivos = watchArchivos;

exports.default = series( css, javascript, imagenes, versionWebp, watchArchivos );