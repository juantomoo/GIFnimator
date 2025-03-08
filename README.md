Aquí tienes el contenido completo de **README.md** con toda la información sobre tu aplicación **GIFnimator**:  

---

# 🎨 GIFnimator  

**GIFnimator** es una aplicación que permite procesar archivos GIF, reducir sus frames, cambiar su tamaño y aplicar diversos estilos visuales. Funciona tanto en una interfaz de línea de comandos (CLI) como en una interfaz web interactiva.

## 🚀 Características  
- Reducción de frames para optimizar GIFs.  
- Escalado de imágenes manteniendo la proporción.  
- Aplicación de estilos visuales como **Cyberpunk, GameBoy, Vaporwave, Noir, Pop Art, y más**.  
- Interfaz de línea de comandos (CLI) y **una interfaz web interactiva**.  
- **Previsualización avanzada** antes de generar el GIF final.  
- **Limpieza automática** de archivos temporales al iniciar el servidor.  

---

## 📥 Instalación  

1. Clona este repositorio en tu máquina local:  
   ```sh
   git clone https://github.com/tuusuario/GIFnimator.git
   cd GIFnimator
   ```

2. Instala las dependencias:  
   ```sh
   npm install
   ```

---

## 🔧 Uso  

### **1️⃣ Modo Web (Interfaz gráfica)**
Ejecuta el servidor y accede a la interfaz web en tu navegador:
```sh
npm start
```
Luego, abre tu navegador en `http://localhost:3000`.

**Flujo de uso:**  
1. **Sube un archivo GIF.**  
2. **Ajusta los parámetros** (reducción de frames, escala, estilo).  
3. **Previsualiza** los cambios antes de generar el GIF final.  
4. **Descarga el resultado.** 🎉  

### **2️⃣ Modo CLI (Línea de comandos)**
También puedes ejecutar la aplicación en terminal:
```sh
npm run cli
```
El programa te guiará paso a paso para subir un archivo y aplicar los cambios.

---

## 🎨 Estilos Disponibles  
GIFnimator ofrece los siguientes efectos visuales:  
- 🎮 **GameBoy**  
- 🌈 **Vaporwave**  
- ☀️ **SolarPunk**  
- ⚙️ **SteamPunk**  
- 🖌️ **Sumi-e (pintura japonesa en tinta)**  
- 🎭 **Noir (cine negro)**  
- 🎨 **Pop Art**  
- 🚀 **Cyberpunk**  
- 🖼️ **Watercolor (acuarela)**  
- 🕶️ **Retro 80s**  
- 📖 **Comic Book**  
- 🔥 **Infrared**  
- 🏛️ **Embossed (relieve 3D)**  
- 🖥️ **Glitch Art**  
- ⚫ **Minimalista**  
...y más.  

---

## 📁 Estructura del Proyecto  

```
/ (raíz del proyecto)
│
├── index.js           # CLI (ejecución por terminal)
├── server.js          # Servidor Express (web)
├── framer.js          # Reducción de frames
├── rescaler.js        # Escalado de imágenes
├── estilo.js          # Aplicación de estilos
├── questionRegistry.js# Registro de preguntas dinámicas
├── package.json       # Configuración del proyecto
│
└── public/            # Archivos accesibles por la web
    ├── index.html     # Interfaz web
    └── styles.css     # Estilos visuales
```

---

## ⚖️ Licencia  
Este proyecto está bajo la licencia **MIT**. Puedes usarlo, modificarlo y compartirlo libremente, siempre y cuando incluyas la atribución original.  

---

## 🏆 Créditos  
Desarrollado por Tomoo (https://instagram.com/juantomoo) para HISQUE EStudio (https://hisque.com.co).  
Si tienes preguntas o sugerencias, ¡no dudes en contribuir o abrir un issue! 😊  

