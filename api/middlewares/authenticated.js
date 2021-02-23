//Utilizar nuevas características de los Standares de JavaScript
'use strict'
//Cargar librería jwt en una variable
var jwt = require('jwt-simple');
//Cargar librería moment en una variable
var moment = require('moment');
//Utilizar la misma la clave secreta del jwt
var secret = 'secret_proyecto_mean_ISTER';
//Crear el método de Autenticar el token
exports.ensureAuth = function (req, res, next) {
    //El token debe llegar en una cabecera (header)
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: 'La petición no contiene una cabecera de autenticación'
        });
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'El token expiró'
            });
        }

    } catch (ex) {
        return res.status(404).send({
            message: 'El token es inválido'
        });
    }
    req.user = payload;
    next();
}