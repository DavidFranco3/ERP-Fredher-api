const express = require("express");
const router = express.Router();
const proveedor = require("../models/proveedores");

// Registro de proveedores
router.post("/registro", async (req, res) => {
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
router.get("/listar", async (req, res) => {
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
router.get("/total", async (req, res) => {
    await proveedor
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Generar numero de folio para los proveedores
router.get("/generarFolio", async (req, res) => {
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
router.get("/obtenerItem", async (req, res) => {
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

// Deshabilitar un proveedor
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await proveedor
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Se ha cambiado el status del proveedor" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del proveedor
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, rfc, tipo, productoServicio, categoria, personalContacto, telefono, correo, tiempoCredito, tiempoRespuesta, lugarRecoleccion, horario, comentarios, estado } = req.body;

    await proveedor
        .updateOne({ _id: id }, { $set: { nombre, rfc, tipo, productoServicio, categoria, personalContacto, telefono, correo, tiempoCredito, tiempoRespuesta, lugarRecoleccion, horario, comentarios, estado } })
        .then((data) => res.status(200).json({ mensaje: "Datos del proveedor actualizado" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
