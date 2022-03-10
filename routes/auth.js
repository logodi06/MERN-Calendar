/*
La ruta que se requiere para llegar a este
    Rutas de Usuarios / Auth
    host + /api/auth
*/

// const express = require('express');
// const router = express.Router

const { Router } = require('express');

const { check } = require('express-validator');
const router = Router();

//se exporta las funciones desde los controllers auth
const { crearUsuario, loginUsuario, revalidarToken } =  require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


//para tener una ruta y que esta tenga algo que mostrar, hacemos el post.
//aquí se pueden enviar, rutas de acceso a, middlewares, y la función a la que queremos accesar con la ruta de acceso
router.post(
    '/new', 
    [ //middlewares, puede ser de validaciones
    //El nombbre es obligatorio y que no este vacio
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail( ),
        check('password','El password debe de ser de 6 caracteres').isLength( { min: 6 } ),
        //se manda llamar el validarCampos
        validarCampos

    ],
    crearUsuario);

router.post(
    '/', 
    [ //middlewares
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength( { min: 6 }),
        validarCampos
    ],
    loginUsuario );

    //primer parametro ruta, segundo parametro middleware, tercero parametro archivo al que se llama
    //para este proceso, tomamos el token activo que tiene el usuario y le generamos otro nuevo con base en los datos del token que tiene actualmente
router.get('/renew', validarJWT, revalidarToken);

module.exports = router;