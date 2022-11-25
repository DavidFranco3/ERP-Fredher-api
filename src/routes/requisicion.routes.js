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
    await requisicion
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los requisiciones
router.get("/listarPaginandoDepartamento", async (req, res) => {
    const { pagina, limite, departamento } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await requisicion
        .find({ departamento: departamento })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/totalDepartamento", async (req, res) => {
    const { departamento } = req.query;

    await requisicion
        .find({ departamento: departamento })
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
        .find({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerNoRequisicion", async (req, res) => {
    const registroRequisicion = await requisicion.find().count();
    if(registroRequisicion === 0){
        res.status(200).json({ noRequisicion: "REQ-1"})
    } else {
        const ultimaRequisicion = await requisicion.findOne().sort( { _id: -1 } );
        const tempFolio1 = ultimaRequisicion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noRequisicion: "REQ-" + tempFolio.toString().padStart(1, 0)})
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
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Requisicion eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar status de una requisicion
router.put("/cambiarStatus/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await requisicion
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la requisicion actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del requisicion
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { fechaElaboracion, solicitante, productosSolicitados, comentarios, aprobo, status } = req.body;

    await requisicion
        .updateOne({ _id: id }, { $set: { fechaElaboracion, solicitante, productosSolicitados, comentarios, aprobo, status } })
        .then((data) => res.status(200).json({ mensaje: "Datos de la requisición actualizados" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
