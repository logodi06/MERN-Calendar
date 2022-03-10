
//configuración de la estructura que se requiere para crear un evento

const { Schema, model } = require('mongoose');

const EventoSchema = Schema( {

    title: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        //al crear el evento es importante saber quien lo está creando, por lo tanto necesitamos el user dentro del evento
        //hacemos una referencia para poder obtener el ID haciendo referencia a Usuario, que ya lo tenemos creado también
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

//especificar el schema con el que queremos que se muestre, en este en postman, pero en la BD no cambia la estructura
EventoSchema.method('toJSON', function() {
    const {__v, _id, ...object } =  this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Evento', EventoSchema );