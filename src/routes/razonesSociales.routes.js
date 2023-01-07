const express = require("express");
const router = express.Router();
const razonesSociales = require("../models/razonesSociales");

// Registro de razones sociales
router.post("/registro", async (req, res) => {
    const { rfc } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar acuses de recibo con el mismo folio
    const busqueda = await razonesSociales.findOne({ rfc });

    if (busqueda && busqueda.rfc === rfc) {
        return res.status(401).json({ mensaje: "Ya existe una razon social con este RFC" });
    } else {
        const razonesRegistradas = razonesSociales(req.body);
        await razonesRegistradas
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso de la razón social", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos las razones sociales
router.get("/listar", async (req, res) => {

    await razonesSociales
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await razonesSociales
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las razones sociales
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await razonesSociales
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una razon social en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await razonesSociales
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una razon social
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await razonesSociales
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Razon social eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar la razon
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estadoRazonSocial } = req.body;
    await razonesSociales
        .updateOne({ _id: id }, { $set: { estadoRazonSocial } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la razón social actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la razón social
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, razonSocial, rfc, tipoPersona, regimenFiscal, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais, codigoPostal }, tipo, correo, telefonoCelular, telefonoFijo, foto } = req.body;

    const busqueda = await razonesSociales.findOne({ rfc });

    if (busqueda && busqueda.rfc === rfc && busqueda._id != id) {
        return res.status(401).json({ mensaje: "Ya existe una razón social con este RFC" });
    } else {
        await razonesSociales
            .updateOne({ _id: id }, { $set: { nombre, apellidos, tipoPersona, razonSocial, rfc, regimenFiscal, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais, codigoPostal }, tipo, correo, telefonoCelular, telefonoFijo, foto } })
            .then((data) => res.status(200).json({ mensaje: "Datos actualizados" }))
            .catch((error) => res.json({ message: error }));
    }
});

module.exports = router;
