const { processGIF, preguntarEscalado } = require("./rescaler");
const estilos = require("./estilo");

console.log("=== GIFnimator ===");

// Pedir al usuario el archivo de entrada
const readlineSync = require("readline-sync");
const fileName = readlineSync.question("Ingrese el nombre del archivo GIF: ");

// Opciones de escalado
console.log("\nOpciones de escalado:");
console.log("1. 100% (Sin cambios)");
console.log("2. 50% (Más pixelado)");
console.log("3. 25% (Aún más pixelado)");
console.log("4. 12.5% (Extremadamente pixelado)");
const escalaOpciones = [1, 0.5, 0.25, 0.125];
const escalaSeleccionada = readlineSync.questionInt("Seleccione una opción (1-4): ");
const scaleFactor = escalaOpciones[escalaSeleccionada - 1] || 1;

// Opciones de estilo
console.log("\nOpciones de estilo:");
console.log("1. Original");
console.log("2. GameBoy");
console.log("3. VaporWave");
console.log("4. SolarPunk");
console.log("5. SteamPunk");
console.log("6. Sumi-e");
const estilosDisponibles = ["original", "gameboy", "vaporwave", "solarpunk", "steampunk", "sumie"];
const estiloSeleccionado = readlineSync.questionInt("Seleccione una opción (1-6): ");
const estiloNombre = estilosDisponibles[estiloSeleccionado - 1] || "original";

// Obtener la función de estilo correspondiente
const applyStyle = estilos[estiloNombre] || null;

console.log(`\nProcesando GIF con escala ${scaleFactor} y estilo ${estiloNombre}...\n`);

// Procesar el GIF
processGIF(fileName, scaleFactor, applyStyle);
