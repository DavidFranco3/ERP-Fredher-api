const express = require("express");
const router = express.Router();
const maquina = require("../models/maquinas");

// Para registrar maquinas
router.post("/registro", async (req, res) => {
    const { numeroMaquina, sucursal } = req.body;
    //console.log(folio)
    // Inicia validacion para no registrar productos con el mismo numero interno
    const busqueda = await maquina.findOne({ numeroMaquina });

    if (busqueda && busqueda.numeroMaquina === numeroMaquina && busqueda.sucursal === sucursal) {
        return res.status(401).json({ mensaje: "Ya existe una maquina con este numero" });
    } else {
        const maquinaRegistrar = maquina(req.body);
        await maquinaRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado la maquina" }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Para obtener el listado de maquinas
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await maquina
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para listar paginando de las maquinas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await maquina
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await maquina
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener datos de una maquina
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await maquina
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos de la maquina segun el numero
router.get("/obtenerPorNumero/:numeroMaquina", async (req, res) => {
    const { numeroMaquina } = req.params;
    //console.log("buscando")
    await maquina
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para eliminar maquinas
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await maquina
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Maquina eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await maquina
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la maquina actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar los datos de las maquinas
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const {  numeroMaquina, tipoMaquina, nombre, marca, modelo, noSerie,lugar, fechaAdquisicion } = req.body;
    await maquina
        .updateOne({ _id: id }, { $set: {  numeroMaquina, tipoMaquina, nombre, marca, modelo, noSerie,lugar, fechaAdquisicion } })
        .then((data) => res.status(200).json({ mensaje: "Maquina actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
