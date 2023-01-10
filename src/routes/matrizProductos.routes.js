const express = require("express");
const router = express.Router();
const productos = require("../models/matrizProductos");
const { map } = require("lodash")

// Para registrar productos
router.post("/registro", async (req, res) => {
    const { noInterno, sucursal } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar productos con el mismo numero interno
    const busqueda = await productos.findOne({ noInterno });

    if (busqueda && busqueda.noInterno === noInterno && busqueda.sucursal === sucursal) {
        return res.status(401).json({ mensaje: "Ya existe un producto con este número interno" });
    } else {
        const productoRegistrar = productos(req.body);
        await productoRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado el producto" }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Para obtener el listado de productos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await productos
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener el listado de productos activos
router.get("/listarActivos", async (req, res) => {
    const { sucursal } = req.query;
    
    await productos
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => {
            const tempdata = []
            map(data, (producto, index) => {
                if (producto.estado === "true") {
                    tempdata.push(producto)
                }
            })
            res.status(200).json(tempdata);
        })
        .catch((error) => res.json({ message: error }));
});

// Para obtener el listado de productos obsoletos
router.get("/listarObsoletos", async (req, res) => {
    await productos
        .find()
        .sort({ _id: -1 })
        .then((data) => {
            const tempdata = []
            map(data, (producto, index) => {
                if (producto.estado === "false") {
                    tempdata.push(producto)
                }
            })
            res.status(200).json(tempdata);
        })
        .catch((error) => res.json({ message: error }));
});

// Para listar los productos paginando
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await productos
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await productos
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener los datos de un pedido en especifico segun el id especificado
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await productos
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener los datos de un producto del catalogo en especifico segun el numero interno
router.get("/obtenerPorNoInterno/:noInterno", async (req, res) => {
    const { noInterno } = req.params;
    //console.log("buscando")
    await productos
        .findOne({ noInterno })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para eliminar productos
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await productos
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Producto eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de los productos
router.put("/actualizarestado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await productos
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Informacion del producto actualizada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar los datos de los productos
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { noInterno, cliente, nombreCliente, datosMolde, noParte, descripcion, precioVenta, datosPieza, materiaPrima, pigmentoMasterBach, tiempoCiclo, noOperadores, piezasxHora, piezasxTurno, materialEmpaque, opcionMaquinaria, estado } = req.body;

    const busqueda = await productos.findOne({ noInterno });

    if (busqueda && busqueda.noInterno === noInterno && busqueda._id != id) {
        return res.status(401).json({ mensaje: "Ya existe un producto con este número interno" });
    } else {
        await productos
            .updateOne({ _id: id }, { $set: { noInterno, cliente, nombreCliente, datosMolde, noParte, descripcion, precioVenta, datosPieza, materiaPrima, pigmentoMasterBach, tiempoCiclo, noOperadores, piezasxHora, piezasxTurno, materialEmpaque, opcionMaquinaria, estado } })
            .then((data) => res.status(200).json({ mensaje: "Informacion del producto actualizada" }))
            .catch((error) => res.json({ message: error }));
    }
});

module.exports = router;
