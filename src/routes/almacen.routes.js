const express = require("express");
const router = express.Router();
const almacenModel = require("../models/almacen");

// Registro de almacen
router.post("/registro",  async (req, res) => {
    const elementosAlmacen = almacenModel(req.body);
    await elementosAlmacen
        .save()
        .then((nombre) =>
            res.status(200).json(
                { mensaje: "Registro exitoso"
                }
            ))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los articulos del almacen
router.get("/listar", async (req, res) => {
    await almacenModel
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await almacenModel
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los elementos del almacen
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await almacenModel
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un elemento del almacen
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await almacenModel
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un elemento del almacen
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await almacenModel
        .remove({ _id: id })
        .then((data) => res.status(200).json({ status: "Articulo eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de algun elemento del almacen
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { folio, factura, entradaSinFactura, fechaEntrada, fechaSalida, proveedor, almacen, empresa, clase, referenciaCalidad, productos } = req.body;
    await almacenModel
        .updateOne({ _id: id }, { $set: { folio, factura, entradaSinFactura, fechaEntrada, fechaSalida, proveedor, almacen, empresa, clase, referenciaCalidad, productos } })
        .then((data) => res.status(200).json({ status: "Articulo actualizado"}))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
