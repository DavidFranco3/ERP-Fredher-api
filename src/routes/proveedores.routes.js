const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const proveedor = require("../models/proveedores");

// Registro de proveedores
router.post("/registro", verifyToken, async (req, res) => {
    const { correo } = req.body;

    // Inicia validacion para no registrar usuarios con el mismo correo electronico
    const busqueda = await proveedor.findOne({ correo });

    const clienteRegistrar = proveedor(req.body);
    await clienteRegistrar
        .save()
        .then((data) =>
            res.status(200).json(
                {
                    mensaje: "Registro exitoso del proveedor"
                }
            ))
        .catch((error) => res.json({ message: error }));

});

// Obtener todos los proveedores
router.get("/listar", verifyToken, async (req, res) => {
    await proveedor
        .find()
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

// Obtener el total de registros de la colección
router.get("/total", verifyToken, async (req, res) => {
    await proveedor
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Generar numero de folio para los proveedores
router.get("/generarFolio", verifyToken, async (req, res) => {
    const registroProveedores = await proveedor.find().count();
    if (registroProveedores === 0) {
        res.status(200).json({ noProveedor: "PROVEEDOR-1" })
    } else {
        const ultimoProveedor = await proveedor.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoProveedor.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noProveedor: "PROVEEDOR-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", verifyToken, async (req, res) => {
    const registroProveedores = await proveedor.find().count();
    if (registroProveedores === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await proveedor
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Obtener un proveedor en especifico
router.get("/obtener/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await proveedor
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un proveedor
router.delete("/eliminar/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    await proveedor
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Proveedor eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar un proveedor
router.put("/deshabilitar/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await proveedor
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Se ha cambiado el status del proveedor" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del proveedor
router.put("/actualizar/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nombre, rfc, tipo, productoServicio, categoria, personalContacto, telefono, correo, tiempoCredito, tiempoRespuesta, lugarRecoleccion, horario, comentarios, estado } = req.body;

    await proveedor
        .updateOne({ _id: id }, { $set: { nombre, rfc, tipo, productoServicio, categoria, personalContacto, telefono, correo, tiempoCredito, tiempoRespuesta, lugarRecoleccion, horario, comentarios, estado } })
        .then((data) => res.status(200).json({ mensaje: "Datos del proveedor actualizado" }))
        .catch((error) => res.json({ message: error }));
});

async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ mensaje: "Petición no Autorizada" });
        }
        let token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            return res.status(401).send({ mensaje: "Petición no Autorizada" });
        }

        const payload = await jwt.verify(token, 'secretkey');
        if (await isExpired(token)) {
            return res.status(401).send({ mensaje: "Token Invalido" });
        }
        if (!payload) {
            return res.status(401).send({ mensaje: "Petición no Autorizada" });
        }
        req._id = payload._id;
        next();
    } catch (e) {
        //console.log(e)
        return res.status(401).send({ mensaje: "Petición no Autorizada" });
    }
}

async function isExpired(token) {
    const { exp } = jwtDecode(token);
    const expire = exp * 1000;
    const timeout = expire - Date.now()

    if (timeout < 0) {
        return true;
    }
    return false;
}

module.exports = router;
