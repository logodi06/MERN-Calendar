const moment = require('moment');

const isDate = ( value ) => {
  
    //Si el value no existe que retorne un false, por lo cual la validación va a fallar
    if( !value ){
        return false;
    }

    //con moment y el isValid estamos tranformando lo que se recibe en value y valida si es una fecha valida o no.
    //si es fecha valida regresa true, si no es fecha valida (Que se mande us string) regresa false;
    const fecha = moment(value);
    if( fecha.isValid() ){
        return true;
    }else {
        return false;
    }
}

module.exports = {
    isDate
}