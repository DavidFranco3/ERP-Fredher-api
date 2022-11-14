const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const reportesProduccion = require("../models/reporteProduccion");

// Registro de reportes de producción
router.post("/registro", verifyToken, async (req, res) => {
    const { folio } = req.body;

    // Inicia validation para no registrar reportes de producción con el mismo folio
    const busqueda = await reportesProduccion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya se ha registrado un reporte de producción con ese folio"});
    } else  {
        const datosReporteProduccion = reportesProduccion(req.body);
        await datosReporteProduccion
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Registro exitoso del reporte de producción"
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }

});

// Obtener todos los reportes de producción
router.get("/listar", verifyToken , async (req, res) => {
    await reportesProduccion
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los reportes de producción
router.get("/listarPaginando" , verifyToken, async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await reportesProduccion
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await reportesProduccion
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un reporte de producción en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await reportesProduccion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el actual de folio del reporte de producción
router.get("/obtenerNoReporte", verifyToken , async (req, res) => {
    const registroReportesProduccion = await reportesProduccion.find().count();
    if(registroReportesProduccion === 0){
        res.status(200).json({ folio: "1"})
    } else {
        const ultimoReporte = await reportesProduccion.findOne().sort( { _id: -1 } );
        const tempFolio = parseInt(ultimoReporte.folio) + 1
        res.status(200).json({ folio: tempFolio.toString()})
    }
});

// Borrar un reporte de producción
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await reportesProduccion
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Reporte eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del reporte de producción
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { supervisor, turno, asistencias, faltas, fecha, registros, eficienciaGeneralMaquinas, observacionesTurno } = req.body;

    await reportesProduccion
        .updateOne({ _id: id }, { $set: {  supervisor, turno, asistencias, faltas, fecha, registros, eficienciaGeneralMaquinas, observacionesTurno } })
        .then((data) => res.status(200).json({ mensaje: "Datos del reporte de producción actualizados"}))
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
