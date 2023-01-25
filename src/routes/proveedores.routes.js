const express = require("express");
const router = express.Router();
const proveedor = require("../models/proveedores");

// Registro de proveedores
router.post("/registro", async (req, res) => {
    const { rfc, sucursal } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar acuses de recibo con el mismo folio
    const busqueda = await proveedor .findOne({ rfc });

    if (busqueda && busqueda.rfc === rfc && busqueda.sucursal === sucursal) {
        return res.status(401).json({ mensaje: "Ya existe un proveedor con este RFC" });
    } else {
        const proveedoresRegistrados = proveedor (req.body);
        await proveedoresRegistrados
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso del proveedor", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los proveedores
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await proveedor 
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los proveedores
router.get("/listarActivos", async (req, res) => {
    const { sucursal } = req.query;

    await proveedor 
        .find({ sucursal, estadoProveedor: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await proveedor 
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los proveedores
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await proveedor 
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un proveedor en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await proveedor 
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un proveedor
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await proveedor 
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Proveedor eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar el proveedor
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estadoProveedor } = req.body;
    await proveedor 
        .updateOne({ _id: id }, { $set: { estadoProveedor } })
        .then((data) => res.status(200).json({ mensaje: "Estado del proveedor actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del proveedor
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, razonSocial, rfc, tipoPersona, personalContacto, regimenFiscal, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais, codigoPostal }, tipo, correo, telefonoCelular, telefonoFijo, foto } = req.body;

    const busqueda = await proveedor .findOne({ rfc });

    if (busqueda && busqueda.rfc === rfc && busqueda._id != id) {
        return res.status(401).json({ mensaje: "Ya existe un proveedor con este RFC" });
    } else {
        await proveedor 
            .updateOne({ _id: id }, { $set: { nombre, apellidos, tipoPersona, razonSocial, rfc, personalContacto, regimenFiscal, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais, codigoPostal }, tipo, correo, telefonoCelular, telefonoFijo, foto } })
            .then((data) => res.status(200).json({ mensaje: "Datos actualizados" }))
            .catch((error) => res.json({ message: error }));
    }
});

module.exports = router;
