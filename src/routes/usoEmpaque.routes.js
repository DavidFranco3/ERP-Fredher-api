const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const usoEmpaques = require("../models/usoEmpaque");

// Registro de uso de empaque
router.post("/registro", verifyToken, async (req, res) => {
    const { clave } = req.body;
    //console.log(clave)

    // Inicia validacion para no registrar uso de empaque con la misma clave
    const busqueda = await usoEmpaques.findOne({ clave });

    if (busqueda && busqueda.clave === clave) {
        return res.status(401).json({mensaje: "Ya existe un uso de empaque con este folio"});
    } else {
        const empaque = usoEmpaques(req.body);
        await empaque
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado un uso de empaque", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los usos de empaque registrados
router.get("/listar", verifyToken , async (req, res) => {
    await usoEmpaques
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los usos de empaque registrados
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await usoEmpaques
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await usoEmpaques
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un uso de empaque en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await usoEmpaques
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un uso de empaque segun la clave
router.get("/obtenerDatos/:clave", verifyToken ,async (req, res) => {
    const { clave } = req.params;

    await usoEmpaques
        .findOne({ clave })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un uso de empaque
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await usoEmpaques
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Uso de empaque eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del uso de empaque
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { descripcion, inventarioInicial, productos, cantidadxUM } = req.body;
    await usoEmpaques
        .updateOne({ _id: id }, { $set: { descripcion, inventarioInicial, productos, cantidadxUM } })
        .then((data) => res.status(200).json({ mensaje: "Información de la salida de planta actualizada"}))
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
