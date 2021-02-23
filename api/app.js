//Utilizar nuevas características de los Standares de JavaScript
'use strict'
//Cargar librería de Express en una variable para trabajar con rutas y http
var express = require('express');

//Variable para convertir las peticiones en Objetos de JavaScript
var bodyParser = require('body-parser');

//Variable para instanciar Express
var app = express();

//Sección para cargar rutas
var user_routes = require('./routes/user');

//Sección para cargar middlewares (Métodos ejecutados antes de llegar a un controlador)
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json()); //Convertir lo que llega en la petición a Json
//Sección para cors y cabeceras
//Sección para rutas
app.use('/api', user_routes);

//Exportar la configura
module.exports = app;