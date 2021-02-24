//Utilizar nuevas características de los Standares de JavaScript
'use strict'
//Cargar librería de Express en una variable para trabajar con rutas y http
var express = require('express');

//Variable para convertir las peticiones en Objetos de JavaScript
var bodyParser = require('body-parser');

//Variable para instanciar Express
var app = express();

//Sección para CORS y Cabeceras HTTP (para peticiones AJAX)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, XRequested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Sección para cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');

//Sección para cargar middlewares (Métodos ejecutados antes de llegar a un controlador)
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json()); //Convertir lo que llega en la petición a Json
//Sección para cors y cabeceras
//Sección para rutas
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);


//Exportar la configura
module.exports = app;