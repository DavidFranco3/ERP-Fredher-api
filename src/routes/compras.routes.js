const express = require("express");
const router = express.Router();
const compras = require("../models/compras");
const { map } = require("lodash");

// Registro de las compras
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar acuses de recibo con el mismo folio
    const busqueda = await compras.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una compra con este folio" });
    } else {
        const elementosComprados = compras(req.body);
        await elementosComprados
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso de la compra", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
    //
});

// Obtener todos las compras
router.get("/listar", async (req, res) => {
    await compras
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos las compras
router.get("/listarDepto", async (req, res) => {
    const { depto } = req.query;

    await compras
        .find({ departamento: depto })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar obteniendo por separado los productos registrados
router.get("/listarProductos", async (req, res) => {
    await compras
        .find()
        .sort({ _id: -1 })
        .then((data) => {
            // res.json(data)
            // console.log(data)
            let datosCompras = []

            map(data, (compra, indexPrincipal) => {
                map(compra.productos, (productos, index) => {
                    const { cantidad, um, descripcion, precio, subtotal } = productos;
                    console.log(productos)
                    datosCompras.push({ id: data[indexPrincipal]._id, folio: data[indexPrincipal].folio, proveedor: data[indexPrincipal].proveedor, fechaSolicitud: data[indexPrincipal].fechaSolicitud, fechaEntrega: data[indexPrincipal].fechaEntrega, descripcion: descripcion, cantidad: cantidad, um: um, precio: precio, subtotal: subtotal, total: data[indexPrincipal].total })
                    console.log(datosCompras)
                })
            })
            res.status(200).json(datosCompras)
        })
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los elementos de las compras
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await compras
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los elementos de las compras
router.get("/listarPaginandoDepto", async (req, res) => {
    const { pagina, limite, depto } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await compras
        .find({ departamento: depto })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/totalDepto", async (req, res) => {
    const { depto } = req.query;

    await compras
        .find({ departamento: depto })
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await compras
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una compras
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await compras
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos de una compra segun el folio
router.get("/obtenerDatosCompra/:folio", async (req, res) => {
    const { folio } = req.params;

    await compras
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerNoCompra", async (req, res) => {
    const registroCompras = await compras.find().count();
    if (registroCompras === 0) {
        res.status(200).json({ noCompra: "OC-1" })
    } else {
        const ultimaCompra = await compras.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaCompra.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noCompra: "OC-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
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
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await compras
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Compra eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await compras
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la compra actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de orden de compra
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { fechaSolicitud, proveedor, nombreProveedor, fechaEntrega, tipoCompra, autoriza, productos, subtotal, iva, total } = req.body;
    await compras
        .updateOne({ _id: id }, { $set: { fechaSolicitud, proveedor, nombreProveedor, tipoCompra, fechaEntrega, autoriza, productos, subtotal, iva, total } })
        .then((data) => res.status(200).json({ mensaje: "Compra actualizada", datos: data }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
