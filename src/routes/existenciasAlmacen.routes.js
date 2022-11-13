const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const existenciasAlmacen = require("../models/existenciasAlmacen");

// Registro de existencias en almacen
router.post("/registro", verifyToken, async (req, res) => {
    const { clave } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar existencias de almacen con la misma clave
    const busqueda = await existenciasAlmacen.findOne({ clave });

    if (busqueda && busqueda.clave === clave) {
        return res.status(401).json({mensaje: "Ya existe una existencia en almacen con esta clave"});
    } else {
        const salida = existenciasAlmacen(req.body);
        await salida
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado una existencia en almacen", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las existencias de almacen
router.get("/listar", verifyToken, async (req, res) => {
    await existenciasAlmacen
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las existencias de almacen
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await existenciasAlmacen
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await existenciasAlmacen
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una existencia de almacen en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await existenciasAlmacen
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una existencia de almacen segun la clave
router.get("/obtenerDatos/:clave", verifyToken ,async (req, res) => {
    const { clave } = req.params;

    await existenciasAlmacen
        .findOne({ clave })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una existencia del almacen
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await existenciasAlmacen
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Existencia de almacen eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la existencia de almacen
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { movimientos } = req.body;
    await existenciasAlmacen
        .updateOne({ _id: id }, { $set: { movimientos } })
        .then((data) => res.status(200).json({ mensaje: "Información de existencias actualizada"}))
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
