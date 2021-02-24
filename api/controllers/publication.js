//Utilizar nuevas características de los Standares de JavaScript
'use strict'
//Cargar librería File System de NodeJS mediante una Variable
var fs = require('fs');
//Cargar librería Path de NodeJS mediante una Variable
var path = require('path');
//Incluir el módulo moment
var moment = require('moment');
//Incluir el módulo mongoose pagination
var moongosePaginate = require('mongoose-pagination');
//Cargar el modelo publication mediante una Variable
var Publication = require('../models/publication');
//Cargar el modelo user mediante una Variable
var User = require('../models/user');
//Cargar el modelo followmediante una Variable
var Follow = require('../models/follow');
//Método para Guardar publicaciones de Usuarios
function savePublication(req, res) {
    var params = req.body;
    if (!params.text) return res.status(200).send({
        message: 'No se ha enviado Texto'

});
    var publication = new Publication();
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();
    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({
            message: 'Error al guardar la publicación'
        });
        if (!publicationStored) return res.status(404).send({
            message: 'La publicación NO ha sido guardada'
        });
        return res.status(200).send({
            publication: publicationStored
        });
    });
}
//Método para Listar las Publicaciones los usuarios Seguidos
function getPublications(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;
    //Buscar todos los follows de un Usuario
    Follow.find({
        user: req.user.sub
    }).populate('followed').exec((err, follows) => {
        if (err) return res.status(500).send({
            message: 'Error devolver el seguimiento'
        });
        var follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        follows_clean.push(req.user.sub);
        Publication.find({
            user: {
                "$in": follows_clean //Buscar coincidencias dentro de un array
            }
        }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err,
            publications, total) => {
            if (err) return res.status(500).send({
                message: 'Error devolver publicaciones'
            });
            if (!publications) return res.status(404).send({
                message: 'No hay publicaciones'
            });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            });
        });
    });
}
module.exports = {
    savePublication,
    getPublications
}
