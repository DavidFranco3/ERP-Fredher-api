const express = require("express");
const router = express.Router();
const acusesRecibo = require("../models/acusesRecibo");

// Registro de acuses de recibo
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar acuses de recibo con el mismo folio
    const busqueda = await acusesRecibo.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un acuse de recibo con este folio" });
    } else {
        const datosAcusesRecibo = acusesRecibo(req.body);
        await datosAcusesRecibo
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el acuse de recibo", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los acuses de recibo
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;
    await acusesRecibo
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de acuse de recibo actual
router.get("/obtenerNoAcuseRecibo", async (req, res) => {
    const registroacusesRecibo = await acusesRecibo.find().count();
    if (registroacusesRecibo === 0) {
        res.status(200).json({ noAcuseRecibo: "AR-1" })
    } else {
        const ultimoAcuseRecibo = await acusesRecibo.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoAcuseRecibo.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noAcuseRecibo: "AR-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los acuses de recibo paginandolos
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await acusesRecibo
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await acusesRecibo
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un acuse de recibo en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    // console.log("buscando")
    await acusesRecibo
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un acuse de recibo
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await acusesRecibo
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Acuse de recibo eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del acuse de recibo
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { idRemision, productos, cantidadAceptada } = req.body;
    await acusesRecibo
        .updateOne({ _id: id }, { $set: { idRemision, productos, cantidadAceptada } })
        .then((data) => res.status(200).json({ mensaje: "Información del acuse de recibo actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
