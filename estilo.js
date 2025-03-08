const readlineSync = require("readline-sync");

// Función para preguntar al usuario la opción de estilo
function preguntarEstilo() {
    console.log("\n🎨 Opciones de estilo:");
    console.log("1. Original");
    console.log("2. GameBoy");
    console.log("3. VaporWave");
    console.log("4. SolarPunk");
    console.log("5. SteamPunk");
    console.log("6. Sumi-e");
    console.log("7. Pop Art");
    console.log("8. Cyberpunk");
    console.log("9. Noir");
    console.log("10. Watercolor");
    console.log("11. Retro 80s");
    console.log("12. Comic Book");
    console.log("13. Infrared");
    console.log("14. Embossed");
    console.log("15. Glitch Art");
    console.log("16. Minimalista");
    
    const estilosDisponibles = [
        "original", "gameboy", "vaporwave", "solarpunk", "steampunk", "sumie",
        "popart", "cyberpunk", "noir", "watercolor", "retro80s", "comicbook",
        "infrared", "embossed", "glitchart", "minimalista"
    ];
    const seleccion = readlineSync.questionInt("Seleccione una opción (1-16): ");
    return estilosDisponibles[seleccion - 1] || "original";
}

// Estilo Original: No se aplica ninguna transformación.
function aplicarOriginal(imageData) {
    // Deja la imagen sin cambios.
}

// Estilo GameBoy: Convierte la imagen a una paleta limitada inspirada en la GameBoy.
function aplicarGameBoy(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        let newColor = avg > 192 ? [155, 188, 15] 
                      : avg > 128 ? [139, 172, 15] 
                      : avg > 64  ? [48, 98, 48] 
                                  : [15, 56, 15];
        [data[i], data[i + 1], data[i + 2]] = newColor;
    }
}

// Estilo VaporWave: Modifica los colores para un look retro-futurista.
function aplicarVaporWave(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + 50);
        data[i + 1] = Math.max(0, data[i + 1] - 50);
        data[i + 2] = Math.min(255, data[i + 2] + 50);
    }
}

// Estilo SolarPunk: Aumenta brillo y saturación, realzando especialmente la componente verde.
function aplicarSolarPunk(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.floor(data[i] * 1.1 + 10));      // Rojo
        data[i + 1] = Math.min(255, Math.floor(data[i + 1] * 1.2 + 20)); // Verde
        data[i + 2] = Math.min(255, Math.floor(data[i + 2] * 1.1 + 10)); // Azul
    }
}

// Estilo Steampunk: Aplica un efecto sepia clásico para dar un look vintage y cálido.
function aplicarSteampunk(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const red = data[i], green = data[i + 1], blue = data[i + 2];
        const sepiaRed = Math.min(255, Math.floor(red * 0.393 + green * 0.769 + blue * 0.189));
        const sepiaGreen = Math.min(255, Math.floor(red * 0.349 + green * 0.686 + blue * 0.168));
        const sepiaBlue = Math.min(255, Math.floor(red * 0.272 + green * 0.534 + blue * 0.131));
        data[i] = sepiaRed;
        data[i + 1] = sepiaGreen;
        data[i + 2] = sepiaBlue;
    }
}

// Estilo Sumi-e: Convierte la imagen a blanco y negro con alto contraste, emulando la pintura de tinta japonesa.
function aplicarSumie(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const gray = Math.floor(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        const threshold = 128;
        const valor = gray > threshold ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = valor;
    }
}

// Estilo Pop Art: Cuantiza los colores para obtener un efecto de colores planos y vibrantes.
function aplicarPopArt(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.floor(data[i] / 64) * 64;
        data[i + 1] = Math.floor(data[i + 1] / 64) * 64;
        data[i + 2] = Math.floor(data[i + 2] / 64) * 64;
    }
}

// Estilo Cyberpunk: Aumenta los tonos neón y el contraste, enfatizando rojos y azules para un look futurista.
function aplicarCyberpunk(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.floor(data[i] * 1.2 + 20));
        data[i + 1] = Math.max(0, Math.floor(data[i + 1] * 0.8 - 10));
        data[i + 2] = Math.min(255, Math.floor(data[i + 2] * 1.3 + 30));
    }
}

// Estilo Noir: Convierte la imagen a escala de grises y aumenta el contraste para un look cinematográfico.
function aplicarNoir(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const contrast = 1.5;
        let newGray = ((gray - 128) * contrast) + 128;
        newGray = Math.max(0, Math.min(255, newGray));
        data[i] = data[i + 1] = data[i + 2] = newGray;
    }
}

// Estilo Watercolor (Acuarela): Aplica un desenfoque sencillo (box blur) para simular la apariencia de una pintura en acuarela.
function aplicarWatercolor(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const copy = new Uint8ClampedArray(data);
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    const idx = ((y + j) * width + (x + i)) * 4;
                    r += copy[idx];
                    g += copy[idx + 1];
                    b += copy[idx + 2];
                    a += copy[idx + 3];
                }
            }
            const idx = (y * width + x) * 4;
            data[idx] = Math.floor(r / 9);
            data[idx + 1] = Math.floor(g / 9);
            data[idx + 2] = Math.floor(b / 9);
            data[idx + 3] = Math.floor(a / 9);
        }
    }
}

