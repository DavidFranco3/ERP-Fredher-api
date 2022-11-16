const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const reportesCalidad = require("../models/calidad");

// Registro de reportes de calidad
router.post("/registro", verifyToken, async (req, res) => {
    const { folio } = req.body;

    // Inicia validacion para no registrar reportes de calidad con el mismo folio
    const busqueda = await reportesCalidad.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya se ha registrado un reporte de calidad con ese folio"});
    } else  {
        const reportesCalidadRegistrar = reportesCalidad(req.body);
        await reportesCalidadRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Registro exitoso del reporte"
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }

});

// Obtener todos los reportes de calidad
router.get("/listar", verifyToken , async (req, res) => {
    await reportesCalidad
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los reportes de calidad
router.get("/listarPaginando" , verifyToken, async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await reportesCalidad
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await reportesCalidad
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una reporte de calidad en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await reportesCalidad
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el actual de folio del reporte de calidad
router.get("/obtenerNoReportesCalidad", verifyToken , async (req, res) => {
    const registroreportesCalidad = await reportesCalidad.find().count();
    if(registroreportesCalidad === 0){
        res.status(200).json({ folioReporte: "1"})
    } else {
        const ultimaReporte = await reportesCalidad.findOne().sort( { _id: -1 } );
        const tempFolio = parseInt(ultimaReporte.folio) + 1
        res.status(200).json({ folioReporte: tempFolio.toString()})
    }
});

// Borrar una reporte
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await reportesCalidad
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Reporte eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del reporte
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { descripcion, noParte, noOrden, cantidad, turno, operador, supervisor, inspector } = req.body;

    await reportesCalidad
        .updateOne({ _id: id }, { $set: { descripcion, noParte, noOrden, cantidad, turno, operador, supervisor, inspector } })
        .then((data) => res.status(200).json({ mensaje: "Datos del reporte actualizados"}))
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
