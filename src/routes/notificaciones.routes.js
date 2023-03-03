const express = require("express");
const router = express.Router();
const notificaciones = require("../models/notificaciones");

// Registro de notificaciones
router.post("/registro", async (req, res) => {
    const notificacionesRegistrar = notificaciones(req.body);
    await notificacionesRegistrar
        .save()
        .then((data) =>
            res.status(200).json(
                {
                    mensaje: "Registro exitoso de la notificación"
                }
            ))
        .catch((error) => res.json({ message: error }));

});

// Obtener todos los notificaciones
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await notificaciones
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las notificaciones
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await notificaciones
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar las notificaciones por departamento
router.get("/listarPorDepartamento", async (req, res) => {
    const { departamento } = req.query;

    await notificaciones
        .find({ departamentoDestino: departamento })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una notificacion en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await notificaciones
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una notificación
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await notificaciones
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Notificación eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar status de una notificación
router.put("/cambiarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estadoNotificacion } = req.body;
    await notificaciones
        .updateOne({ _id: id }, { $set: { estadoNotificacion } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la notificación actualizado" }))
        .catch((error) => res.json({ message: error }));
});

router.put("/eliminaVista/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await notificaciones
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Notificación eliminada de la vista" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del notificaciones
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { titulo, url, detalles, departamentoEmite, departamentoDestino } = req.body;

    await notificaciones
        .updateOne({ _id: id }, { $set: { titulo, url, detalles, departamentoEmite, departamentoDestino } })
        .then((data) => res.status(200).json({ mensaje: "Datos de la notificación actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
