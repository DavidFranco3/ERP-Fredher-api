const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const departamentos = require("../models/departamentos");

// Registro de departamentos
router.post("/registro",  async (req, res) => {
    const departamento = departamentos(req.body);
    await departamento
        .save()
        .then((data) =>
            res.status(200).json(
                { mensaje: "Registro exitoso del departamento"
                }
            ))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los departamentos
router.get("/listar", verifyToken , async (req, res) => {
    await departamentos
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});
// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await departamentos
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los departamentos registrados
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await departamentos
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un departamentos en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await departamentos
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un usuario departamentos
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await departamentos
        .remove({ _id: id })
        .then((data) => res.status(200).json({ status: "Departamento eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del departamentos
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    await departamentos
        .updateOne({ _id: id }, { $set: { nombre } })
        .then((data) => res.status(200).json({ status: "Departamento actualizado"}))
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
