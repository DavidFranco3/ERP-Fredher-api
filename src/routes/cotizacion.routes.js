const express = require("express");
const router = express.Router();
const cotizacion = require("../models/cotizacion");

// Registro de cotizaciones
router.post("/registro", async (req, res) => {
    const { folio } = req.body;

    // Inicia validacion para no registrar usuarios con el mismo correo electronico
    const busqueda = await cotizacion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una cotización con este folio" });
    } else {
        const cotizacionRegistrar = cotizacion(req.body);
        await cotizacionRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso de la cotizacion", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }

});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await cotizacion
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todas las cotizaciones
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await cotizacion
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el actual de folio de cotizacion
router.get("/obtenerNoCotizacion", async (req, res) => {
    const registroCotizaciones = await cotizacion.find().count();
    if (registroCotizaciones === 0) {
        res.status(200).json({ folioCotizacion: "FD-1" })
    } else {
        const ultimaCotizacion = await cotizacion.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaCotizacion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ folioCotizacion: "FD-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar paginando las cotizaciones
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await cotizacion
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una cotizacion en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await cotizacion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una cotizacion
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await cotizacion
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Cotización eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar el status de la cotizacion
router.put("/cambiarStatus/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    await cotizacion
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Cotización actualizada" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de una cotizacion
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { folio, vendedor, referencia, cliente, comentarios, correoAtencion, partida, status } = req.body;

    await cotizacion
        .updateOne({ _id: id }, { $set: { folio, vendedor, referencia, cliente, comentarios, correoAtencion, partida, status } })
        .then((data) => res.status(200).json({ mensaje: "Datos de la cotización actualizados" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
