const mongoose = require('mongoose');

// Credenciales para conexion local a la BD
const URI = "mongodb://127.0.0.1/erp-Fredher";

// Credenciales para conexion a Mongo Atlas
// const URI = "mongodb+srv://erpFredher:A0KB3nEK33q53xCQ@cluster0.dsbmu.mongodb.net/erp-Fredher";

mongoose.Promise = global.Promise;

mongoose.set('strictQuery', true);

mongoose
  .connect(URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log("Database connection error: ", err);
  });

process.on("uncaughtException", (err, origin) => {
  console.error("Caught exception: " + err);
  console.error("Exception origin: " + origin);
});

module.exports = mongoose;
