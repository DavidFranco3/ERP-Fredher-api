const express = require("express");
const router = express.Router();
const reporteDevoluciones = require("../models/reporteDevoluciones");

// Registro de reportes de devoluciones
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar reportes de devolución con el mismo folio
    const busqueda = await reporteDevoluciones.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un reporte con este folio" });
    } else {
        const datosReporteDevolucion = reporteDevoluciones(req.body);
        await datosReporteDevolucion
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el reporte", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Generar reporte de devolucion en PDF
router.post("/generaPDF", async (req, res) => {
    /*const data = req.body || req.body.data;
    const content = data.html;
    let options = {
        format: 'letter',
        margin: {
            right: '40px',
            left: '40px'
        }
    };
    let file = { content };
    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Content-Type', 'application/pdf');
        return res.end(pdfBuffer);
    });*/
});

// Obtener todos los reportes de devolución
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await reporteDevoluciones
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de reporte de devolución actual
router.get("/obtenerNoReporte", async (req, res) => {
    const registroreporteDevoluciones = await reporteDevoluciones.find().count();
    if (registroreporteDevoluciones === 0) {
        res.status(200).json({ noReporte: "1" })
    } else {
        const ultimoReporte = await reporteDevoluciones.findOne().sort({ _id: -1 });

        const tempFolio = parseInt(ultimoReporte.folio) + 1
        res.status(200).json({ noReporte: tempFolio.toString() })
    }
});

// Listar las reportes de devolución paginandolos
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await reporteDevoluciones
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await reporteDevoluciones
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un reporte de devolución en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    // console.log("buscando")
    await reporteDevoluciones
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un reporte
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await reporteDevoluciones
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Reporte eliminado" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
