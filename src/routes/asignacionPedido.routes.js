const express = require("express");
const router = express.Router();
const asignacionPedido = require("../models/asignacionPedido");

// Registro de pedidos
router.post("/registro",  async (req, res) => {
    const { item } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar pedidos de venta con el mismo folio
    const busqueda = await asignacionPedido.findOne({ item });

    if (busqueda && busqueda.item === item) {
        return res.status(401).json({mensaje: "Ya existe una asignacion de pedido con este folio"});
    } else {
        const pedidos = asignacionPedido(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado la asignacion de pedido", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;
    
    await asignacionPedido
        .find({ sucursal })
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de venta
router.get("/obtenerNoAsignacion", async (req, res) => {
    const registroAsignacionPedido = await asignacionPedido.find().count();
    if(registroAsignacionPedido === 0){
        res.status(200).json({ noAsigncion: "OV-1"})
    } else {
        const ultimaAsignacion = await asignacionPedido.findOne().sort( { _id: -1 } );
        const tempFolio1 = ultimaAsignacion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noAsignacion: "OV-" + tempFolio.toString().padStart(1, 0)})
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroAsignacion = await asignacionPedido.find().count();
  if (registroAsignacion === 0) {
    res.status(200).json({ item: 1 });
  } else {
    const [ultimoItem] = await asignacionPedido
      .find({})
      .sort({ item: -1 })
      .limit(1);
    const tempItem = parseInt(ultimoItem.item) + 1;
    res.status(200).json({item: tempItem});
  }
});

// Listar los pedidos de venta registrados
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await asignacionPedido
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
    await asignacionPedido
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await asignacionPedido
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un pedido de venta segun el folio
router.get("/obtenerDatosAsignacion/:folio", async (req, res) => {
    const { folio } = req.params;

    await asignacionPedido
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await asignacionPedido
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Asignacion de pedido eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await asignacionPedido
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Asignación de pedido cancelada correctamente"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { cantidadAsignada, plantaAsignada } = req.body;
    await asignacionPedido
        .updateOne({ _id: id }, { $set: { cantidadAsignada, plantaAsignada } })
        .then((data) => res.status(200).json({ mensaje: "Información de la asignacion de pedido actualizada"}))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
