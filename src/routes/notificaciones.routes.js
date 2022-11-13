const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const notificaciones = require("../models/notificaciones");

// Registro de notificaciones
router.post("/registro", verifyToken, async (req, res) => {
    const notificacionesRegistrar = notificaciones(req.body);
    await notificacionesRegistrar
        .save()
        .then((data) =>
            res.status(200).json(
                { mensaje: "Registro exitoso de la notificación"
                }
            ))
        .catch((error) => res.json({ message: error }));

});

// Obtener todos los notificaciones
router.get("/listar", verifyToken , async (req, res) => {
    await notificaciones
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las notificaciones
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await notificaciones
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar las notificaciones por departamento
router.get("/listarPorDepartamento", verifyToken , async (req, res) => {
    const { departamento } = req.query;

    await notificaciones
        .find({ departamentoDestino: departamento })
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una notificacion en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await notificaciones
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una notificación
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await notificaciones
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Notificación eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Cambiar status de una notificación
router.put("/cambiarEstado/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { estadoNotificacion } = req.body;
    await notificaciones
        .updateOne({ _id: id }, { $set: { estadoNotificacion } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la notificación actualizado"}))
        .catch((error) => res.json({ message: error }));
});

router.put("/eliminaVista/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await notificaciones
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Notificación eliminada de la vista"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del notificaciones
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { titulo, url, detalles, departamentoEmite, departamentoDestino } = req.body;

    await notificaciones
        .updateOne({ _id: id }, { $set: { titulo, url, detalles, departamentoEmite, departamentoDestino } })
        .then((data) => res.status(200).json({ mensaje: "Datos de la notificación actualizada"}))
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
