const express = require("express");
const router = express.Router();
const materiaPrima = require("../models/materiaPrima");

// Para registrar materias primas
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)
    // Inicia validacion para no registrar productos con el mismo numero interno
    const busqueda = await materiaPrima.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe registros del material" });
    } else {
        const materiaPrimaRegistrar = materiaPrima(req.body);
        await materiaPrimaRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado el material" }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Para obtener el listado de materias primas
router.get("/listar", async (req, res) => {
    await materiaPrima
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroAsignacion = await materiaPrima.find().count();
    if (registroAsignacion === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await materiaPrima
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Para listar paginando las materias primas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await materiaPrima
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await materiaPrima
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener datos de una materia prima
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await materiaPrima
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos de la materia prima segun el folio
router.get("/obtenerPorFolio/:folio", async (req, res) => {
    const { folio } = req.params;
    //console.log("buscando")
    await materiaPrima
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener el folio actual de materia prima
router.get("/obtenerFolio", async (req, res) => {
    const registroAlmacenMP = await materiaPrima.find().count();
    if (registroAlmacenMP === 0) {
        res.status(200).json({ noMP: "MP-1" })
    } else {
        const ultimaMP = await materiaPrima.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaMP.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noMP: "MP-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Para eliminar materias primas
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await materiaPrima
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Material eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar los datos de los materias primas
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { descripcion, precio, proveedor } = req.body;
    await materiaPrima
        .updateOne({ _id: id }, { $set: { descripcion, precio, proveedor } })
        .then((data) => res.status(200).json({ mensaje: "Material actualizado" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
