const express = require("express");
const router = express.Router();
const clientes = require("../models/clientes");

// Registro de clientes
router.post("/registro", async (req, res) => {
    const { rfc } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar acuses de recibo con el mismo folio
    const busqueda = await clientes.findOne({ rfc });

    if (busqueda && busqueda.rfc === rfc) {
        return res.status(401).json({ mensaje: "Ya existe un cliente con este RFC" });
    } else {
        const clientesRegistrados = clientes(req.body);
        await clientesRegistrados
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso del cliente", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los clientes
router.get("/listar", async (req, res) => {
    await clientes
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await clientes
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los clientes
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await clientes
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un cliente en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await clientes
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un cliente
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await clientes
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Cliente eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar el cliente
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estadoCliente } = req.body;
    await clientes
        .updateOne({ _id: id }, { $set: { estadoCliente } })
        .then((data) => res.status(200).json({ mensaje: "Cliente " }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del cliente
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, razonSocial, rfc, regimenFiscal, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais, codigoPostal }, tipo, correo, telefonoCelular, telefonoFijo, foto } = req.body;

    const busqueda = await clientes.findOne({ rfc });

    if (busqueda && busqueda.rfc === rfc && busqueda._id != id) {
        return res.status(401).json({ mensaje: "Ya existe un cliente con este RFC" });
    } else {
        await clientes
        .updateOne({ _id: id }, { $set: { nombre, apellidos, razonSocial, rfc, regimenFiscal, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais, codigoPostal }, tipo, correo, telefonoCelular, telefonoFijo, foto } })
        .then((data) => res.status(200).json({ mensaje: "Datos actualizados" }))
        .catch((error) => res.json({ message: error }));
    }
});

module.exports = router;
