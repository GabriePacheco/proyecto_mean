//Utilizar nuevas características de los Standares de JavaScript
'use strict'
//Cargar el Módulo Express
var express = require('express');
//Cargar Controlador de Follow
var FollowController = require('../controllers/follow');
//Cargar método Router de Express en una variable
var api = express.Router();
//Cargar Middleaware de autenticación
var md_auth = require('../middlewares/authenticated');
//Definir las rutas
api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow); //Utilizar el middleware en la ruta
api.delete('/follow/:id', md_auth.ensureAuth, FollowController.deleteFollow); //Utilizar el middleware en la ruta
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers);
//Exportar rutas
module.exports = api;