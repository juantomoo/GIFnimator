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
// 1. Calcula el delay total real sumando los delays de cada frame.
// 2. Para mantener la duración total, asigna a cada frame nuevo un delay = totalDelay / M.
// 3. Usa un "canvas base" para componer los frames de manera similar a como lo hace el GIF original.
function reducirFrames(fileName, framesConservar) {
    try {
        const buffer = fs.readFileSync(fileName);
        const gif = new GifReader(buffer);
        const N = gif.numFrames();
        const M = Math.max(1, framesConservar);

        // Calcular el delay total real sumando el delay de cada frame en milisegundos.
        // (GifReader da 'info.delay' en centésimas de segundo; si es 0, asumimos 100ms)
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

        // Configuramos el encoder para el GIF reducido
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

        // Para seleccionar los frames de forma uniforme
        const interval = N / M;

        // Procesar solo M frames (uniformemente distribuidos)
        for (let i = 0; i < M; i++) {
            // Índice real del frame en el GIF original
            const frameIndex = Math.floor(i * interval);
            const frameInfo = gif.frameInfo(frameIndex);

            console.log(`Procesando frame ${frameIndex + 1} de ${N} (nuevo frame #${i + 1})`);

            // Decodificamos la parte del frame en RGBA
            const frameData = new Uint8Array(frameInfo.width * frameInfo.height * 4);
            gif.decodeAndBlitFrameRGBA(frameIndex, frameData);

            // Limpiamos el canvas temporal
            ctxFrame.clearRect(0, 0, width, height);

            // Creamos un ImageData y lo volcamos en el canvas temporal
            const imageData = ctxFrame.createImageData(frameInfo.width, frameInfo.height);
            imageData.data.set(frameData);
            ctxFrame.putImageData(imageData, frameInfo.x, frameInfo.y);

            // **Compone** en el canvas base:
            //   1. Dependiendo del método de disposición, podría ser necesario
            //      limpiar parte del canvasBase. Aquí simplificamos.
            //   2. Dibujamos el frame temporal encima del canvas base.
            ctxBase.drawImage(canvasFrame, 0, 0);

            // Tomamos la imagen resultante del canvas base como el frame final
            const fullFrameData = ctxBase.getImageData(0, 0, width, height).data;
            encoder.addFrame(fullFrameData);
        }

        encoder.finish();

        // Construimos el nombre de salida
        const baseName = path.parse(fileName).name;
        const newFileName = `${baseName}-reduced-${M}.gif`;
        fs.writeFileSync(newFileName, encoder.out.getData());

        console.log(`\n✅ GIF reducido guardado en: ${newFileName}`);
        return newFileName;
    } catch (error) {
        console.error("❌ Error al reducir frames:", error);
        return fileName; // En caso de error, se devuelve el original.
    }
}

module.exports = { preguntarFramesConservar, reducirFrames };
