const jwt = require('jsonwebtoken');


//recibe como parametros los datos que se meteran dentro del token para identicarlo
const generarJWT = ( uid, name ) => {

    //el JWT no trabaja con promesar pero se hara que trabaje para poder usarla con async await
    return new Promise ( ( resolve, reject ) => {
        const payload = { uid, name };

        //el payload es el id y name
        //el SECRET_JWT_SEED es una palabra clase secreta y debe ser segura que ayude a completar el token
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, ( err, token ) => {

            if(err){
                console.log(err)
                reject('No se pudo general el token');
            }

            resolve( token); 
        });
    })
}

module.exports = {
    generarJWT
}