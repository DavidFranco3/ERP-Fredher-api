const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const etiquetasIdentificacionPT = require("../models/etiquetasIdentificacionPT");

// Registro de pedidos
router.post("/registro",  async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar etiquetas con el mismo folio
    const busqueda = await etiquetasIdentificacionPT.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe una etiqueta con este folio"});
    } else {
        const etiquetas = etiquetasIdentificacionPT(req.body);
        await etiquetas
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado la etiqueta", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", verifyToken , async (req, res) => {
    await etiquetasIdentificacionPT
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener de etiqueta
router.get("/obtenerNoEtiquetaPT", verifyToken , async (req, res) => {
    const registroEtiqueta = await etiquetasIdentificacionPT.find().count();
    if(registroEtiqueta === 0){
        res.status(200).json({ noEtiqueta: "EIPT-1"})
    } else {
        const ultimaEtiqueta = await etiquetasIdentificacionPT.findOne().sort( { _id: -1 } );
        const tempFolio1 = ultimaEtiqueta.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noEtiqueta: "EIPT-" + tempFolio.toString().padStart(1, 0)})
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", verifyToken, async (req, res) => {
    const registroEtiquetas = await etiquetasIdentificacionPT.find().count();
    if (registroEtiquetas === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await etiquetasIdentificacionPT
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Listar las etiquetasa registradas
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await etiquetasIdentificacionPT
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un pedido en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await etiquetasIdentificacionPT
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await etiquetasIdentificacionPT
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener unA etiqueta segun el folio
router.get("/obtenerDatosEtiquetaPT/:folio", verifyToken ,async (req, res) => {
    const { folio } = req.params;

    await etiquetasIdentificacionPT
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await etiquetasIdentificacionPT
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Pedido eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado de la etiqueta
router.put("/actualizarEstado/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await etiquetasIdentificacionPT
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la etiqueta actualizado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { fecha, descripcion, noParte, noOrden, cantidad, turno, operador, supervisor, inspector } = req.body;
    await etiquetasIdentificacionPT
        .updateOne({ _id: id }, { $set: { fecha, descripcion, noParte, noOrden, cantidad, turno, operador, supervisor, inspector } })
        .then((data) => res.status(200).json({ mensaje: "Información de la etiqueta actualizada"}))
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
