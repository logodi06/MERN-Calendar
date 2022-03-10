// La ruta que se requiere para  llegar a este 
//     Rutas de events
//     host + /api/events

const { Router } = require('express');

const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
const router = Router();

//Todas tienen que pasar por la validación del JWT
//con esto le decimos que cualquier petición que se encuentre debajo de esto debe ser validado por el JWT, es como si le mandaramos a cada uno el middleware de validarJWT
router.use(validarJWT);


//Obtener eventos
router.get('/',  getEventos);


//Crear un nuevo evento
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        //con el custom(isDate) validamos que lo que ingresa el usuario sea una fecha
        check('start', 'Fecha de inicio es obligatoria').custom( isDate),
        check('end', 'Fecha de finalización es obligatoria').custom( isDate),


        validarCampos
    ],
    crearEvento);

//Actualizzar evento
router.put(
    '/:id',  
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        //con el custom(isDate) validamos que lo que ingresa el usuario sea una fecha
        check('start', 'Fecha de inicio es obligatoria').custom( isDate),
        check('end', 'Fecha de finalización es obligatoria').custom( isDate),
        validarCampos
    ],
    actualizarEvento);

//Eliminar evento
router.delete('/:id',   eliminarEvento);

module.exports = router;