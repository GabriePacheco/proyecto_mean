//Utilizar nuevas caractersiticas de los Standares de JavaScript
'use strict'
//Cargar librerìa de Mongoose en una Variable para conectarnos con la DB
var mongoose = require('mongoose');
//Variable para cargar app
var app = require('./app');
//Variable para determinar puerto
var port = 3800;
//Utilizar Promises para la conexión con MongoDB
mongoose.Promise = global.Promise;
//Primer parámetro la URL, Segundo parámetro MongoClient
mongoose.connect('mongodb://localhost:27017/proyecto_mean', {
    useNewUrlParser: true
    , useUnifiedTopology: true
})
    .then(() => {
        console.log("{GP} Developer")
        console.log("Conexión exitosa con la Base de Datos... Gabriel");
        //Crear servidor
        app.listen(port, () => {
            console.log("Servidor en ejecucion en http://localhost:3800... Pacheco");
        });
    })
    .catch(err => console.log(err));