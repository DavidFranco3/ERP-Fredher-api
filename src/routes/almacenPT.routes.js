const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const { map } = require("lodash");
const almacenPT = require("../models/almacenPT");

// Registro inicial de PT en almacen
router.post("/registroInicial",  async (req, res) => {
    const { folioAlmacen } = req.body;

    // Inicia validacion para no registrar datos con el mismo folio
    const busqueda = await almacenPT.findOne({ folioAlmacen });

    if (busqueda && busqueda.folioAlmacen === folioAlmacen) {
        return res.status(401).json({ mensaje: "Ya existe un registro con este folio" });
    } else {
        const pedidos = almacenPT(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado correctamente el producto terminado", datos: data }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los registros de PT del almacen
router.get("/listar", verifyToken , async (req, res) => {
    await almacenPT
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get("/obtenerFolio", verifyToken , async (req, res) => {
    const registroAlmacenPT = await almacenPT.find().count();
    if(registroAlmacenPT === 0){
        res.status(200).json({ noAlmacen: "APT-1"})
    } else {
        const ultimaAlmacen = await almacenPT.findOne().sort( { _id: -1 } );
        const tempFolio1 = ultimaAlmacen.folioAlmacen.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noAlmacen: "APT-" + tempFolio.toString().padStart(1, 0)})
    }
});

// Listar paginando el PT del almacen
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await almacenPT
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await almacenPT
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un PT en el almacén en específico segun el id especificado
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;

    await almacenPT
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un PT segun el folio de la materia prima
router.get("/obtenerDatosFolioMP/:folioMP", verifyToken ,async (req, res) => {
    const { folioMP } = req.params;

    await almacenPT
        .findOne({ folioMP })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener el listado de movimientos de una materia prima
router.get("/listarMovimientosPT/:folioMP", verifyToken ,async (req, res) => {
    const { folioMP } = req.params;

    await almacenPT
        .findOne({ folioMP })
        .then((data) => {
            //console.log(data.movimientos)
            /*let tempMovimientos = []
            map(data, (datos, indexPrincipal) => {
                console.log(datos.existenciasOV)
                map(datos.movimientos, (mov, index) => {
                    //console.log(mov)
                    const { fecha, materiaPrima, um, tipo, descripcion, referencia, cantidad } = mov;
                    tempMovimientos.push({fecha, materiaPrima, um, tipo, descripcion, referencia, cantidad})
                })
            })*/
            res.status(200).json(data.movimientos.reverse())
        })
        .catch((error) => res.json({ message: error }));
});

// Borrar un PT del almacen
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await almacenPT
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Atención!, Materia PT eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar estado del PT
router.put("/actualizarEstado/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { descripcion, um, estado } = req.body;
    await almacenPT
        .updateOne({ _id: id }, { $set: { descripcion, um, estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del PT actualizado"}))
        .catch((error) => res.json({ message: error }));
});

// Registro de entrada y salida de almacen de materias primas
router.put("/registraMovimientos/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { movimientos, existenciasOV, existenciasStock, existenciasTotales } = req.body;
    await almacenPT
        .updateOne({ _id: id }, { $set: { movimientos, existenciasOV, existenciasStock, existenciasTotales } })
        .then((data) => res.status(200).json({ mensaje: "Se ha registrado un movimiento de PT del almacén", datos: data}))
        .catch((error) => res.json({ message: error }));
});

// Modifica existencias de PT del almacen
router.put("/modificaExistencias/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { existenciasOV, existenciasStock, existenciasTotales } = req.body;
    await almacenPT
        .updateOne({ _id: id }, { $set: { existenciasOV, existenciasStock, existenciasTotales } })
        .then((data) => res.status(200).json({ mensaje: "Existencias de PT del almacén actualizadas"}))
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
