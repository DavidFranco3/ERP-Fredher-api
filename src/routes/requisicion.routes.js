const express = require("express");
const router = express.Router();
const requisicion = require("../models/requisicion");

// Registro de requisiciones
router.post("/registro", async (req, res) => {
    const { folio } = req.body;

    // Inicia validacion para no registrar usuarios con el mismo correo electronico
    const busqueda = await requisicion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya se ha registrado requisición con ese folio" });
    } else {
        const requisicionRegistrar = requisicion(req.body);
        await requisicionRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso de la requisicion"
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }

});

// Obtener todas las requisiciones
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await requisicion
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todas las requisiciones
router.get("/listarActivos", async (req, res) => {
    const { sucursal } = req.query;

    await requisicion
        .find({ sucursal, estado: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los requisiciones
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await requisicion
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {

    await requisicion
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar requisiciones por departamento
router.get("/listarDepartamento", async (req, res) => {
    const { departamento } = req.query;

    await requisicion
        .find({ departamento: departamento })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una requisicion en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await requisicion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener por folio una requisicion
router.get("/obtenerDatos/:folio", async (req, res) => {
    const { folio } = req.params;
    //console.log("buscando")
    await requisicion
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerNoRequisicion", async (req, res) => {
    const registroRequisicion = await requisicion.find().count();
    if (registroRequisicion === 0) {
        res.status(200).json({ noRequisicion: "REQ-1" })
    } else {
        const ultimaRequisicion = await requisicion.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaRequisicion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noRequisicion: "REQ-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroRequisiciones = await requisicion.find().count();
    if (registroRequisiciones === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await requisicion
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Borrar una requisicion
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await requisicion
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Requisicion eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar status de una requisicion
router.put("/cambiarStatus/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await requisicion
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Requisición cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del requisicion
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { fechaElaboracion, fechaRequisicion, solicitante, productosSolicitados, departamento, tipoAplicacion, tipoRequisicion, comentarios, aprobo, status } = req.body;

    await requisicion
        .updateOne({ _id: id }, { $set: { fechaElaboracion, fechaRequisicion, solicitante, productosSolicitados, tipoAplicacion, tipoRequisicion, departamento, comentarios, aprobo, status } })
        .then((data) => res.status(200).json({ mensaje: "Datos de la requisición actualizados" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
