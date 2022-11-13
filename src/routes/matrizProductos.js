const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const productos = require("../models/matrizProductos");
const { map } = require("lodash")

// Para registrar productos
router.post("/registro", verifyToken ,  async (req, res) => {
    const { noInterno } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar productos con el mismo numero interno
    const busqueda = await productos.findOne({ noInterno });

    if (busqueda && busqueda.noInterno === noInterno) {
        return res.status(401).json({mensaje: "Ya existe un producto con este número interno"});
    } else {
        const productoRegistrar = productos(req.body);
        await productoRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado el producto" }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Para obtener el listado de productos
router.get("/listar", verifyToken , async (req, res) => {
    await productos
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener el listado de productos activos
router.get("/listarActivos", verifyToken , async (req, res) => {
    await productos
        .find()
        .sort( { _id: -1 } )
        .then((data) => {
            const tempdata = []
            map(data, (producto, index) => {
                if(producto.estado === "true") {
                    tempdata.push(producto)
                }
            })
            res.status(200).json(tempdata);
        })
        .catch((error) => res.json({ message: error }));
});

// Para obtener el listado de productos obsoletos
router.get("/listarObsoletos", verifyToken , async (req, res) => {
    await productos
        .find()
        .sort( { _id: -1 } )
        .then((data) => {
            const tempdata = []
            map(data, (producto, index) => {
                if(producto.estado === "false") {
                    tempdata.push(producto)
                }
            })
            res.status(200).json(tempdata);
        })
        .catch((error) => res.json({ message: error }));
});

// Para listar los productos paginando
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await productos
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await productos
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener los datos de un pedido en especifico segun el id especificado
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await productos
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener los datos de un producto del catalogo en especifico segun el numero interno
router.get("/obtenerPorNoInterno/:noInterno", verifyToken ,async (req, res) => {
    const { noInterno } = req.params;
    //console.log("buscando")
    await productos
        .findOne({ noInterno })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para eliminar productos
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await productos
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Producto eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de los productos
router.put("/actualizarestado/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await productos
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Informacion del producto actualizada"}))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar los datos de los productos
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { noInterno, cliente, datosMolde, noParte, descripcion, datosPieza, materiaPrima, pigmentoMasterBach, tiempoCiclo, noOperadores, piezasxHora, piezasxTurno, materialEmpaque, opcionMaquinaria, estado } = req.body;
    await productos
        .updateOne({ _id: id }, { $set: { noInterno, cliente, datosMolde, noParte, descripcion, datosPieza, materiaPrima, pigmentoMasterBach, tiempoCiclo, noOperadores, piezasxHora, piezasxTurno, materialEmpaque, opcionMaquinaria, estado } })
        .then((data) => res.status(200).json({ mensaje: "Informacion del producto actualizada"}))
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
