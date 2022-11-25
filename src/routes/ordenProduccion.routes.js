const express = require("express");
const router = express.Router();
const ordenProduccion = require("../models/ordenProduccion");

// Registro de una orden de producción
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar ordenes de producción con el mismo numero interno
    const busqueda = await ordenProduccion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe una orden de producción con este folio"});
    } else {
        const produccion = ordenProduccion(req.body);
        await produccion
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado una orden de producción", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las ordenes de producción
router.get("/listar", async (req, res) => {
    await ordenProduccion
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio actual
router.get("/obtenerFolioActual", async (req, res) => {
    const registroOrdenesProduccion = await ordenProduccion.find().count();
    if(registroOrdenesProduccion === 0){
        res.status(200).json({ noInterno: "1"})
    } else {
        const ultimaOrden = await ordenProduccion.findOne().sort( { _id: -1 } );
        //console.log(ultimaOrden)
        const tempFolio = parseInt(ultimaOrden.folio) + 1
        res.status(200).json({ noInterno: tempFolio.toString()})
    }
});

// Listar paginando las ordenes de producción registradas
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await ordenProduccion
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await ordenProduccion
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una orden de producción en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await ordenProduccion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una orden de producción segun el numero interno
router.get("/obtenerDatos/:noInterno", async (req, res) => {
    const { noInterno } = req.params;

    await ordenProduccion
        .findOne({ noInterno })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una orden de producción
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await ordenProduccion
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Orden de producción eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la orden de producción
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { noInterno, nombreProducto, noParte, cliente, planeacion, BOM, piezas, materiaPrima, notasImportantes, elaboro } = req.body;
    await ordenProduccion
        .updateOne({ _id: id }, { $set: { noInterno, nombreProducto, noParte, cliente, planeacion, BOM, piezas, materiaPrima, notasImportantes, elaboro } })
        .then((data) => res.status(200).json({ mensaje: "Información de la orden de producción actualizada"}))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
