//configuración de la estructura que se requiere para crear un usuario

const {Schema, model} = require('mongoose');

//El esquema de como se quiere que este en la BD
const UsuarioSchema = Schema({
    //estructura de como se quiere que se estructuren los usuarios
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    } 
});

//Exportacion
module.exports = model('Usuario', UsuarioSchema);