const { processGIF, preguntarEscalado } = require("./rescaler");
const estilos = require("./estilo");
const readlineSync = require("readline-sync");

console.log("=== GIFnimator ===");

// Pedir al usuario el archivo de entrada
const fileName = readlineSync.question("Ingrese el nombre del archivo GIF: ");

// Obtener opción de escalado desde el módulo rescaler (retorna objeto {factor, label})
const escalaObj = preguntarEscalado();

// Obtener opción de estilo desde el módulo estilo
const estiloNombre = estilos.preguntarEstilo();
const applyStyle = estilos[estiloNombre] || null;

console.log(`\nProcesando GIF con escala ${escalaObj.label}% y estilo ${estiloNombre}...\n`);

// Armar arreglo de elecciones (se pueden agregar más opciones en el futuro)
const elecciones = [escalaObj.label, estiloNombre];

// Procesar el GIF, enviando además las elecciones para el nombre final
processGIF(fileName, escalaObj, applyStyle, elecciones);
