const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const maquina = require("../models/maquinas");

// Para registrar maquinas
router.post("/registro", verifyToken ,  async (req, res) => {
    const { numeroMaquina } = req.body;
    //console.log(folio)
    // Inicia validacion para no registrar productos con el mismo numero interno
    const busqueda = await maquina.findOne({ numeroMaquina });

    if (busqueda && busqueda.item === item) {
        return res.status(401).json({mensaje: "Ya existe registros de la maquina"});
    } else {
        const maquinaRegistrar = maquina(req.body);
        await maquinaRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado la maquina" }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Para obtener el listado de maquinas
router.get("/listar", verifyToken , async (req, res) => {
    await maquina
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para listar paginando de las maquinas
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await maquina
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await maquina
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener datos de una maquina
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await maquina
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos de la maquina segun el numero
router.get("/obtenerPorNumero/:numeroMaquina", verifyToken ,async (req, res) => {
    const { numeroMaquina } = req.params;
    //console.log("buscando")
    await maquina
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para eliminar maquinas
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await maquina
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Maquina eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstado/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await maquina
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la maquina actualizado"}))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar los datos de las maquinas
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { numeroMaquina, marca, tonelaje, lugar } = req.body;
    await maquina
        .updateOne({ _id: id }, { $set: { numeroMaquina, marca, tonelaje, lugar } })
        .then((data) => res.status(200).json({ mensaje: "Maquina actualizada"}))
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
