const express = require("express");
const router = express.Router();
const clientes = require("../models/clientes");

// Registro de clientes
router.post("/registro", async (req, res) => {
    const { correo } = req.body;

    // Inicia validacion para no registrar usuarios con el mismo correo electronico
    const busqueda = await clientes.findOne({ correo });

    const clienteRegistrar = clientes(req.body);
    await clienteRegistrar
        .save()
        .then((data) =>
            res.status(200).json(
                { mensaje: "Registro exitoso del cliente"
                }
            ))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los clientes
router.get("/listar", async (req, res) => {
    await clientes
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await clientes
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los clientes
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await clientes
        .find()
        .sort( { _id: -1 } )
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
        .then((data) => res.status(200).json({ mensaje: "Cliente eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar el cliente
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estadoCliente } = req.body;
    await clientes
        .updateOne({ _id: id }, { $set: { estadoCliente } })
        .then((data) => res.status(200).json({ mensaje: "Cliente "}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del cliente
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, razonSocial, rfc, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais }, tipo, correo, telefonoCelular, telefonoFijo, foto } = req.body;

    await clientes
        .updateOne({ _id: id }, { $set: { nombre, apellidos, razonSocial, rfc, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais }, tipo, correo, telefonoCelular, telefonoFijo, foto } })
        .then((data) => res.status(200).json({ mensaje: "Datos actualizados"}))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
