
const mongoose = require('mongoose');


//función para conectar con la BD
const dbConnection = async () => {
    try {
        //se utiliza la variable de entorno donde se guardo todos los datos de la conexión
        await mongoose.connect( process.env.DB_CNN);

        console.log('DB Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar BD');
    }
}

module.exports = {
    dbConnection
}