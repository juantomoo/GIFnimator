const framer = require("./framer");
const { processGIF } = require("./rescaler");
const estilos = require("./estilo");
const readlineSync = require("readline-sync");
const fs = require("fs");
const { GifReader } = require("omggif");
const questionRegistry = require("./questionRegistry");

console.log("=== GIFnimator ===");

// Pedir al usuario el archivo GIF de entrada
const fileName = readlineSync.question("Ingrese el nombre del archivo GIF: ");

// Leer el GIF para obtener el total de frames
const buffer = fs.readFileSync(fileName);
const gif = new GifReader(buffer);
const totalFrames = gif.numFrames();

// Objeto para almacenar las respuestas
let answers = { gifFile: fileName };

// Recorrer dinámicamente el registry de preguntas
for (let q of questionRegistry) {
    if (q.id === "framesConservar") {
        // Para frames, usamos la función que depende del total de frames
        const resp = readlineSync.questionInt(q.cli.question(totalFrames));
        answers.frames = resp;
    } else if (q.id === "escala") {
        console.log(q.cli.question);
        q.cli.options.forEach((opt, idx) => {
            console.log(`${idx + 1}. ${opt.option}`);
        });
        const index = readlineSync.questionInt(`Seleccione una opción (1-${q.cli.options.length}): `);
        answers.scale = q.cli.options[index - 1].value;
    } else if (q.id === "estilo") {
        console.log(q.cli.question);
        q.cli.options.forEach((opt, idx) => {
            console.log(`${idx + 1}. ${opt.option}`);
        });
        const index = readlineSync.questionInt(`Seleccione una opción (1-${q.cli.options.length}): `);
        answers.style = q.cli.options[index - 1].value;
    }
}

// Si se desea reducir frames
let fileForProcessing = fileName;
if (answers.frames < totalFrames) {
    fileForProcessing = framer.reducirFrames(fileName, answers.frames);
}

// Armar arreglo de elecciones para el nombre final
const elecciones = [];
if (answers.frames < totalFrames) {
    elecciones.push(`reduced${answers.frames}`);
}
elecciones.push(`${answers.scale.label}`, answers.style);

console.log(`\nProcesando GIF con reducción a ${answers.frames} frames, escala ${answers.scale.label}% y estilo ${answers.style}...\n`);

// Procesar el GIF final y guardar el archivo con el nuevo nombre
const result = processGIF(fileForProcessing, answers.scale, estilos[answers.style], elecciones);
if (result) {
    fs.writeFileSync(result.suggestedName, result.buffer);
    console.log("GIF final generado:", result.suggestedName);
} else {
    console.log("Error en el procesamiento del GIF.");
}
