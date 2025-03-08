const framer = require("./framer");
const { processGIF, preguntarEscalado } = require("./rescaler");
const estilos = require("./estilo");
const readlineSync = require("readline-sync");
const fs = require("fs");
const { GifReader } = require("omggif");

console.log("=== GIFnimator ===");

// Pedir al usuario el archivo GIF de entrada
const fileName = readlineSync.question("Ingrese el nombre del archivo GIF: ");

// Se muestra el total de frames y se pregunta cuántos desea conservar
const framesConservar = framer.preguntarFramesConservar(fileName);

// Para determinar si es necesario reducir frames, se obtiene el total de frames
const buffer = fs.readFileSync(fileName);
const gif = new GifReader(buffer);
const totalFrames = gif.numFrames();

let fileForProcessing = fileName;
if (framesConservar < totalFrames) {
    fileForProcessing = framer.reducirFrames(fileName, framesConservar);
}

// Obtener opción de escalado desde rescaler.js (retorna objeto { factor, label })
const escalaObj = preguntarEscalado();

// Obtener opción de estilo desde estilo.js
const estiloNombre = estilos.preguntarEstilo();
const applyStyle = estilos[estiloNombre] || null;

// Armar arreglo de elecciones para el nombre final. Se incluye la reducción solo si se aplicó.
const elecciones = [];
if (framesConservar < totalFrames) {
    elecciones.push(`reduced${framesConservar}`);
}
elecciones.push(`${escalaObj.label}`, estiloNombre);

console.log(`\nProcesando GIF con reducción a ${framesConservar} frames, escala ${escalaObj.label}% y estilo ${estiloNombre}...\n`);

// Procesar el GIF final utilizando el archivo (original o reducido) y las opciones seleccionadas
processGIF(fileForProcessing, escalaObj, applyStyle, elecciones);
