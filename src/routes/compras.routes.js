const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const compras = require("../models/compras");
const { map } = require("lodash");

// Registro de las compras
router.post("/registro", verifyToken,  async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar acuses de recibo con el mismo folio
    const busqueda = await compras.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe una compra con este folio"});
    } else {
        const elementosComprados = compras(req.body);
        await elementosComprados
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Registro exitoso de la compra", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
    //
});

// Obtener todos las compras
router.get("/listar", verifyToken , async (req, res) => {
    await compras
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar obteniendo por separado los productos registrados
router.get("/listarProductos", verifyToken , async (req, res) => {
    await compras
        .find()
        .sort( { _id: -1 } )
        .then((data) => {
            // res.json(data)
            // console.log(data)
            let datosCompras = []

            map(data, (compra , indexPrincipal) => {
                map(compra, (productos, index) => {
                    const { cantidad, um, descripcion, precio, subtotal } = productos;
                    console.log(productos)
                    datosCompras.push({ folio: data[indexPrincipal].folio, proveedor: data[indexPrincipal].proveedor, fechaSolicitud: data[indexPrincipal].fechaSolicitud, fechaEntrega: data[indexPrincipal].fechaEntrega, descripcion: descripcion, cantidad: cantidad, total: data[indexPrincipal].total })
                })
            })
            res.status(200).json(datosCompras)
        })
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los elementos de las compras
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await compras
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los elementos de las compras
router.get("/listarPaginandoDepto" , async (req, res) => {
    const { pagina, limite, depto } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await compras
        .find({ departamento: depto })
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/totalDepto", verifyToken , async (req, res) => {
    const { depto } = req.query;
    
    await compras
        .find({ departamento: depto })
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await compras
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una compras
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await compras
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos de una compra segun el folio
router.get("/obtenerDatosCompra/:folio", verifyToken ,async (req, res) => {
    const { folio } = req.params;

    await compras
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerNoCompra", verifyToken , async (req, res) => {
    const registroCompras = await compras.find().count();
    if(registroCompras === 0){
        res.status(200).json({ noCompra: "OC-1"})
    } else {
        const ultimaCompra = await compras.findOne().sort( { _id: -1 } );
        const tempFolio1 = ultimaCompra.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noCompra: "OC-" + tempFolio.toString().padStart(1, 0)})
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", verifyToken, async (req, res) => {
    const registroCompras = await compras.find().count();
    if (registroCompras === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await compras
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Borrar una compra
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await compras
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Compra eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstado/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await compras
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la compra actualizado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de orden de compra
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { fechaSolicitud, proveedor, fechaEntrega, autoriza, productos, subtotal, iva, total } = req.body;
    await compras
        .updateOne({ _id: id }, { $set: { fechaSolicitud, proveedor, fechaEntrega, autoriza, productos, subtotal, iva, total } })
        .then((data) => res.status(200).json({ mensaje: "Compra actualizada", datos: data}))
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
