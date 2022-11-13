const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const planeacion = require("../models/planeacion");

// Registro de planeación
router.post("/registro",  async (req, res) => {
    const { folio } = req.body;

    // Inicia validacion para no registrar planeaciones con el mismo folio
    const busqueda = await planeacion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe una planeación con este folio"});
    } else {
        const pedidos = planeacion(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado la planeación", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las planeaciones
router.get("/listar", verifyToken , async (req, res) => {
    await planeacion
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio de la planeación
router.get("/obtenerFolio", verifyToken , async (req, res) => {
    const registroPedidosVenta = await planeacion.find().count();
    if(registroPedidosVenta === 0){
        res.status(200).json({ noPlaneacion: "P-1"})
    } else {
        const ultimaPlaneacion = await planeacion.findOne().sort( { _id: -1 } );
        const tempFolio1 = ultimaPlaneacion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noPlaneacion: "P-" + tempFolio.toString().padStart(1, 0)})
    }
});

// Listar las planeaciones registradas paginandolas
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await planeacion
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await planeacion
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una planeacion en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await planeacion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una planeación segun el folio
router.get("/obtenerDatos/:folio", verifyToken ,async (req, res) => {
    const { folio } = req.params;

    await planeacion
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una planeación segun un orden de venta
router.get("/obtenxOrdenVenta/:ordenVenta", verifyToken ,async (req, res) => {
    const { ordenVenta } = req.params;

    await planeacion
        .findOne({ ordenVenta })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una planeación
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await planeacion
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Planeación eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar, dando visto bueno a planeación, por producto
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { productos, detalles, estado } = req.body;
    await planeacion
        .updateOne({ _id: id }, { $set: { productos, detalles, estado } })
        .then((data) => res.status(200).json({ mensaje: "Cambio de estado de aprobacion completado"}))
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
