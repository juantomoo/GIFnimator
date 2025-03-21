const fs = require("fs");
const { createCanvas } = require("canvas");
const GIFEncoder = require("gif-encoder-2");
const { GifReader } = require("omggif");
const path = require("path");

function processGIF(fileName, escalaObj, applyStyle = null, elecciones = []) {
    try {
        const buffer = fs.readFileSync(fileName);
        const gif = new GifReader(buffer);

        const width = gif.width;
        const height = gif.height;
        const numFrames = gif.numFrames();
        const newWidth = Math.max(1, Math.floor(width * escalaObj.factor));
        const newHeight = Math.max(1, Math.floor(height * escalaObj.factor));

        console.log(`📏 Dimensiones: ${width}x${height} -> ${newWidth}x${newHeight}`);

        const encoder = new GIFEncoder(width, height);
        encoder.setDelay(100);
        encoder.setRepeat(0);
        encoder.start();

        // Canvas base para acumular los frames correctamente
        const canvasBase = createCanvas(width, height);
        const ctxBase = canvasBase.getContext("2d");

        // Canvas para dibujar cada frame
        const canvasFrame = createCanvas(width, height);
        const ctxFrame = canvasFrame.getContext("2d");

        // Canvas escalado para el GIF final
        const canvasScaled = createCanvas(width, height);
        const ctxScaled = canvasScaled.getContext("2d");
        ctxScaled.imageSmoothingEnabled = false;

        let frameIndex = 1;
        for (let i = 0; i < numFrames; i++) {
            console.log(`🖼️ Procesando frame ${frameIndex++}/${numFrames}...`);

            // Extraer el frame actual
            const frameInfo = gif.frameInfo(i);
            const frameData = new Uint8Array(frameInfo.width * frameInfo.height * 4);
            gif.decodeAndBlitFrameRGBA(i, frameData);

            // Crear imagen del frame
            const imageData = ctxFrame.createImageData(frameInfo.width, frameInfo.height);
            imageData.data.set(frameData);
            ctxFrame.putImageData(imageData, frameInfo.x, frameInfo.y);

            // Fusionar frame con el fondo del canvas base
            ctxBase.drawImage(canvasFrame, 0, 0);

            // Aplicar escalado sin perder información
            ctxScaled.clearRect(0, 0, width, height);
            ctxScaled.drawImage(canvasBase, 0, 0, newWidth, newHeight);
            ctxScaled.drawImage(canvasScaled, 0, 0, newWidth, newHeight, 0, 0, width, height);

            // Aplicar estilo si se requiere
            if (applyStyle && typeof applyStyle === "function") {
                const styledData = ctxScaled.getImageData(0, 0, width, height);
                applyStyle(styledData);
                ctxScaled.putImageData(styledData, 0, 0);
            }

            // Agregar frame al GIF
            const outputFrame = ctxScaled.getImageData(0, 0, width, height).data;
            encoder.addFrame(outputFrame);
        }

        encoder.finish();

        // En lugar de guardar en disco, retornamos el buffer y el nombre sugerido.
        const outputBuffer = encoder.out.getData();
        const baseName = path.parse(fileName).name;
        const suggestedName = `${baseName}-${elecciones.join("-")}.gif`;
        return { buffer: outputBuffer, suggestedName };
    } catch (error) {
        console.error("❌ Error al procesar el GIF:", error);
        return null;
    }
}

// Función antigua para preguntar por escalado en CLI (se conserva por compatibilidad)
function preguntarEscalado() {
    const readlineSync = require("readline-sync");

    console.log("\n🔍 Opciones de escalado:");
    console.log("1. 100% (Sin cambios)");
    console.log("2. 50% (Más pixelado)");
    console.log("3. 25% (Aún más pixelado)");
    console.log("4. 12.5% (Extremadamente pixelado)");

    const opciones = [
        { factor: 1, label: "100" },
        { factor: 0.5, label: "50" },
        { factor: 0.25, label: "25" },
        { factor: 0.125, label: "12.5" }
    ];
    const seleccion = readlineSync.questionInt("Seleccione una opción (1-4): ");
    return opciones[seleccion - 1] || opciones[0];
}

// Configuración de la pregunta para este módulo (para el registry)
const preguntasRescaler = {
    id: "escala",
    cli: {
        question: "\n🔍 Opciones de escalado:",
        options: [
            { option: "100% (Sin cambios)", value: { factor: 1, label: "100" } },
            { option: "50% (Más pixelado)", value: { factor: 0.5, label: "50" } },
            { option: "25% (Aún más pixelado)", value: { factor: 0.25, label: "25" } },
            { option: "12.5% (Extremadamente pixelado)", value: { factor: 0.125, label: "12.5" } }
        ]
    },
    web: {
        id: "escala",
        label: "Pixelizar (escalado porcentual)",
        type: "select",
        options: [
            { label: "100%", value: 100 },
            { label: "50%", value: 50 },
            { label: "25%", value: 25 },
            { label: "12.5%", value: 12.5 }
        ]
    }
};

module.exports = { processGIF, preguntarEscalado, preguntasRescaler };
