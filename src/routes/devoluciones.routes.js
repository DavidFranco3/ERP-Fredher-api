const express = require("express");
const router = express.Router();
const devoluciones = require("../models/devoluciones");

// Registro de devoluciones
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar devoluciones con el mismo folio
    const busqueda = await devoluciones.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una devolución con este folio" });
    } else {
        const datosDevolucion = devoluciones(req.body);
        await datosDevolucion
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la devolución", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las devoluciones
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await devoluciones
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de devolución actual
router.get("/obtenerNoDevolucion", async (req, res) => {
    const registrodevoluciones = await devoluciones.find().count();
    if (registrodevoluciones === 0) {
        res.status(200).json({ noDevolucion: "D-1" })
    } else {
        const ultimaDevolucion = await devoluciones.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaCotizacion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noDevolucion: "D-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar las devoluciones paginandolos
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await devoluciones
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await devoluciones
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una devolucion en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    // console.log("buscando")
    await devoluciones
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una devolución rechazado
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await devoluciones
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Decolución eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la devolución
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { factura, empresa, cliente, rfc, almacen, razonSocial, comentario, vendedor, domicilio, productos, totales } = req.body;
    await devoluciones
        .updateOne({ _id: id }, { $set: { factura, empresa, cliente, rfc, almacen, razonSocial, comentario, vendedor, domicilio, productos, totales } })
        .then((data) => res.status(200).json({ mensaje: "Información de la devolución actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
