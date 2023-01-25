const express = require("express");
const router = express.Router();
const departamentos = require("../models/departamentos");

// Registro de departamentos
router.post("/registro", async (req, res) => {
    const departamento = departamentos(req.body);
    await departamento
        .save()
        .then((data) =>
            res.status(200).json(
                {
                    mensaje: "Registro exitoso del departamento"
                }
            ))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los departamentos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await departamentos
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los departamentos
router.get("/listarActivos", async (req, res) => {
    const { sucursal } = req.query;

    await departamentos
        .find({ sucursal, estado: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await departamentos
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los departamentos registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await departamentos
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un departamentos en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await departamentos
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un usuario departamentos
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await departamentos
        .remove({ _id: id })
        .then((data) => res.status(200).json({ status: "Departamento eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await departamentos
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del departamento actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del departamentos
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    await departamentos
        .updateOne({ _id: id }, { $set: { nombre } })
        .then((data) => res.status(200).json({ status: "Departamento actualizado" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
