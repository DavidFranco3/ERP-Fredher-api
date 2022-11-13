const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const acusesRecibo = require("../models/acusesRecibo");

// Registro de acuses de recibo
router.post("/registro", verifyToken,  async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar acuses de recibo con el mismo folio
    const busqueda = await acusesRecibo.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe un acuse de recibo con este folio"});
    } else {
        const datosAcusesRecibo = acusesRecibo(req.body);
        await datosAcusesRecibo
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado el acuse de recibo", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los acuses de recibo
router.get("/listar", verifyToken , async (req, res) => {
    await acusesRecibo
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de acuse de recibo actual
router.get("/obtenerNoAcuseRecibo", verifyToken , async (req, res) => {
    const registroacusesRecibo = await acusesRecibo.find().count();
    if(registroacusesRecibo === 0){
        res.status(200).json({ noAcuseRecibo: "AR-1"})
    } else {
        const ultimoAcuseRecibo = await acusesRecibo.findOne().sort( { _id: -1 } );
        const tempFolio1 = ultimoAcuseRecibo.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noAcuseRecibo: "AR-" + tempFolio.toString().padStart(1, 0)})
    }
});

// Listar los acuses de recibo paginandolos
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await acusesRecibo
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await acusesRecibo
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un acuse de recibo en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    // console.log("buscando")
    await acusesRecibo
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un acuse de recibo
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await acusesRecibo
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Acuse de recibo eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del acuse de recibo
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { idRemision, productos, cantidadAceptada } = req.body;
    await acusesRecibo
        .updateOne({ _id: id }, { $set: { idRemision, productos, cantidadAceptada } })
        .then((data) => res.status(200).json({ mensaje: "Información del acuse de recibo actualizada"}))
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
