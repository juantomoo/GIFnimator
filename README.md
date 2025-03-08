
# GIFnimator

GIFnimator es una aplicación en Node.js diseñada para analizar y modificar archivos GIF mediante una interfaz de línea de comandos. Permite aplicar escalados que generan efectos de pixelado y modificar el estilo visual del GIF para obtener apariencias temáticas, como el estilo GameBoy o VaporWave.

## Características

- **Procesamiento de GIF:** Extrae y procesa cada frame del GIF de entrada.
- **Opciones de escalado:** Permite reducir la resolución del GIF para obtener distintos niveles de pixelado:
  - 100% (Sin cambios)
  - 50% (Más pixelado)
  - 25% (Aún más pixelado)
  - 12.5% (Extremadamente pixelado)
- **Aplicación de estilos:** Ofrece la posibilidad de modificar la apariencia de los frames mediante estilos predefinidos:
  - Original
  - GameBoy
  - VaporWave
  - SolarPunk
  - SteamPunk
  - Sumi-e  
  *Nota:* Actualmente, solo se han implementado funciones de estilo para _GameBoy_ y _VaporWave_. Los demás estilos se tratan como "Original" si no se define una función específica en el archivo `estilo.js`.

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/gifnimator.git
   cd gifnimator
   ```

2. **Instala las dependencias necesarias:**

   ```bash
   npm install
   ```

## Uso

Para ejecutar la aplicación, utiliza el siguiente comando:

```bash
npm start
```

Al iniciar, la aplicación realizará los siguientes pasos:

1. **Solicitar el archivo GIF de entrada:**  
   Se te pedirá que ingreses el nombre del archivo GIF que deseas procesar.

2. **Selección de opciones de escalado:**  
   Se mostrarán cuatro opciones de escalado:
   - 1. 100% (Sin cambios)
   - 2. 50% (Más pixelado)
   - 3. 25% (Aún más pixelado)
   - 4. 12.5% (Extremadamente pixelado)  
   El escalado seleccionado determina el factor de reducción aplicado a la imagen.

3. **Selección de opciones de estilo:**  
   Se ofrecen seis opciones de estilo:
   - 1. Original
   - 2. GameBoy
   - 3. VaporWave
   - 4. SolarPunk
   - 5. SteamPunk
   - 6. Sumi-e  
   El estilo elegido se aplica a cada frame del GIF mediante una función de transformación definida en `estilo.js`.

4. **Procesamiento del GIF:**  
   La aplicación procesa cada frame del GIF:
   - Lee y decodifica los frames.
   - Escala la imagen según el factor seleccionado.
   - Aplica el estilo si se seleccionó alguno (y si la función correspondiente está implementada).
   - Compone el GIF final y lo guarda como `output.gif`.

## Estructura del Proyecto

- **index.js:**  
  Es el punto de entrada principal. Gestiona la interacción con el usuario a través de la línea de comandos, solicitando el nombre del archivo, la opción de escalado y la de estilo, para luego invocar la función que procesa el GIF.

- **rescaler.js:**  
  Contiene la lógica para el procesamiento y escalado de los GIF. Entre sus responsabilidades se encuentra:
  - Leer el archivo GIF y extraer sus frames.
  - Redimensionar cada frame según el factor de escala.
  - Fusionar y componer los frames en el GIF final.
  - Exportar la función `processGIF` y una función auxiliar `preguntarEscalado`.

- **estilo.js:**  
  Define las funciones de estilo que modifican la apariencia de los frames del GIF. Actualmente implementa:
  - **aplicarGameBoy:** Aplica una paleta de colores inspirada en GameBoy.
  - **aplicarVaporWave:** Modifica los colores para lograr un efecto VaporWave.
  
  Además, incluye la función `preguntarEstilo` para solicitar al usuario la opción de estilo.

- **package.json:**  
  Contiene la configuración del proyecto, scripts de ejecución y la lista de dependencias necesarias para el funcionamiento de la aplicación.

## Dependencias

La aplicación utiliza los siguientes paquetes de Node.js:

- **canvas:** Para la manipulación y renderización de imágenes.
- **readline-sync:** Para gestionar la interacción en línea de comandos.
- **gif-encoder-2:** Para la creación y codificación del GIF final.
- **omggif:** Para la lectura y decodificación de los GIFs.
- **chalk, cli-progress, fs-extra, gifuct-js, png-js, uuid:** Otros módulos que apoyan el procesamiento y funcionalidades adicionales.

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas aportar mejoras, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama con tus cambios: `git checkout -b mejora-feature`.
3. Realiza tus cambios y confirma con mensajes descriptivos.
4. Envía un pull request explicando los cambios realizados.

## Licencia

Este proyecto se distribuye bajo la Licencia MIT. Consulta el archivo `LICENSE` para obtener más información.

## Autor

**Tomoo**

Repositorio en GitHub: [https://github.com/tu-usuario/gifnimator](https://github.com/tu-usuario/gifnimator)

## Notas Adicionales

- **Estilos no implementados:** Algunos estilos, como SolarPunk, SteamPunk y Sumi-e, actualmente no tienen una función de transformación definida. Al seleccionarlos, se aplicará el estilo _Original_ por defecto.
- **Compatibilidad:** Se recomienda utilizar versiones actualizadas de Node.js y npm para asegurar la compatibilidad con todas las dependencias.
