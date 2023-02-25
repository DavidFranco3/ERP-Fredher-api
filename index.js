const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");

require("./src/database");

const file = path.join(__dirname, "favicon.ico");

const notFound = require("./src/middleware/notFound");
const handleErrors = require("./src/middleware/handleErrors");
const { verifyToken } = require("./src/middleware/verifyToken");

// Configuración del servidor
const app = express();

Sentry.init({
  dsn: "https://34cda94143a14ff3938078498a0bc8e4@o1301469.ingest.sentry.io/6538433",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Configuracion para desplegar
const PORT = process.env.PORT || 5050;

app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, responseType, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

  if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.get("/", (_req, res) => {
  return res.status(200).json({
    mensaje: "API del sistema ERP Personalizado de Fredher",
  });
});

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(favicon(file));
app.use(cors());

// Routes
app.use(require("./src/routes/login.routes"))
app.use("/usuarios/", verifyToken, require("./src/routes/usuarios.routes"));
app.use("/departamentos/", verifyToken, require("./src/routes/departamentos.routes"));
app.use("/clientes", verifyToken, require("./src/routes/clientes.routes"));
app.use("/proveedores", verifyToken, require("./src/routes/proveedores.routes"));
app.use("/ventas", verifyToken, require("./src/routes/pedidoVenta.routes"));
app.use("/materiasPrimas", verifyToken, require("./src/routes/materiaPrima.routes"));
app.use("/catalogoProductos", verifyToken, require("./src/routes/catalogoProductos.routes"));
app.use("/matrizProductos", verifyToken, require("./src/routes/matrizProductos.routes"));
app.use("/correos/", verifyToken, require("./src/routes/correos.routes"));
app.use("/cotizacion/", verifyToken, require("./src/routes/cotizacion.routes"));
app.use("/evaluacionProveedores/", verifyToken, require("./src/routes/evaluacionProveedores.routes"));
app.use("/requisicion/", verifyToken, require("./src/routes/requisicion.routes"));
app.use("/reportesCalidad/", verifyToken, require("./src/routes/reportesCalidad.routes"));
app.use("/logs/", verifyToken, require("./src/routes/logSistema.routes"));
app.use("/notificaciones/", verifyToken, require("./src/routes/notificaciones.routes"));
app.use("/remisiones/", verifyToken, require("./src/routes/remisiones.routes"));
app.use("/rechazos/", verifyToken, require("./src/routes/productosRechazados.routes"));
app.use("/acusesRecibo/", verifyToken, require("./src/routes/acusesRecibo.routes"));
app.use("/devoluciones/", verifyToken, require("./src/routes/devoluciones.routes"));
app.use("/reporteDevoluciones/", verifyToken, require("./src/routes/reporteDevoluciones.routes"));
app.use("/compras/", verifyToken, require("./src/routes/compras.routes"));
app.use("/reportesproduccion/", verifyToken, require("./src/routes/reporteProduccion.routes"));
app.use("/tracking/", verifyToken, require("./src/routes/tracking.routes"));
app.use("/estudiosFactibilidad/", verifyToken, require("./src/routes/estudioFactibilidad.routes"));
app.use("/encuestaSatisfaccion/", verifyToken, require("./src/routes/encuestaSatisFaccion.routes"));
app.use("/requerimientosEspecificos/", verifyToken, require("./src/routes/requerimientosEspecificos.routes"));
app.use("/verificacionEmbarques/", verifyToken, require("./src/routes/verificacionEmbarques.routes"));
app.use("/ordenProduccion/", verifyToken, require("./src/routes/ordenProduccion.routes"));
app.use("/salidaPlanta/", verifyToken, require("./src/routes/salidaPlanta.routes"));
app.use("/existenciasAlmacen/", require("./src/routes/existenciasAlmacen.routes"));
app.use("/usoEmpaque/", verifyToken, require("./src/routes/usoEmpaque.routes"));
app.use("/planeacion/", verifyToken, require("./src/routes/planeacion.routes"));
app.use("/almacenMP/", verifyToken, require("./src/routes/almacenMP.routes"));
app.use("/almacenPT/", verifyToken, require("./src/routes/almacenPT.routes"));
app.use("/almacenGeneral/", verifyToken, require("./src/routes/almacenGeneral.routes"));
app.use("/requerimientosPlaneacion/", verifyToken, require("./src/routes/requerimientosPlaneacion.routes"));
app.use("/asignacionPedido/", verifyToken, require("./src/routes/asignacionPedido.routes"));
app.use("/integracionVentasGastos/", verifyToken, require("./src/routes/integracionVentasGastos.routes"));
app.use("/etiquetaPrimeraPieza/", verifyToken, require("./src/routes/etiquetaPrimeraPieza.routes"));
app.use("/etiquetaMolido/", verifyToken, require("./src/routes/etiquetasMolido.routes"));
app.use("/etiquetaPT/", verifyToken, require("./src/routes/etiquetasIdentificacionPT.routes"));
app.use("/mes/", verifyToken, require("./src/routes/mes.routes"));
app.use("/inspeccionPieza/", verifyToken, require("./src/routes/inspeccionPieza.routes"));
app.use("/produccion/", verifyToken, require("./src/routes/produccion.routes"));
app.use("/inspeccionMaterial/", verifyToken, require("./src/routes/inspeccionMaterial.routes"));
app.use("/statusMaterial/", verifyToken, require("./src/routes/statusMaterial.routes"));
app.use("/liberacionProductoProceso/", verifyToken, require("./src/routes/liberacionProductoProceso.routes"));
app.use("/certificadosCalidad/", verifyToken, require("./src/routes/certificadosCalidad.routes"));
app.use("/maquinas/", verifyToken, require("./src/routes/maquinas.routes"));
app.use("/insumos/", verifyToken, require("./src/routes/insumos.routes"));
app.use("/pigmento/", verifyToken, require("./src/routes/pigmento.routes"));
app.use("/empaques/", verifyToken, require("./src/routes/empaques.routes"));
app.use("/recepcionMaterialInsumos/", verifyToken, require("./src/routes/recepcionMaterialInsumos.routes"));
app.use("/sucursales/", verifyToken, require("./src/routes/sucursales.routes"));
app.use("/gestionAlmacen/", verifyToken, require("./src/routes/gestionAlmacen.routes"));
app.use("/almacenes/", verifyToken, require("./src/routes/almacenes.routes"));
app.use("/programaProduccion/", verifyToken, require("./src/routes/programaProduccion.routes"));
app.use("/razonesSociales/", verifyToken, require("./src/routes/razonesSociales.routes"));
app.use("/unidadesMedida/", verifyToken, require("./src/routes/unidadesMedida.routes"));
app.use("/clasificacionMateriales/", verifyToken, require("./src/routes/clasificacionMateriales.routes"));
app.use("/clasificacionMaquinaria/", verifyToken, require("./src/routes/clasificacionMaquinaria.routes"));
app.use("/fichasTecnicas/", verifyToken, require("./src/routes/fichasTecnicas.routes"));
app.use("/alertasCalidad/", verifyToken, require("./src/routes/alertasCalidad.routes"));
app.use("/noConformidad/", verifyToken, require("./src/routes/noConformidad.routes"));
app.use("/semana/", verifyToken, require("./src/routes/semana.routes"));
app.use("/etiquetasMoldes/", verifyToken, require("./src/routes/etiquetasMoldes.routes"));
app.use("/inventarioMaquinas/", verifyToken, require("./src/routes/inventarioMaquinas.routes"));
app.use("/inventarioMoldes/", verifyToken, require("./src/routes/inventarioMoldes.routes"));
app.use("/mantenimientoPreventivo/", verifyToken, require("./src/routes/programaMantenimientoPreventivo.routes"));
app.use("/facturas/", verifyToken, require("./src/routes/facturas.routes"));
app.use("/notas/", verifyToken, require("./src/routes/notas.routes"));
app.use("/cuentasClientes/", verifyToken, require("./src/routes/cuentasClientes.routes"));

app.use(notFound);
app.use(Sentry.Handlers.errorHandler());
app.use(handleErrors);

// Inicio del servidor en modo local
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { server, app };

