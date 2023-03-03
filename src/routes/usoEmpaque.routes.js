const express = require("express");
const router = express.Router();
const usoEmpaques = require("../models/usoEmpaque");

// Registro de uso de empaque
router.post("/registro", async (req, res) => {
    const { clave } = req.body;
    //console.log(clave)

    // Inicia validacion para no registrar uso de empaque con la misma clave
    const busqueda = await usoEmpaques.findOne({ clave });

    if (busqueda && busqueda.clave === clave) {
        return res.status(401).json({ mensaje: "Ya existe un uso de empaque con este folio" });
    } else {
        const empaque = usoEmpaques(req.body);
        await empaque
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado un uso de empaque", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los usos de empaque registrados
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await usoEmpaques
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los usos de empaque registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await usoEmpaques
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await usoEmpaques
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un uso de empaque en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await usoEmpaques
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un uso de empaque segun la clave
router.get("/obtenerDatos/:clave", async (req, res) => {
    const { clave } = req.params;

    await usoEmpaques
        .findOne({ clave })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un uso de empaque
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await usoEmpaques
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Uso de empaque eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del uso de empaque
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { descripcion, inventarioInicial, productos, cantidadxUM } = req.body;
    await usoEmpaques
        .updateOne({ _id: id }, { $set: { descripcion, inventarioInicial, productos, cantidadxUM } })
        .then((data) => res.status(200).json({ mensaje: "Información de la salida de planta actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