// Estilo Retro 80s: Agrega un efecto de grano y ajusta los tonos a colores pastel para evocar la estética de los 80.
function aplicarRetro80s(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 40;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        data[i] = Math.floor(data[i] * 0.9 + 30);
        data[i + 1] = Math.floor(data[i + 1] * 0.9 + 30);
        data[i + 2] = Math.floor(data[i + 2] * 0.9 + 30);
    }
}

// Estilo Comic Book: Cuantiza los colores para imitar el aspecto de viñetas en cómics.
function aplicarComicBook(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.floor(data[i] / 64) * 64;
        data[i + 1] = Math.floor(data[i + 1] / 64) * 64;
        data[i + 2] = Math.floor(data[i + 2] / 64) * 64;
    }
}

// Estilo Infrared: Intercambia y ajusta los canales para simular la fotografía infrarroja.
function aplicarInfrared(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let red = data[i], green = data[i + 1], blue = data[i + 2];
        data[i] = Math.min(255, blue + 40);
        data[i + 1] = green;
        data[i + 2] = Math.max(0, red - 30);
    }
}

// Estilo Embossed (Relieve): Aplica un filtro de convolución para dar la sensación de relieve.
function aplicarEmbossed(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const copy = new Uint8ClampedArray(data);
    const kernel = [
        -2, -1, 0,
        -1,  1, 1,
         0,  1, 2
    ];
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let sumR = 0, sumG = 0, sumB = 0;
            let k = 0;
            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    const idx = ((y + j) * width + (x + i)) * 4;
                    sumR += copy[idx] * kernel[k];
                    sumG += copy[idx + 1] * kernel[k];
                    sumB += copy[idx + 2] * kernel[k];
                    k++;
                }
            }
            const idx = (y * width + x) * 4;
            data[idx] = Math.min(255, Math.max(0, sumR + 128));
            data[idx + 1] = Math.min(255, Math.max(0, sumG + 128));
            data[idx + 2] = Math.min(255, Math.max(0, sumB + 128));
        }
    }
}

// Estilo Glitch Art: Desplaza filas horizontales de manera aleatoria para generar un efecto digital.
function aplicarGlitchArt(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    for (let y = 0; y < height; y++) {
        if (Math.random() < 0.1) {
            const offset = Math.floor((Math.random() - 0.5) * width);
            const row = new Uint8ClampedArray(width * 4);
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                row.set(data.slice(idx, idx + 4), x * 4);
            }
            for (let x = 0; x < width; x++) {
                const srcIndex = ((x - offset + width) % width) * 4;
                const idx = (y * width + x) * 4;
                data[idx] = row[srcIndex];
                data[idx + 1] = row[srcIndex + 1];
                data[idx + 2] = row[srcIndex + 2];
                data[idx + 3] = row[srcIndex + 3];
            }
        }
    }
}

// Estilo Minimalista: Reduce la paleta de colores a niveles simples (negro, gris y blanco).
function aplicarMinimalista(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        let newVal;
        if (gray < 85) newVal = 0;
        else if (gray < 170) newVal = 128;
        else newVal = 255;
        data[i] = data[i + 1] = data[i + 2] = newVal;
    }
}

// Se exportan las funciones de cada estilo con claves que coinciden con las opciones disponibles.
const estilos = {
    original: aplicarOriginal,
    gameboy: aplicarGameBoy,
    vaporwave: aplicarVaporWave,
    solarpunk: aplicarSolarPunk,
    steampunk: aplicarSteampunk,
    sumie: aplicarSumie,
    popart: aplicarPopArt,
    cyberpunk: aplicarCyberpunk,
    noir: aplicarNoir,
    watercolor: aplicarWatercolor,
    retro80s: aplicarRetro80s,
    comicbook: aplicarComicBook,
    infrared: aplicarInfrared,
    embossed: aplicarEmbossed,
    glitchart: aplicarGlitchArt,
    minimalista: aplicarMinimalista
};

// Configuración de la pregunta para este módulo (para el registry)
const preguntasEstilo = {
    id: "estilo",
    cli: {
        question: "\n🎨 Opciones de estilo:",
        options: [
            { option: "Original", value: "original" },
            { option: "GameBoy", value: "gameboy" },
            { option: "VaporWave", value: "vaporwave" },
            { option: "SolarPunk", value: "solarpunk" },
            { option: "SteamPunk", value: "steampunk" },
            { option: "Sumi-e", value: "sumie" },
            { option: "Pop Art", value: "popart" },
            { option: "Cyberpunk", value: "cyberpunk" },
            { option: "Noir", value: "noir" },
            { option: "Watercolor", value: "watercolor" },
            { option: "Retro 80s", value: "retro80s" },
            { option: "Comic Book", value: "comicbook" },
            { option: "Infrared", value: "infrared" },
            { option: "Embossed", value: "embossed" },
            { option: "Glitch Art", value: "glitchart" },
            { option: "Minimalista", value: "minimalista" }
        ]
    },
    web: {
        id: "estilo",
        label: "Estilo",
        type: "select",
        options: [
            { label: "Original", value: "original" },
            { label: "GameBoy", value: "gameboy" },
            { label: "VaporWave", value: "vaporwave" },
            { label: "SolarPunk", value: "solarpunk" },
            { label: "SteamPunk", value: "steampunk" },
            { label: "Sumi-e", value: "sumie" },
            { label: "Pop Art", value: "popart" },
            { label: "Cyberpunk", value: "cyberpunk" },
            { label: "Noir", value: "noir" },
            { label: "Watercolor", value: "watercolor" }
        ]
    }
};

module.exports = { ...estilos, preguntarEstilo, preguntasEstilo };
