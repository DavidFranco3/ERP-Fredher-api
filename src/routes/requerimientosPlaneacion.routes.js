const express = require("express");
const router = express.Router();
const requerimientosPlaneacion = require("../models/requerimientosPlaneacion");
const { map } = require("lodash");

// Registro de las compras
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar acuses de recibo con el mismo folio
    const busqueda = await requerimientosPlaneacion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una planeación con este folio" });
    } else {
        const requerimiento = requerimientosPlaneacion(req.body);
        await requerimiento
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso del requerimiento", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
    //
});

// Obtener todos las compras
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await requerimientosPlaneacion
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos las compras
router.get("/listarPorSemana", async (req, res) => {
    const { sucursal, semana } = req.query;

    await requerimientosPlaneacion
        .find({ sucursal, semana })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos las compras
router.get("/listarActivas", async (req, res) => {
    const { sucursal } = req.query;

    await requerimientosPlaneacion
        .find({ sucursal, estado: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los elementos de las compras
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await requerimientosPlaneacion
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await requerimientosPlaneacion
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
    await requerimientosPlaneacion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos de una compra segun el folio
router.get("/obtenerDatosRequerimiento/:folio", async (req, res) => {
    const { folio } = req.params;

    await requerimientosPlaneacion
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerNoRequerimiento", async (req, res) => {
    const requerimiento = await requerimientosPlaneacion.find().count();
    if (requerimiento === 0) {
        res.status(200).json({ noRequerimiento: "PLA-1" })
    } else {
        const ultimoRequerimiento = await requerimientosPlaneacion.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoRequerimiento.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noRequerimiento: "PLA-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroRequerimiento = await requerimientosPlaneacion.find().count();
    if (registroRequerimiento === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await requerimientosPlaneacion
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
    await requerimientosPlaneacion
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Planeación eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Planeación cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstadoLT1/:id", async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { programa } })
        .then((data) => res.status(200).json({ mensaje: programa.estadoLT1 == "true" ? "Se habilito el primer turno del lunes" : "Se inhabilito el primer turno del lunes" }))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstadoLT2/:id", async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { programa } })
        .then((data) => res.status(200).json({ mensaje: programa.estadoLT2 == "true" ? "Se habilito el segundo turno del lunes" : "Se inhabilito el segundo turno del lunes"}))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstadoMT1/:id", async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { programa } })
        .then((data) => res.status(200).json({ mensaje: programa.estadoMT1 == "true" ? "Se habilito el primer turno del martes" : "Se inhabilito el primer turno del martes" }))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstadoMT2/:id", async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { programa } })
        .then((data) => res.status(200).json({ mensaje: programa.estadoMT2 == "true" ? "Se habilito el segundo turno del martes" : "Se inhabilito el segundo turno del martes"}))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstadoMIT1/:id", async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { programa } })
        .then((data) => res.status(200).json({ mensaje: programa.estadoMIT1 == "true" ? "Se habilito el primer turno del miercoles" : "Se inhabilito el primer turno del miercoles"}))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstadoMIT2/:id", async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { programa } })
        .then((data) => res.status(200).json({ mensaje: programa.estadoMIT2 == "true" ? "Se habilito el segundo turno del miercoles" : "Se inhabilito el segundo turno del miercoles"}))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstadoJT1/:id", async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { programa } })
        .then((data) => res.status(200).json({ mensaje: programa.estadoJT1 == "true" ? "Se habilito el primer turno del jueves" : "Se inhabilito el primer turno del jueves" }))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstadoJT2/:id", async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { programa } })
        .then((data) => res.status(200).json({ mensaje: programa.estadoJT2 == "true" ? "Se habilito el segundo turno del jueves" : "Se inhabilito el segundo turno del jueves"}))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstadoVT1/:id", async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { programa } })
        .then((data) => res.status(200).json({ mensaje: programa.estadoVT1 == "true" ? "Se habilito el primer turno del viernes" : "Se inhabilito el primer turno del viernes"}))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstadoVT2/:id", async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { programa } })
        .then((data) => res.status(200).json({ mensaje: programa.estadoVT2 == "true" ? "Se habilito el segundo turno del viernes" : "Se inhabilito el segundo turno del viernes"}))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstadoST1/:id", async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { programa } })
        .then((data) => res.status(200).json({ mensaje: programa.estadoST1 == "true" ? "Se habilito el primer turno del sabado" : "Se inhabilito el primer turno del sabado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de orden de compra
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { requerimiento, acumulado, acumuladoMaterial, planeacion, bom, datosRequisicion, resultados, materiaPrima, observaciones } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { requerimiento, acumulado, acumuladoMaterial, planeacion, bom, datosRequisicion, resultados, materiaPrima, observaciones } })
        .then((data) => res.status(200).json({ mensaje: "Informacion de la planeación actualizada", datos: data }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
