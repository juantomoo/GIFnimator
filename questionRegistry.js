const framer = require("./framer");
const rescaler = require("./rescaler");
const estilo = require("./estilo");

const preguntasFramer = framer.preguntasFramer;
const preguntasRescaler = rescaler.preguntasRescaler;
const preguntasEstilo = estilo.preguntasEstilo;

const registry = [preguntasFramer, preguntasRescaler, preguntasEstilo];

module.exports = registry;
