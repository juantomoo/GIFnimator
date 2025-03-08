const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { GifReader } = require("omggif");
const framer = require("./framer");
const { processGIF } = require("./rescaler");
const estilos = require("./estilo");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Ruta para obtener propiedades del GIF al subirlo
app.post("/upload", upload.single("gifFile"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo GIF." });

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    let totalFrames = 0, width = 0, height = 0, sizeKB = (req.file.size / 1024).toFixed(2);

    try {
        const buffer = fs.readFileSync(filePath);
        const gif = new GifReader(buffer);
        totalFrames = gif.numFrames();
        width = gif.width;
        height = gif.height;
    } catch (e) {
        return res.status(500).json({ error: "Error al procesar el GIF." });
    }

    // Generar vista previa en Base64 para mostrarla en la interfaz
    const previewBase64 = `data:image/gif;base64,${fs.readFileSync(filePath).toString("base64")}`;

    res.json({
        name: originalName,
        width,
        height,
        frames: totalFrames,
        sizeKB,
        filePath,
        preview: previewBase64
    });
});

// 🔹 Ruta para procesar el GIF
app.post("/process", (req, res) => {
    const { gifFilePath, framesConservar, escala, estilo } = req.body;

    if (!gifFilePath || !fs.existsSync(gifFilePath)) {
        return res.status(400).send("No se ha seleccionado ningún archivo o el archivo no existe.");
    }

    const result = processGIF(gifFilePath, { factor: parseFloat(escala) / 100 }, estilos[estilo]);
    if (!result) return res.status(500).send("Error al generar el GIF.");

    const base64Gif = `data:image/gif;base64,${Buffer.from(result.buffer).toString("base64")}`;
    
    fs.unlinkSync(gifFilePath);

    res.send(`
        <h2>GIF procesado con éxito</h2>
        <img src="${base64Gif}" /><br>
        <a href="${base64Gif}" download="gif_procesado.gif">
            <button>Descargar GIF</button>
        </a>
        <br><br>
        <a href="/">Volver al inicio</a>
    `);
});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});
