//Utilizar nuevas características de los Standares de JavaScript
'use strict'
//Cargar los modelos user y follow mediante Variables
var User = require('../models/user');
var Follow = require('../models/follow');
//Incluir el módulo mongoose pagination
var moongosePaginate = require('mongoose-pagination');
//Crear un método para Seguir usuarios
function saveFollow(req, res) {
    var params = req.body; //Crear variable para almacenar los campos que llegan por POST
    var follow = new Follow(); //Crear un objeto del modelo de Follow
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err) return res.status(500).send({
            message: 'Error al Registrar el Follow de Usuario'
        });
        if (!followStored)
            return res.status(404).send({
                message: 'No se ha registrado el Follow de Usuario'
            });
        return res.status(200).send({
            follow: followStored
        });
    });
}
//Crear un método para dejar de Seguir usuarios
function deleteFollow(req, res) {
    var userId = req.user.sub; //Recoger el Id del usuario que sigue
    var followId = req.params.id; //Recoger el Id del usuario seguido
    //Buscar el Follow en la base de datos
    Follow.find({
        'user': userId,
        'followed': followId
    }).remove(err => {
        if (err) return res.status(500).send({
            message: 'Error al Dejar de seguir al Usuario'
        });
        return res.status(200).send({
            message: 'Se ha dejado de seguir al Usuario'
        });
    });
}
//Crear un método para listar los usuarios seguidos(follows)
function getFollowingUsers(req, res) {
    var userId = req.user.sub; //Recoger el Id del usuario que sigue
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }
    var itemsPerPage = 5;
    Follow.find({
        user: userId
    }).populate({
        path: 'followed'
    }).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({
            message: 'Error en el servidor'
        });
        if (!follows) return res.status(404).send({

            message: 'No sigues a ningún usuario'
        });
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        });
    });
}
//Crear un método para listar los usuarios que siguen a un Usuario
//Crear un método para listar los usuarios que siguen a un Usuario
function getFollowedUsers(req, res) {
    var userId = req.user.sub; //Recoger el Id del usuario que sigue
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }
    var itemsPerPage = 5;
    Follow.find({
        followed: userId
    }).populate(
        'user followed'
    ).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({
            message: 'Error en el servidor'
        });
        if (!follows) return res.status(404).send({
            message: 'No te sigue ningún usuario'
        });
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        });
    });
}

//Exportar métodos

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers
}