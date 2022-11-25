const express = require("express");
const router = express.Router();
const encuestaSatisfaccion = require("../models/encuestaSatisFaccion");

// Registro de encuestas de satisfaccion
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar encuestas de satisfaccion con el mismo folio
    const busqueda = await encuestaSatisfaccion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe una encuesta de satisfación con este folio"});
    } else {
        const pedidos = encuestaSatisfaccion(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado una encuesta de satisfacción", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las encuestas de satisfacción
router.get("/listar", async (req, res) => {
    await encuestaSatisfaccion
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio actual
router.get("/obtenerFolioActual", async (req, res) => {
    const registroEncuestasSatisfaccion= await encuestaSatisfaccion.find().count();
    if(registroEncuestasSatisfaccion === 0){
        res.status(200).json({ noEncuesta: "1"})
    } else {
        const ultimaEncuesta = await encuestaSatisfaccion.findOne().sort( { _id: -1 } );
        //console.log(ultimaEncuesta)
        const tempFolio = parseInt(ultimaEncuesta.folio) + 1
        res.status(200).json({ noEncuesta: tempFolio.toString()})
    }
});

// Listar paginando las encuestas de satisfacción registradas
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await encuestaSatisfaccion
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await encuestaSatisfaccion
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una encuesta en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await encuestaSatisfaccion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una encuesta de satisfaccion segun el folio
router.get("/obtenerDatos/:folio", async (req, res) => {
    const { folio } = req.params;

    await encuestaSatisfaccion
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una encuesta de satisfacción
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await encuestaSatisfaccion
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Encuesta de satisfacción eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la encuesta de satisfacción
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { folio, datosCliente, encuesta } = req.body;
    await encuestaSatisfaccion
        .updateOne({ _id: id }, { $set: { folio, datosCliente, encuesta } })
        .then((data) => res.status(200).json({ mensaje: "Información de la encuesta de satisfacción actualizada"}))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
