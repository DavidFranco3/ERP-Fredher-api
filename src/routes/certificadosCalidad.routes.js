const express = require("express");
const router = express.Router();
const certificadosCalidad = require("../models/certificadosCalidad");

// Registro de las compras
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar acuses de recibo con el mismo folio
    const busqueda = await certificadosCalidad.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un certificado con este folio" });
    } else {
        const certificado = certificadosCalidad(req.body);
        await certificado
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso del certificado", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
    //
});

// Obtener todos las compras
router.get("/listar", async (req, res) => {
    await certificadosCalidad
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los elementos de las compras
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await certificadosCalidad
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await certificadosCalidad
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
    await certificadosCalidad
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos de una compra segun el folio
router.get("/obtenerDatosCertificado/:folio", async (req, res) => {
    const { folio } = req.params;

    await certificadosCalidad
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerNoCertificado", async (req, res) => {
    const certificado = await certificadosCalidad.find().count();
    if (certificado === 0) {
        res.status(200).json({ noCertificado: "CFC-1" })
    } else {
        const ultimoCertificado = await certificadosCalidad.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoCertificado.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noCertificado: "CFC-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroCertificado = await certificadosCalidad.find().count();
    if (registroCertificado === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await certificadosCalidad
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
    await certificadosCalidad
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Certificado eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await certificadosCalidad
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del certificado actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de orden de compra
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { fecha, noOrdenInterna, tamañoLote, cliente, descripcion, numeroParte, especificacionInforme, revisionAtributos, resultadoDimensional, observacionesResultados, equipoMedicion, referencia, realizo, correo } = req.body;
    await certificadosCalidad
        .updateOne({ _id: id }, { $set: { fecha, noOrdenInterna, tamañoLote, cliente, descripcion, numeroParte, especificacionInforme, revisionAtributos, resultadoDimensional, observacionesResultados, equipoMedicion, referencia, realizo, correo } })
        .then((data) => res.status(200).json({ mensaje: "Informacion del certificado actualizada", datos: data }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
