//Utilizar nuevas caractersiticas de los Standares de JavaScript
'use strict'
//Cargar librería Mongoose
var mongoose = require('mongoose');
//Crear una Variable para definir un nuevo Schema
var Schema = mongoose.Schema;
//Creamos una variable que nos permita definir la estructura de todos los objetos
var FollowSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    followed: { type: Schema.ObjectId, ref: 'User' }
});
//Exportar el modelo para utilizarlo dentro de otro fichero
//Nombre de la Entidad, Nombre de Schema
module.exports = mongoose.model('Follow', FollowSchema);