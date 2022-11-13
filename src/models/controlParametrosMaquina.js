const mongoose = require("mongoose");
const { Schema } = mongoose;

const controlParametrosMaquina = new Schema({
    general: {
        folio: {type: String},
        fechaElaboracion: {type: String},
        noMaquina: {type: String},
        marca: {type: String},
        tonelaje: {type: String},
        cliente: {type: String},
        noParte: {type: String},
        descripcion: {type: String},
        noCavidades: {type: String},
        tiempoCiclo: {type: String},
        piezasHora: {type: String},
        pesoNetoPieza: {type: String},
        pesoColada: {type: String},
        molido: {type: String},
    },
    mezclaMaterial: {
        material: {type: String},
        virgen: {type: String},
        materialMolido: {type: String},
        pigmento: {type: String},
        aplicacion: {type: String},
        tiempoDesghidratacion: {type: String},
        temperarura: {type: String},
    },
    inyeccion: {
        tiempoInyeccion: {type: Array, default: [] },
        presionInyeccion: {type: Array, default: [] },
        conmutacion: {type: Array, default: [] },
        dosificacion: {type: Array, default: [] },
        tiempoSostenimiento: {type: Array, default: [] },
        presionSostenimiento: {type: Array, default: [] },
        cojinMasa: {type: Array, default: [] },
        descompresion: {type: Array, default: [] },
    },
    perfilPrimeraInyeccion: {
        posicion: {type: Array, default: [] },
        velocidad: {type: Array, default: [] },
        presion: {type: Array, default: [] },
    },
    postPresion: {
        posicion: {type: Array, default: [] },
        velocidad : {type: Array, default: [] },
    },
    calefaccionMolde: {
        imagen1: {type: String},
        imagen2: {type: String},
        vistaPosterioMaquina: {type: Array, default: [] },
    },
    descripcion: {type: String},
    elaboro: {type: String},
    reviso: {type: String},
    aprovo: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("ControlParametrosMaquina", controlParametrosMaquina, "ControlParametrosMaquina");