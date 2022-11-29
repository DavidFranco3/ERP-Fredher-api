const express = require("express");
const router = express.Router();
const statusMaterial = require("../models/statusMaterial");

// Registro de pedidos
router.post("/registro",  async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar status material con el mismo folio
    const busqueda = await statusMaterial.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe un status de material con este folio"});
    } else {
        const status = statusMaterial(req.body);
        await status
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado el status de material", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    await statusMaterial
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de status de material
router.get("/obtenerNoStatus", async (req, res) => {
    const RegistroStatus = await statusMaterial.find().count();
    if(RegistroStatus === 0){
        res.status(200).json({ noStatus: "ISM-1"})
    } else {
        const ultimoStatus = await statusMaterial.findOne().sort( { _id: -1 } );
        const tempFolio1 = ultimoStatus.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noStatus: "ISM-" + tempFolio.toString().padStart(1, 0)})
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroStatus = await statusMaterial.find().count();
    if (registroStatus === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await statusMaterial
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Listar paginando los elementos de las compras
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await statusMaterial
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un pedido en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await statusMaterial
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await statusMaterial
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un status de material segun el folio
router.get("/obtenerDatosStatus/:folio", async (req, res) => {
    const { folio } = req.params;

    await statusMaterial
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await statusMaterial
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Pedido eliminado"}))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del status de material
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await statusMaterial
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado del status de material actualizado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { folioInspeccion, propiedadInspeccion, cantidadInspeccion, fechaInspeccion, tipoMaterialInspeccion, recibioInspeccion, loteInspeccion, nombreInspeccion, resultadoInspeccion, etiqueta, fecha, descripcionMaterial, rechazo, nombre, auditor, supervisor, descripcionDefecto, cantidad, tipoRechazo, correccion, clienteProveedor, lote, recibio, turno, propiedad, liberacion, descripcion, comentarios, condicion, observaciones } = req.body;
    await statusMaterial
        .updateOne({ _id: id }, { $set: { folioInspeccion, propiedadInspeccion, cantidadInspeccion, fechaInspeccion, tipoMaterialInspeccion, recibioInspeccion, loteInspeccion, nombreInspeccion, resultadoInspeccion, etiqueta, fecha, descripcionMaterial, rechazo, nombre, auditor, supervisor, descripcionDefecto, cantidad, tipoRechazo, correccion, clienteProveedor, lote, recibio, turno, propiedad, liberacion, descripcion, comentarios, condicion, observaciones } })
        .then((data) => res.status(200).json({ mensaje: "Información del status de material actualizada"}))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
