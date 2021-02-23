//Utilizar nuevas características de los Standares de JavaScript
'use strict'
//Cargar librería jwt en una variable
var jwt = require('jwt-simple');
//Cargar librería moment en una variable
var moment = require('moment');
//Crear una variable para almacenar el valor de la clave secreta
var secret = 'secret_proyecto_mean_ISTER';
//Crear y exportar función que Genera el Token
exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        image: user.image,
        created_at: moment().unix(),
        expire_at: moment().add(30, 'days').unix
    };
    return jwt.encode(payload, secret)
};
