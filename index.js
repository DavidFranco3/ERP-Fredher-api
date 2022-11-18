const express = require("express");
const favicon = require('serve-favicon');
const fs = require("fs");
const path = require('path')
const morgan = require("morgan");
const cors = require("cors");
const https = require('https');

const { mongoose } = require("./src/database")
const file = path.join(__dirname, "logoFredher.ico")

// Configuración del servidor
const app = express();

// Configuracion para desplegar
app.set("port", process.env.PORT || 5050);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get("/",(req,res)=>{
    return res.status(401).json({mensaje: "API del sistema ERP Personalizado de Fredher"});
})

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(favicon(file));
app.use(cors());
// app.use(cookieParser());

// Routes
app.use(require("./src/routes/login.routes"))
app.use("/usuarios/", require("./src/routes/usuarios.routes"));
app.use("/departamentos/", require("./src/routes/departamentos.routes"));
app.use("/clientes", require("./src/routes/clientes.routes"));
app.use("/almacen", require("./src/routes/almacen.routes"));
app.use("/ventas", require("./src/routes/pedidoVenta.routes"));
app.use("/materiasPrimas", require("./src/routes/materiaPrima.routes"));
app.use("/catalogoProductos", require("./src/routes/catalogoProductos.routes"));
app.use("/matrizProductos", require("./src/routes/matrizProductos.routes"));
app.use("/correos/", require("./src/routes/correos.routes"));
app.use("/cotizacion/", require("./src/routes/cotizacion.routes"));
app.use("/proveedores/", require("./src/routes/proveedores.routes"));
app.use("/requisicion/", require("./src/routes/requisicion.routes"));
app.use("/reportesCalidad/", require("./src/routes/reportesCalidad.routes"));
app.use("/logs/", require("./src/routes/logSistema.routes"));
app.use("/notificaciones/", require("./src/routes/notificaciones.routes"));
app.use("/remisiones/", require("./src/routes/remisiones.routes"));
app.use("/rechazos/", require("./src/routes/productosRechazados.routes"));
app.use("/acusesRecibo/", require("./src/routes/acusesRecibo.routes"));
app.use("/devoluciones/", require("./src/routes/devoluciones.routes"));
app.use("/reporteDevoluciones/", require("./src/routes/reporteDevoluciones.routes"));
app.use("/compras/", require("./src/routes/compras.routes"));
app.use("/reportesproduccion/", require("./src/routes/reporteProduccion.routes"));
app.use("/tracking/", require("./src/routes/tracking.routes"));
app.use("/estudiosFactibilidad/", require("./src/routes/estudioFactibilidad.routes"));
app.use("/encuestaSatisfaccion/", require("./src/routes/encuestaSatisFaccion.routes"));
app.use("/requerimientosEspecificos/", require("./src/routes/requerimientosEspecificos.routes"));
app.use("/verificacionEmbarques/", require("./src/routes/verificacionEmbarques.routes"));
app.use("/ordenProduccion/", require("./src/routes/ordenProduccion.routes"));
app.use("/salidaPlanta/", require("./src/routes/salidaPlanta.routes"));
app.use("/existenciasAlmacen/", require("./src/routes/existenciasAlmacen.routes"));
app.use("/usoEmpaque/", require("./src/routes/usoEmpaque.routes"));
app.use("/planeacion/", require("./src/routes/planeacion.routes"));
app.use("/almacenMP/", require("./src/routes/almacenMP.routes"));
app.use("/almacenPT/", require("./src/routes/almacenPT.routes"));
app.use("/almacenGeneral/", require("./src/routes/almacenGeneral.routes"));
app.use("/requerimientosPlaneacion/", require("./src/routes/requerimientosPlaneacion.routes"));
app.use("/asignacionPedido/", require("./src/routes/asignacionPedido.routes"));
app.use("/integracionVentasGastos/", require("./src/routes/integracionVentasGastos.routes"));
app.use("/etiquetaPrimeraPieza/", require("./src/routes/etiquetaPrimeraPieza.routes"));
app.use("/etiquetaPT/", require("./src/routes/etiquetasIdentificacionPT.routes"));
app.use("/mes/", require("./src/routes/mes.routes"));
app.use("/inspeccionPieza/", require("./src/routes/inspeccionPieza.routes"));
app.use("/produccion/", require("./src/routes/produccion.routes"));
app.use("/inspeccionMaterial/", require("./src/routes/inspeccionMaterial.routes"));
app.use("/statusMaterial/", require("./src/routes/statusMaterial.routes"));

// Estaticos
// app.use('/public', express.static('public'));

// Configuración para el inicio el servidor

// Inicio del servidor en modo local
app.listen(app.get("port"), () => {
    console.log(`Servidor en el puerto ${app.get("port")}`);
});


// Inicio del servidor en modo de producción
/*const httpsServer = https.createServer(credentials, app);
httpsServer.listen(app.get("port"));
console.log(`Servidor en el puerto ${app.get("port")}`);*/
