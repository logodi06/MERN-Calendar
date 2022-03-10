const {response} = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {

    //manejo de errores
    const errors = validationResult( req );
    if(!errors.isEmpty()){
        //si hay un error se hace el return y nunca llamara al next
        return res.status(400).json ({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();

}

module.exports = {
    validarCampos
}