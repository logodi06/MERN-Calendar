//esto sirve para tener la ayuda de res.status.json...
const { response } = require('express');
const jwt = require('jsonwebtoken');

//validar el token que actualmente tiene el usuario, para poder generar un nuevo token con base en esos datos de ese token
const validarJWT = ( req, res = response, next ) => {
    //Recibir el JWT como x-token headers
    const token = req.header('x-token');

    //console.log(token);

    //Validar el token que se recibe
    //si el token que se recibe no es correcto 
    if( !token ) {
        return res.status(401).json( { 
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        //estraer los datos para verificar que sea correcto
        ///estraemos el uid y name del token
        const {uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        //console.log(payload);

        req.uid = uid;
        req.name = name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }

    next();
    
}

module.exports = {
    validarJWT
}