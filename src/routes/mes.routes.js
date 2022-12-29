const express = require("express");
const router = express.Router();
const mes = require("../models/mes");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar meses con el mismo folio
    const busqueda = await mes.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un mes con este folio" });
    } else {
        const pedidos = mes(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el mes", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await mes
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de mes
router.get("/obtenerNoMes", async (req, res) => {
    const registroMeses = await mes.find().count();
    if (registroMeses === 0) {
        res.status(200).json({ noMes: "PRD-1" })
    } else {
        const ultimoMes = await mes.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoMes.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noMes: "PRD-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los meses registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await mes
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un pedido en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await mes
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await mes
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un mes segun el folio
router.get("/obtenerDatosPedido/:folio", async (req, res) => {
    const { folio } = req.params;

    await mes
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await mes
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Pedido eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del mes
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await mes
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado del mes actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { mes, dias, noMaquinas } = req.body;
    await mes
        .updateOne({ _id: id }, { $set: { mes, dias, noMaquinas } })
        .then((data) => res.status(200).json({ mensaje: "Información del pedido de venta actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
