const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const statusMaterial = require("../models/statusMaterial");

// Registro de pedidos
router.post("/registro",  async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar status material con el mismo folio
    const busqueda = await statusMaterial.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe un status de material con este folio"});
    } else {
        const status = statusMaterial(req.body);
        await status
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado el status de material", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", verifyToken , async (req, res) => {
    await statusMaterial
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de status de material
router.get("/obtenerNoStatus", verifyToken , async (req, res) => {
    const RegistroStatus = await statusMaterial.find().count();
    if(RegistroStatus === 0){
        res.status(200).json({ noStatus: "ISM-1"})
    } else {
        const ultimoStatus = await statusMaterial.findOne().sort( { _id: -1 } );
        const tempFolio1 = ultimoStatus.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noStatus: "ISM-" + tempFolio.toString().padStart(1, 0)})
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", verifyToken, async (req, res) => {
    const registroStatus = await statusMaterial.find().count();
    if (registroStatus === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await statusMaterial
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});
// Listar los status de material registrados
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await statusMaterial
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
    await statusMaterial
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await statusMaterial
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un status de material segun el folio
router.get("/obtenerDatosStatus/:folio", verifyToken ,async (req, res) => {
    const { folio } = req.params;

    await statusMaterial
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await statusMaterial
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Pedido eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del status de material
router.put("/actualizarEstado/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await statusMaterial
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado del status de material actualizado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { folioInspeccion, propiedadInspeccion, cantidadInspeccion, fechaInspeccion, tipoMaterialInspeccion, recibioInspeccion, loteInspeccion, nombreInspeccion, resultadoInspeccion, etiqueta, fecha, descripcionMaterial, rechazo, nombre, auditor, supervisor, descripcionDefecto, cantidad, tipoRechazo, correccion, clienteProveedor, lote, recibio, turno, propiedad, liberacion, descripcion, comentarios, condicion, observaciones } = req.body;
    await statusMaterial
        .updateOne({ _id: id }, { $set: { folioInspeccion, propiedadInspeccion, cantidadInspeccion, fechaInspeccion, tipoMaterialInspeccion, recibioInspeccion, loteInspeccion, nombreInspeccion, resultadoInspeccion, etiqueta, fecha, descripcionMaterial, rechazo, nombre, auditor, supervisor, descripcionDefecto, cantidad, tipoRechazo, correccion, clienteProveedor, lote, recibio, turno, propiedad, liberacion, descripcion, comentarios, condicion, observaciones } })
        .then((data) => res.status(200).json({ mensaje: "Información del status de material actualizada"}))
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
