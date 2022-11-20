const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const inspeccionPieza = require("../models/inspeccionPieza");

// Registro de inspecciones
router.post("/registro",  async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar inspecciones con el mismo folio
    const busqueda = await inspeccionPieza.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe una inspeccion de pieza con este folio"});
    } else {
        const inspecciones = inspeccionPieza(req.body);
        await inspecciones
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado la inspeccion de pieza", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos las inspecciones
router.get("/listar", verifyToken , async (req, res) => {
    await inspeccionPieza
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de inspeccion
router.get("/obtenerNoInspeccion", verifyToken , async (req, res) => {
    const registroInspeccionPieza = await inspeccionPieza.find().count();
    if(registroInspeccionPieza === 0){
        res.status(200).json({ noInspeccion: "IPP-1"})
    } else {
        const ultimaInspeccion = await inspeccionPieza.findOne().sort( { _id: -1 } );
        const tempFolio1 = ultimaInspeccion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noInspeccion: "IPP-" + tempFolio.toString().padStart(1, 0)})
    }
});

// Listar las inspecciones de pieza registradas
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await inspeccionPieza
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una inspeccion en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await inspeccionPieza
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await inspeccionPieza
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una inspeccion de pieza segun el folio
router.get("/obtenerDatosInspeccion/:folio", verifyToken ,async (req, res) => {
    const { folio } = req.params;

    await inspeccionPieza
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una inspeccion
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await inspeccionPieza
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Inspeccion eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado de la inspeccion de pieza
router.put("/actualizarEstado/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { motivoCancelacion, status } = req.body;
    await inspeccionPieza
        .updateOne({ _id: id }, { $set: { motivoCancelacion, status } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la inspeccion de pieza actualizado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la inspeccion
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { fechaElaboracion, fechaEntrega, cliente, incoterms, especificaciones, condicionesPago, ordenCompra, cotizacion, numeroPedido, lugarEntrega, total, productos } = req.body;
    await inspeccionPieza
        .updateOne({ _id: id }, { $set: { fechaElaboracion, fechaEntrega, cliente, incoterms, especificaciones, condicionesPago, ordenCompra, cotizacion, numeroPedido, lugarEntrega, total, productos } })
        .then((data) => res.status(200).json({ mensaje: "Información de la inspeccion de pieza actualizada"}))
        .catch((error) => res.json({ message: error }));
});

async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({mensaje: "Petición no Autorizada"});
        }
        let token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            return res.status(401).send({mensaje: "Petición no Autorizada"});
        }

        const payload = await jwt.verify(token, 'secretkey');
        if(await isExpired(token)) {
            return res.status(401).send({mensaje: "Token Invalido"});
        }
        if (!payload) {
            return res.status(401).send({mensaje: "Petición no Autorizada"});
        }
        req._id = payload._id;
        next();
    } catch(e) {
        //console.log(e)
        return res.status(401).send({mensaje: "Petición no Autorizada"});
    }
}

async function isExpired(token) {
    const { exp } = jwtDecode(token);
    const expire = exp * 1000;
    const timeout = expire - Date.now()

    if (timeout < 0){
        return true;
    }
    return false;
}

module.exports = router;
