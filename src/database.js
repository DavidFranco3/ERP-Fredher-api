const mongoose = require('mongoose');

// Credenciales para conexion local a la BD
// const URI = "mongodb://localhost:27017/erp-Fredher";
const URI = "mongodb://127.0.0.1/erp-Fredher";

// Credenciales para conexion a Mongo Atlas
// const URI = "mongodb+srv://erpFredher:A0KB3nEK33q53xCQ@cluster0.dsbmu.mongodb.net/erp-Fredher";

mongoose.connect(URI)
    .then(db => console.log("DB is connected"))
    .catch(error => console.error(error));

module.exports = mongoose;
