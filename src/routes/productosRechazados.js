const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const productosrechazados = require("../models/productosRechazados");

// Registro de productos rechazados
router.post("/registro",  async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar productos rechazados con el mismo folio
    const busqueda = await productosrechazados.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe un rechazo con este folio"});
    } else {
        const datosRechazo = productosrechazados(req.body);
        await datosRechazo
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado el rechazo", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas la productos rechazados
router.get("/listar", verifyToken , async (req, res) => {
    await productosrechazados
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de rechazo actual
router.get("/obtenerNoRechazo", verifyToken , async (req, res) => {
    const registroproductosrechazados = await productosrechazados.find().count();
    if(registroproductosrechazados === 0){
        res.status(200).json({ noRechazo: "1"})
    } else {
        const ultimoRechazo = await productosrechazados.findOne().sort( { _id: -1 } );
        //console.log(ultimaRemision)
        const tempFolio = parseInt(ultimoRechazo.folio) + 1
        res.status(200).json({ noRechazo: tempFolio.toString()})
    }
});

// Listar los productos rechazados paginandolos
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await productosrechazados
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await productosrechazados
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un producto rechazado en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    // console.log("buscando")
    await productosrechazados
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un producto rechazado
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await productosrechazados
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Rechazo eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del rechazo
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { idRemision, productos, cantidadRechazada } = req.body;
    await productosrechazados
        .updateOne({ _id: id }, { $set: { idRemision, productos, cantidadRechazada } })
        .then((data) => res.status(200).json({ mensaje: "Información del rechazo actualizada"}))
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
