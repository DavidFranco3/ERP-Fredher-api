const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const devoluciones = require("../models/devoluciones");

// Registro de devoluciones
router.post("/registro", verifyToken,  async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar devoluciones con el mismo folio
    const busqueda = await devoluciones.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe una devolución con este folio"});
    } else {
        const datosDevolucion = devoluciones(req.body);
        await datosDevolucion
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado la devolución", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las devoluciones
router.get("/listar", verifyToken , async (req, res) => {
    await devoluciones
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de devolución actual
router.get("/obtenerNoDevolucion", verifyToken , async (req, res) => {
    const registrodevoluciones = await devoluciones.find().count();
    if(registrodevoluciones === 0){
        res.status(200).json({ noDevolucion: "D-1"})
    } else {
        const ultimaDevolucion = await devoluciones.findOne().sort( { _id: -1 } );
        const tempFolio1 = ultimaCotizacion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noDevolucion: "D-" + tempFolio.toString().padStart(1, 0)})
    }
});

// Listar las devoluciones paginandolos
router.get("/listarPaginando" , verifyToken, async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await devoluciones
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await devoluciones
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una devolucion en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    // console.log("buscando")
    await devoluciones
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una devolución rechazado
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await devoluciones
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Decolución eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la devolución
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { factura, empresa, cliente, rfc, almacen, razonSocial, comentario, vendedor, domicilio, productos, totales } = req.body;
    await devoluciones
        .updateOne({ _id: id }, { $set: { factura, empresa, cliente, rfc, almacen, razonSocial, comentario, vendedor, domicilio, productos, totales } })
        .then((data) => res.status(200).json({ mensaje: "Información de la devolución actualizada"}))
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
