const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

//el req es lo que usuario pide, y el res lo que se responde
const crearUsuario = async ( req, res = response ) => {

    const { email, password } = req.body;

    //try que haga lo que esta dentro, y si todo esta bien lo debe guardar en la BD
    try {
        //verificar y ayudar para validar que el email no sea duplicado
        //con el findOne busca si existe un usuario con el email que se esta enviando, si existe regresa la información del usuario, si no existe regresa null
        let usuario = await Usuario.findOne({ email  });
       
        //si el usuario existe debe regresar un status 400
        if( usuario ){
            return res.status(400).json( {
                ok: false,
                msg: 'El usuario ya existe con ese correo'
            });    
        }

        //Generar un nuevo usuario con los datos enviados por el usuario
        usuario = new Usuario( req.body );

        //Encriptar contraseña
        //genSaltSync se utiliza el sincrono, este recibe como argumento el número de vueltas que se necesita para generar el hash, entre más vuelvas más seguro pero tarda mas
        const salt = bcrypt.genSaltSync();
        //se remplaza la contraseña que se guardará para el usuario, el hashSync recibe la constraseña que va encriptar y el salt el número de vueltas
        usuario.password = bcrypt.hashSync( password, salt );

        //Grabación en la BD
        await usuario.save();

        //GENERAR JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json( {
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

        //si ocurre un error lo debemos de cachar
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })

    }
   


    // //MAnejo de errores
    // const errors = validationResult( req );
    // //si hay errores, entonces
    // if( !errors.isEmpty() ) {
    //     return res.status(400).json( {
    //         ok: false,
    //         errors: errors.mapped()
    //     });
    // }

    // //se valida que el nombre sea de mas de 5 letras
    // if ( name.length < 5 ){
    //     //como la petición no es exitosa, se debe colocar el res.status indicando el número al que hace referencia la petición fallida
    //     //se colocar el return para que en caso de que entre, ahí termine el proceso porque si no se coloca causaria un error de petición
    //     return res.status( 400 ).json ( {
    //         ok: false,
    //         msg: 'El nombre debe ser de 5 letras'
    //     });
    // }

    //console.log(req.body);
    //console.log('Se requiere /');
    //si creo correctamente se debe regresar un status 201
   
}

const loginUsuario = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        
         const usuario = await Usuario.findOne( { email });

         if( !usuario ) {
             return res.status(400).json({
                 ok: false,
                 msg: 'El usuario no existe con ese email'
             });
         }

         //Confirmar los passwords, se desencripta y se comparan las contraseñas para ver si es correcta
         const validPassword = bcrypt.compareSync( password, usuario.password );
         if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
         }

         //Si los datos de authentication son correctos se debe general el JWT (Json Web Token)
          //GENERAR JWT
         const token = await generarJWT( usuario.id, usuario.name );

         res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
         });

    } catch (error) {
        console.log(error);
        res.status(500).json( { 
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

   
}

const revalidarToken = async ( req, res = response ) => {

    const { uid, name } = req;
  

    //generar un nuevo JWT y retornar esa petición, para generarlo ya se extrajeron los datos del token anterior para colocarlos a este nuevo token
    const token = await generarJWT( uid, name )

    //console.log('Se requiere /');
    res.json( {
        ok: true,
        name,
        uid,
        token
      
    });
};


module.exports = { 
    crearUsuario,
    loginUsuario,
    revalidarToken
}