const express = require("express");
const router = express.Router();
const productosOV = require("../models/productosOV");

// Registro de administradores
router.post("/registro", async (req, res) => {
    const productosRegistrar = productosOV(req.body);
    await productosRegistrar
        .save()
        .then((data) =>
            res.status(200).json(
                {
                    mensaje: "Se añadio un producto a la OV"
                }
            ))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los usuarios colaboradores
router.get("/listar", async (req, res) => {
    const { ordenVenta } = req.query;
    console.log(ordenVenta)
    await productosOV
        .find({ ordenVenta })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los usuarios registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await productosOV
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await productosOV
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un usuario en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await productosOV
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un usuario en especifico
router.get("/obtenerPorOV/:ordenVenta", async (req, res) => {
    const { ordenVenta } = req.params;
    console.log(ordenVenta)
    await productosOV
        .find({ ordenVenta })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un usuario administrador
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await productosOV
        .remove({ _id: id })
        .then((data) => res.status(200).json({ status: "Producto eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar el usuario
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await productosOV
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del producto actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del usuario
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { numeroParte, descripcion, cantidad, um, precioUnitario, total } = req.body;
    await productosOV
        .updateOne({ _id: id }, { $set: { numeroParte, descripcion, cantidad, um, precioUnitario, total } })
        .then((data) => res.status(200).json({ status: "Datos actualizados" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
