const fs = require("fs");
const { createCanvas } = require("canvas");
const GIFEncoder = require("gif-encoder-2");
const { GifReader } = require("omggif");
const readlineSync = require("readline-sync");
const path = require("path");

// Muestra el número total de frames y pregunta al usuario cuántos desea conservar.
function preguntarFramesConservar(fileName) {
    try {
        const buffer = fs.readFileSync(fileName);
        const gif = new GifReader(buffer);
        const totalFrames = gif.numFrames();
        console.log(`El GIF tiene ${totalFrames} frames.`);
        const framesDeseados = readlineSync.questionInt(`Ingrese el número de frames que desea conservar (1-${totalFrames}): `);
        if (framesDeseados < 1 || framesDeseados > totalFrames) {
            console.log(`Valor inválido. Se conservarán todos los ${totalFrames} frames.`);
            return totalFrames;
        }
        return framesDeseados;
    } catch (error) {
        console.error("Error al leer el GIF:", error);
        return 0;
    }
}

// Reduce los frames del GIF de forma uniforme, conservando la duración total de la animación.
function reducirFrames(fileName, framesConservar) {
    try {
        const buffer = fs.readFileSync(fileName);
        const gif = new GifReader(buffer);
        const N = gif.numFrames();
        const M = Math.max(1, framesConservar);

        // Calcular el delay total real sumando los delays de cada frame (en ms).
        let totalDelay = 0;
        for (let i = 0; i < N; i++) {
            const info = gif.frameInfo(i);
            totalDelay += info.delay ? info.delay * 10 : 100;
        }
        const delayPerFrame = Math.floor(totalDelay / M);

        console.log(`\n--- Reducción de frames ---`);
        console.log(`Frames originales (N): ${N}`);
        console.log(`Frames a conservar (M): ${M}`);
        console.log(`Delay total original: ${totalDelay} ms`);
        console.log(`Delay asignado a cada frame: ${delayPerFrame} ms\n`);

        const width = gif.width;
        const height = gif.height;

        const encoder = new GIFEncoder(width, height);
        encoder.setDelay(delayPerFrame);
        encoder.setRepeat(0);
        encoder.start();

        // Canvas base para acumular la composición de frames
        const canvasBase = createCanvas(width, height);
        const ctxBase = canvasBase.getContext("2d");

        // Canvas temporal para decodificar cada frame
        const canvasFrame = createCanvas(width, height);
        const ctxFrame = canvasFrame.getContext("2d");

        // Seleccionar los frames de forma uniforme
        const interval = N / M;

        for (let i = 0; i < M; i++) {
            const frameIndex = Math.floor(i * interval);
            const frameInfo = gif.frameInfo(frameIndex);

            console.log(`Procesando frame ${frameIndex + 1} de ${N} (nuevo frame #${i + 1})`);

            // Decodificar el frame en formato RGBA
            const frameData = new Uint8Array(frameInfo.width * frameInfo.height * 4);
            gif.decodeAndBlitFrameRGBA(frameIndex, frameData);

            // Limpiar el canvas temporal
            ctxFrame.clearRect(0, 0, width, height);

            // Crear un ImageData y dibujarlo en el canvas temporal
            const imageData = ctxFrame.createImageData(frameInfo.width, frameInfo.height);
            imageData.data.set(frameData);
            ctxFrame.putImageData(imageData, frameInfo.x, frameInfo.y);

            // Componer el frame en el canvas base
            ctxBase.drawImage(canvasFrame, 0, 0);

            // Agregar el frame compuesto al GIF final
            const fullFrameData = ctxBase.getImageData(0, 0, width, height).data;
            encoder.addFrame(fullFrameData);
        }

        encoder.finish();

        const baseName = path.parse(fileName).name;
        const newFileName = `${baseName}-reduced-${M}.gif`;
        fs.writeFileSync(newFileName, encoder.out.getData());

        console.log(`\n✅ GIF reducido guardado en: ${newFileName}`);
        return newFileName;
    } catch (error) {
        console.error("❌ Error al reducir frames:", error);
        return fileName;
    }
}

// Configuración de la pregunta para este módulo (para el registry)
const preguntasFramer = {
    id: "framesConservar",
    cli: {
        question: (totalFrames) => `El GIF tiene ${totalFrames} frames. Ingrese el número de frames que desea conservar (1-${totalFrames}): `
    },
    web: {
        id: "framesConservar",
        label: "Frames a conservar (deja vacío para no reducir)",
        type: "number",
        min: 1,
        default: ""
    }
};

module.exports = { preguntarFramesConservar, reducirFrames, preguntasFramer };
