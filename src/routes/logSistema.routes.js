const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const logs = require("../models/LogGeneral");

// Registro de logs
router.post("/registro",  async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar logs con el mismo folio
    const busqueda = await logs.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe un log con este folio"});
    } else {
        const logRegistrar = logs(req.body);
        await logRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Seguimiento del usuario iniciado ...."
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los logs
router.get("/listar", verifyToken , async (req, res) => {
    await logs
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de log
router.get("/obtenerNoLog", verifyToken , async (req, res) => {
    const registroLogs = await logs.find().count();
    if(registroLogs === 0){
        res.status(200).json({ noLog: "1"})
    } else {
        const ultimoLog = await logs.findOne().sort( { _id: -1 } );
        const tempFolio = parseInt(ultimoLog.folio) + 1
        res.status(200).json({ noLog: tempFolio.toString()})
    }
});

// Listar los logs paginando
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await logs
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await logs
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un log en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await logs
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un log --
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await logs
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Log eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del log
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { usuario, correo, dispositivo, descripcion, detalles } = req.body;
    await logs
        .updateOne({ _id: id }, { $set: { usuario, correo, dispositivo, descripcion, detalles } })
        .then((data) => res.status(200).json({ mensaje: "Seguimiento del log actualizado ...."}))
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
