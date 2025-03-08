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

/**
 * Función para limpiar archivos GIF temporales al iniciar el servidor.
 * Solo elimina archivos con extensión ".gif" en la carpeta "uploads/" que tengan más de 24 horas.
 */
function limpiarGifsTemporales() {
    const directorio = "uploads/";
    const tiempoMaximo = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

    if (fs.existsSync(directorio)) {
        fs.readdirSync(directorio).forEach((archivo) => {
            const filePath = path.join(directorio, archivo);
            if (fs.statSync(filePath).isFile() && path.extname(archivo) === ".gif") {
                const tiempoCreacion = fs.statSync(filePath).ctimeMs;
                const tiempoActual = Date.now();

                if ((tiempoActual - tiempoCreacion) > tiempoMaximo) {
                    try {
                        fs.unlinkSync(filePath);
                        console.log(`🗑️ Eliminado: ${filePath}`);
                    } catch (err) {
                        console.error(`❌ Error eliminando ${filePath}:`, err);
                    }
                }
            }
        });
    }
}

// Ejecutar limpieza de archivos GIF temporales al iniciar el servidor
limpiarGifsTemporales();

// Ruta para obtener propiedades del GIF al subirlo
app.post("/upload", upload.single("gifFile"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo GIF." });

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const baseName = path.parse(originalName).name;
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

    const previewBase64 = `data:image/gif;base64,${fs.readFileSync(filePath).toString("base64")}`;

    res.json({
        name: baseName,
        width,
        height,
        frames: totalFrames,
        sizeKB,
        filePath,
        preview: previewBase64
    });
});

// Ruta para previsualizar el GIF con las opciones actuales
app.post("/preview", (req, res) => {
    const { gifFilePath, escala, estilo } = req.body;
    if (!gifFilePath || !fs.existsSync(gifFilePath)) {
        return res.status(400).send("No se ha seleccionado ningún archivo o el archivo no existe.");
    }
    const escalaObj = { factor: parseFloat(escala) / 100, label: escala };
    const result = processGIF(gifFilePath, escalaObj, estilos[estilo]);
    if (!result) return res.status(500).send("Error al generar la preview.");
    const base64Gif = `data:image/gif;base64,${Buffer.from(result.buffer).toString("base64")}`;
    res.json({ preview: base64Gif });
});

// Ruta para procesar el GIF final
app.post("/process", (req, res) => {
    const { gifFilePath, framesConservar, escala, estilo } = req.body;

    if (!gifFilePath || !fs.existsSync(gifFilePath)) {
        return res.status(400).send("No se ha seleccionado ningún archivo o el archivo no existe.");
    }

    let fileForProcessing = gifFilePath;
    const baseName = path.parse(gifFilePath).name;
    const cambios = [];
    let archivosGenerados = [gifFilePath]; // Lista de archivos a eliminar después

    // Si se desea reducir frames
    if (framesConservar && parseInt(framesConservar) > 0) {
        fileForProcessing = framer.reducirFrames(gifFilePath, parseInt(framesConservar));
        cambios.push(`reduced${framesConservar}`);
        archivosGenerados.push(fileForProcessing); // Agregar archivo intermedio a eliminar
    }

    // Agregar escala y estilo a los cambios
    cambios.push(`${escala}`);
    cambios.push(estilo);

    // Construir el nuevo nombre del archivo
    const newFileName = `${baseName}_${cambios.join("_")}.gif`;
    archivosGenerados.push(newFileName); // Agregar el archivo final a la lista

    console.log(`Procesando GIF con cambios: ${cambios.join(", ")}`);

    // Procesar el GIF final
    const result = processGIF(fileForProcessing, { factor: parseFloat(escala) / 100, label: escala }, estilos[estilo]);
    if (!result) return res.status(500).send("Error al generar el GIF.");

    fs.writeFileSync(newFileName, result.buffer); // Guardar archivo final

    const archivosJSON = JSON.stringify(archivosGenerados).replace(/</g, "\\u003c");

    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GIF Procesado</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <div class="container">
                <h2>GIF procesado con éxito</h2>
                <p>Archivo generado: ${newFileName}</p>
                <img src="/download/${newFileName}" class="gif-preview"/><br>
                <a id="downloadLink" href="/download/${newFileName}" download="${newFileName}">
                    <button onclick="handleDownload('${newFileName}')">Descargar GIF</button>
                </a>
                <br><br>
                <a href="/">Volver al inicio</a>
            </div>

            <script>
                window.archivosGenerados = ${archivosJSON};

                function handleDownload(fileName) {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = "/download/" + fileName;
                    downloadLink.download = fileName;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    
                    setTimeout(() => {
                        fetch('/cleanup', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ files: window.archivosGenerados })
                        })
                        .then(response => {
                            if (response.ok) {
                                console.log("✅ Archivos eliminados correctamente");
                                window.location.href = "/";
                            } else {
                                console.error("❌ Error al eliminar archivos");
                            }
                        })
                        .catch(error => console.error("❌ Error en la petición de limpieza:", error));
                    }, 3000);
                }
            </script>
        </body>
        </html>
    `);
});

// Ruta para servir el archivo para descarga
app.get("/download/:fileName", (req, res) => {
    const filePath = path.join(__dirname, req.params.fileName);
    if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
            if (err) console.error(`Error al descargar ${filePath}:`, err);
        });
    } else {
        res.status(404).send("Archivo no encontrado.");
    }
});

// Ruta para eliminar todos los archivos generados
app.post("/cleanup", (req, res) => {
    const { files } = req.body;
    if (!files || !Array.isArray(files)) {
        return res.status(400).send("Lista de archivos inválida.");
    }

    files.forEach((filePath) => {
        const absolutePath = path.join(__dirname, filePath);
        if (fs.existsSync(absolutePath)) {
            try {
                fs.unlinkSync(absolutePath);
                console.log(`✅ Archivo eliminado: ${filePath}`);
            } catch (err) {
                console.error(`❌ Error al eliminar ${filePath}:`, err);
            }
        }
    });

    res.sendStatus(200);
});

// Ruta para entregar las preguntas (versión web del registry)
app.get("/questions", (req, res) => {
    const questionRegistry = require("./questionRegistry");
    const webQuestions = questionRegistry.map(q => q.web);
    res.json(webQuestions);
});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});
