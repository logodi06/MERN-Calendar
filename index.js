
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');


//Crear el servidor de express
const app = express();

//BAse de datos, para hacer la conexión hacia mongo Atlas
dbConnection();

//CORS
app.use(cors())

//Directorio Público
//el use es un midleware que se ejecuta cuando alguien hace una petición
app.use( express.static('public') );

//LEctura y parseo del body
app.use(express.json());


//Rutas
//TODO: auth // crear, login, renew
//Todo lo que el archivo del requiere vaya a exportar lo va a habilitar en la ruta de /api/auth
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


//TODO: CRUD: Eventos




//Escuchar peticiones, el puerte 3000 es en el que escucha en react, así que evitar poner ese
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
})