//Utilizar nuevas características de los Standares de JavaScript
'use strict'
//Incluir el módulo bcrypt para cifrar la contraseña
var bcrypt = require('bcrypt-nodejs');

//Cargar librería File System de NodeJS mediante una Variable
var fs = require('fs');
//Cargar librería Path de NodeJS mediante una Variable
var path = require('path');

//Incluir el módulo mongoose pagination
var moongosePaginate = require('mongoose-pagination');

//Cargar el modelo user mediante una Variable
var User = require('../models/user');

//Cargar el servicio jwt mediante una variable
var jwt = require('../services/jwt');

//Crear un método del controlador
function home(req, res) {
    res.status(200).send({
        message: 'Hello World! desde Controlador User '
    });
}
//Crear un método para Registrar Nuevo Usuario
function saveUser(req, res) {
    var params = req.body; //Crear variable para almacenar los campos que llegan por POST
    var user = new User(); //Crear un objeto del modelo de Usuario
    //Condicion para validar ingreso de cada campo
    if (params.firstName && params.lastName &&
        params.username && params.email && params.password) {
        user.firstName = params.firstName;
        user.lastName = params.lastName;
        user.username = params.username;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        //Controlar usuarios duplicados
        User.find({
            $or: [{
                email: user.email.toLowerCase()
            }, {
                username: user.username.toLowerCase()
            }]
        }).exec((err, users) => {
            if (err) return res.status(500).send({
                message: 'Error en la petición de Usuarios'
            });
            if (users && users.length >= 1) {
                return res.status(200).send({
                    message: 'Usuario ya registrado'
                });
            } else {
                //Encriptacion de password
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStored) => {
                        if (err) return res.status(500).send({
                            message: 'Error al Registrar el Usuario'
                        });
                        if (userStored) {
                            res.status(200).send({
                                user: userStored
                            });
                        } else {
                            res.status(404).send({
                                message: 'No se ha registrado el Usuario'
                            });
                        }
                    });
                });
            }
        });
    } else {
        res.status(200).send({
            message: 'No se han enviado todos los campos'
        });
    }
}
//Crear un método para el Login de Usuarios
function loginUser(req, res) {
    var params = req.body; //Crear variable para almacenar los campos que llegan por POST
    var email = params.email;
    var password = params.password;
    //Método para comparar valores ingresados con valores ya registrados en la DB
    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({
            message: 'Error en la petición'
        });
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {

                    if (params.gettoken) {
                        //Generación y Retorno de token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }
                    //Retorno de datos de usuario
                    user.password = undefined;//Eliminar propiedad de objeto password
                    res.status(200).send({ user })

                } else {
                    return res.status(404).send({
                        message: 'Usuario y/o contraseña incorrectos'
                    });
                }
            });
        } else {
            return res.status(404).send({
                message: 'Usuario y/o contraseña no registrados'
            });
        }
    });
}

//Crear un método para devolver los datos de un usuario
function getUser(req, res) {
    var userId = req.params.id; //Variable que recoge el Id del usuario de la URL
    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({
            message: 'Error en la petición'
        });
        if (!user) return res.status(404).send({
            message: 'El Usuario no existe'
        });
        return res.status(200).send({
            user
        });
    });
}

//Crear un método para devolver los datos de todos los usuarios paginados

function getUsers(req, res) {
    var identity_user_id = req.user.sub; //Variable de createToken
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({
            message: 'Error en la petición'
        });
        if (!users) return res.status(404).send({
            message: 'No existen usuarios disponibles'
        });
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

//Crear un método para actualizar los datos de un usuario
function updateUser(req, res) {
    var userId = req.params.id; //Variable que recoge el Id del usuario de la URL
    var update = req.body;
    //Eliminar propiedad password
    delete update.password;
    if (userId != req.user.sub) {
        if (err) return res.status(500).send({
            message: 'No se dispone de acceso para modificar el usuario'
        });
    }
    User.findByIdAndUpdate(userId, update, {
        new: true
    }, (err, userUpdated) => {
        if (err) return res.status(500).send({
            message: 'Error en la petición'
        });
        if (!userUpdated) return res.status(404).send({
            message: 'El Usuario no se ha actualizado'
        });
        return res.status(200).send({
            users: userUpdated
        });
    });
}

//Crear un método para subir una imagen de perfil de un usuario
function uploadImage(req, res) {
    var userId = req.params.id; //Variable que recoge el Id del usuario de la URL
    if (req.files) {
        var file_path = req.files.image.path; //Obtener el path de la imagen subida
        console.log(file_path);
        var file_split = file_path.split('\\'); //Variable para dividir nombre de archivo
        console.log(file_split);
        var file_name = file_split[2]; //Cargar la posición 2 (Nombre del archivo subido)
        console.log(file_name);
        var ext_split = file_name.split('\.'); //Cortar la extensión del archivo
        console.log(ext_split);
        var file_ext = ext_split[1]; //Guardar la extenxión del archivo subido
        console.log(file_ext);
        if (userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'No se dispone de acceso para modificar el usuario')
        }
        if (file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'png' ||
            file_ext == 'gif' || file_ext == 'PNG' || file_ext == 'JPG') {
            //Actualizar documento de usuario logueado
            User.findByIdAndUpdate(userId, {
                image: file_name
            }, {
                new: true
            }, (err, userUpdated) => {
                if (err) return res.status(500).send({
                    message: 'Error en la petición'

                });
                if (!userUpdated) return res.status(404).send({
                    message: 'El Usuario no se ha actualizado'
                });
                return res.status(200).send({
                    users: userUpdated
                });
            });
        } else {
            return removeFilesOfUploads(res, file_path, 'Extensión de archivo no válida');
        }
    } else {
        return res.status(200).send({
            message: 'No se ha subido ninguna imagen'
        });
    }
}
//Crear una función auxiliar para eliminar los ficheros no válidos
function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({
            message: message
        });
    });
}

//Crear un método para devolver la imagen de un Usuario
function getImageFile(req, res) {
    var image_file = req.params.imageFile; //Variable que recoge el Id del usuario de las    URL
    var path_file = './uploads/users/' + image_file;
    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({
                message: 'No existe la imagen del usuario'
            });
        }
    });
}


//Exportar el método home en formato de objeto JSON
module.exports = {
    home,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}