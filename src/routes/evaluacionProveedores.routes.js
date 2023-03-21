const express = require("express");
const router = express.Router();
const evaluacionProveedor = require("../models/evaluacionProveedores");

// Registro de proveedores
router.post("/registro", async (req, res) => {
    const { correo } = req.body;

    // Inicia validacion para no registrar usuarios con el mismo correo electronico
    const busqueda = await evaluacionProveedor.findOne({ correo });

    const clienteRegistrar = evaluacionProveedor(req.body);
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
    const { sucursal } = req.query;

    await evaluacionProveedor
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los proveedores
router.get("/listarActivos", async (req, res) => {
    const { sucursal } = req.query;

    await evaluacionProveedor
        .find({ sucursal, estadoProveedor: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los proveedores
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await evaluacionProveedor
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await evaluacionProveedor
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Generar numero de folio para los proveedores
router.get("/generarFolio", async (req, res) => {
    const registroProveedores = await evaluacionProveedor.find().count();
    if (registroProveedores === 0) {
        res.status(200).json({ noProveedor: "PVD-1" })
    } else {
        const ultimoProveedor = await evaluacionProveedor.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoProveedor.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noProveedor: "PVD-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroProveedores = await evaluacionProveedor.find().count();
    if (registroProveedores === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await evaluacionProveedor
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
    await evaluacionProveedor
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un proveedor
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await evaluacionProveedor
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Proveedor eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar un proveedor
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estadoProveedor } = req.body;
    await evaluacionProveedor
        .updateOne({ _id: id }, { $set: { estadoProveedor } })
        .then((data) => res.status(200).json({ mensaje: "Estado del proveedor actualizado correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del proveedor
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, rfc, tipoPersona, regimenFiscal, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais, codigoPostal }, productoServicio, personalContacto, telefonoCelular, telefonoFijo, correo, tiempoCredito, servicioProporcionado, tiempoRespuesta, lugarRecoleccion, horario, comentarios, productos } = req.body;

    await evaluacionProveedor
        .updateOne({ _id: id }, { $set: { nombre, rfc, tipoPersona, regimenFiscal, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais, codigoPostal }, productoServicio, personalContacto, telefonoCelular, telefonoFijo, correo, tiempoCredito, servicioProporcionado, tiempoRespuesta, lugarRecoleccion, horario, comentarios, productos } })
        .then((data) => res.status(200).json({ mensaje: "Datos del proveedor actualizado" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
