const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const requerimientosEspecificos = require("../models/requerimientosEspecificos");

// Registro de requerimientos especificos
router.post("/registro", verifyToken,  async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar un requerimiento especifico con el mismo folio
    const busqueda = await requerimientosEspecificos.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe un requerimiento con este folio"});
    } else {
        const requerimiento = requerimientosEspecificos(req.body);
        await requerimiento
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado un requerimiento", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los requerimientos
router.get("/listar", verifyToken , async (req, res) => {
    await requerimientosEspecificos
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio actual
router.get("/obtenerFolioActual", verifyToken , async (req, res) => {
    const registroRequerimientos = await requerimientosEspecificos.find().count();
    if(registroRequerimientos === 0){
        res.status(200).json({ noRequerimiento: "1"})
    } else {
        const ultimoRequerimiento = await requerimientosEspecificos.findOne().sort( { _id: -1 } );
        //console.log(ultimoRequerimiento)
        const tempFolio = parseInt(ultimoRequerimiento.folio) + 1
        res.status(200).json({ noRequerimiento: tempFolio.toString()})
    }
});

// Listar paginando los requerimientos registrados
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await requerimientosEspecificos
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await requerimientosEspecificos
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una requerimiento en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await requerimientosEspecificos
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un requerimiento especifico segun el folio
router.get("/obtenerDatos/:folio", verifyToken ,async (req, res) => {
    const { folio } = req.params;

    await requerimientosEspecificos
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un requerimiento especifico
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await requerimientosEspecificos
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Requerimiento especifico eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del requerimiento
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { folio, nombreProducto, cliente, nombreQuienElabora, especificacionesProducto, materiales, maquinaria, herramental, empaques, entregas } = req.body;
    await requerimientosEspecificos
        .updateOne({ _id: id }, { $set: { folio, nombreProducto, cliente, nombreQuienElabora, especificacionesProducto, materiales, maquinaria, herramental, empaques, entregas } })
        .then((data) => res.status(200).json({ mensaje: "Información del requerimiento actualizado"}))
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
