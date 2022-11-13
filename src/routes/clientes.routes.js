const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const clientes = require("../models/clientes");

// Registro de clientes
router.post("/registro", verifyToken, async (req, res) => {
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
router.get("/listar", verifyToken , async (req, res) => {
    await clientes
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
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
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await clientes
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un cliente
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await clientes
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Cliente eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar el cliente
router.put("/deshabilitar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { estadoCliente } = req.body;
    await clientes
        .updateOne({ _id: id }, { $set: { estadoCliente } })
        .then((data) => res.status(200).json({ mensaje: "Cliente "}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del cliente
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, razonSocial, rfc, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais }, tipo, correo, telefonoCelular, telefonoFijo, foto } = req.body;

    await clientes
        .updateOne({ _id: id }, { $set: { nombre, apellidos, razonSocial, rfc, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais }, tipo, correo, telefonoCelular, telefonoFijo, foto } })
        .then((data) => res.status(200).json({ mensaje: "Datos actualizados"}))
        .catch((error) => res.json({ message: error }));
});

async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({mensaje: "Petición no Autorizada"});
        }
        let token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            return res.status(401).send({mensaje: "Petición no Autorizada"});
        }

        const payload = await jwt.verify(token, 'secretkey');
        if(await isExpired(token)) {
            return res.status(401).send({mensaje: "Token Invalido"});
        }
        if (!payload) {
            return res.status(401).send({mensaje: "Petición no Autorizada"});
        }
        req._id = payload._id;
        next();
    } catch(e) {
        //console.log(e)
        return res.status(401).send({mensaje: "Petición no Autorizada"});
    }
}

async function isExpired(token) {
    const { exp } = jwtDecode(token);
    const expire = exp * 1000;
    const timeout = expire - Date.now()

    if (timeout < 0){
        return true;
    }
    return false;
}

module.exports = router;
