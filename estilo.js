const readlineSync = require("readline-sync");

function preguntarEstilo() {
    console.log("\n🎨 Opciones de estilo:");
    console.log("1. Original");
    console.log("2. GameBoy");
    console.log("3. VaporWave");
    console.log("4. SolarPunk");
    console.log("5. SteamPunk");
    console.log("6. Sumi-e");
    
    const estilosDisponibles = ["original", "gameboy", "vaporwave", "solarpunk", "steampunk", "sumie"];
    const seleccion = readlineSync.questionInt("Seleccione una opción (1-6): ");
    return estilosDisponibles[seleccion - 1] || "original";
}

// Funciones de estilos
function aplicarGameBoy(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        let newColor = avg > 192 ? [155, 188, 15] : avg > 128 ? [139, 172, 15] : avg > 64 ? [48, 98, 48] : [15, 56, 15];
        [data[i], data[i + 1], data[i + 2]] = newColor;
    }
}

function aplicarVaporWave(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + 50);
        data[i + 1] = Math.max(0, data[i + 1] - 50);
        data[i + 2] = Math.min(255, data[i + 2] + 50);
    }
}

const estilos = { original: () => {}, gameboy: aplicarGameBoy, vaporwave: aplicarVaporWave };

module.exports = { ...estilos, preguntarEstilo };
