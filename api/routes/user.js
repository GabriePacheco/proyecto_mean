//Utilizar nuevas características de los Standares de JavaScript
'use strict'
//Cargar el Módulo Express
var express = require('express');
//Cargar Controlador de usuario
var UserController = require('../controllers/user');

//Cargar Módulo Multiparty para subir imágenes
var multiparty = require('connect-multiparty');
//Cargar Directorio de Subidas de archivos
var md_upload = multiparty({
    uploadDir: './uploads/users'
});

//Cargar método Router de Express en una variable
var api = express.Router();

//Cargar Middleaware de autenticación
var md_auth = require('../middlewares/authenticated');

//Definir las rutas
api.get('/home', md_auth.ensureAuth, UserController.home); //Utilizar el middleware
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser); //Utilizar el middleware 
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers); //Utilizar el middleware en la ruta
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser); //Utilizar el middleware en la ruta

//Utilizar el middlewares en la ruta (De autenticación y de imagen)
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload],UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile); 


//Exportar rutas
module.exports = api;