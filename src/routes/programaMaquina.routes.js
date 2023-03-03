const express = require("express");
const router = express.Router();
const programaMaquina = require("../models/programaMaquina");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar programas de maquina con el mismo folio
    const busqueda = await programaMaquina.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un programa de maquina con este folio" });
    } else {
        const programas = programaMaquina(req.body);
        await programas
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el programa de maquina", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await programaMaquina
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de maquina
router.get("/obtenerNoMaquina", async (req, res) => {
    const registroProgramaMaquina = await programaMaquina.find().count();
    if (registroProgramaMaquina === 0) {
        res.status(200).json({ noMaquina: "MAQ-1" })
    } else {
        const ultimaMaquina = await pedidoMaquina.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaMaquina.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noMaquina: "MAQ-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los programas de maquina registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await programaMaquina
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
    await programaMaquina
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await programaMaquina
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un programa de maquina segun el folio
router.get("/obtenerDatosPedido/:folio", async (req, res) => {
    const { folio } = req.params;

    await programaMaquina
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await programaMaquina
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Pedido eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del programa maquina
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await programaMaquina
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado del programa de maquina actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { fechaElaboracion, fechaEntrega, cliente, incoterms, especificaciones, condicionesPago, ordenCompra, cotizacion, numeroPedido, lugarEntrega, total, productos } = req.body;
    await programaMaquina
        .updateOne({ _id: id }, { $set: { fechaElaboracion, fechaEntrega, cliente, incoterms, especificaciones, condicionesPago, ordenCompra, cotizacion, numeroPedido, lugarEntrega, total, productos } })
        .then((data) => res.status(200).json({ mensaje: "Información del programa de maquina actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
