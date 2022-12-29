const express = require("express");
const router = express.Router();
const productosrechazados = require("../models/productosRechazados");

// Registro de productos rechazados
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar productos rechazados con el mismo folio
    const busqueda = await productosrechazados.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un rechazo con este folio" });
    } else {
        const datosRechazo = productosrechazados(req.body);
        await datosRechazo
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el rechazo", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas la productos rechazados
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await productosrechazados
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de rechazo actual
router.get("/obtenerNoRechazo", async (req, res) => {
    const registroproductosrechazados = await productosrechazados.find().count();
    if (registroproductosrechazados === 0) {
        res.status(200).json({ noRechazo: "1" })
    } else {
        const ultimoRechazo = await productosrechazados.findOne().sort({ _id: -1 });
        //console.log(ultimaRemision)
        const tempFolio = parseInt(ultimoRechazo.folio) + 1
        res.status(200).json({ noRechazo: tempFolio.toString() })
    }
});

// Listar los productos rechazados paginandolos
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await productosrechazados
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await productosrechazados
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un producto rechazado en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    // console.log("buscando")
    await productosrechazados
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un producto rechazado
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await productosrechazados
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Rechazo eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del rechazo
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { idRemision, productos, cantidadRechazada } = req.body;
    await productosrechazados
        .updateOne({ _id: id }, { $set: { idRemision, productos, cantidadRechazada } })
        .then((data) => res.status(200).json({ mensaje: "Información del rechazo actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
