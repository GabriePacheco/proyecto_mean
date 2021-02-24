//Utilizar nuevas caractersiticas de los Standares de JavaScript
'use strict'
//Cargar el Módulo Express
var express = require('express');
//Cargar Controlador de publicación
var PublicationController = require('../controllers/publication');
//Cargar método Router de Express en una variable
var api = express.Router();
//Cargar Middleaware de autenticación
var md_auth = require('../middlewares/authenticated');
//Cargar Módulo Multiparty para subir imágenes
var multiparty = require('connect-multiparty');
//Cargar Directorio de Subidas de archivos
var md_upload = multiparty({
    uploadDir: './uploads/users'

});
api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
module.exports = api;
