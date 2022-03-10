const { response } = require('express');
const Evento = require('../models/Evento');


const getEventos = async ( req, res = response ) => {

    //buscar todos los eventos, desplegando información del user con el pupulate
    const eventos = await Evento.find()
                                 .populate('user', 'name'); 

   res.json ({
        ok: true,
        eventos
    });
}

const crearEvento = async (req, res = response ) => {

    //generamos una instancia para poder guardarlo en la BD
    const evento = new Evento( req.body );

    try {
        //Del evento que se recibe obtenemos el uid del usuario
        evento.user = req.uid;

        //se guarda el evento en la BD
        const eventoGuardado = await evento.save() ;

         res.json ({
            ok:true,
            evento: eventoGuardado
         });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const actualizarEvento = async (req, res = response) => {

    //console.log(req.body);

    //obtener el ID del evento que se esta mandando como parametro, en la petición
    const eventoId = req.params.id;

    //como se a interactuar con la BD se coloca un try y Catch para que lo cache
    try {
        
        //buscamos el evento que se esta mandando de la vista, en la BD
        const evento = await Evento.findById( eventoId );

        const uid = req.uid;

        //si el evento no existe, muestra el status 404
        if( !evento ){
            return res.status(404).json({
                ok:false,
                msg: 'Evento no existe por ese ID'
            });
        }

        //Verificar que la persona que creo el evento es la misma persona que lo quiere actualizar, si es así que lo deje pasar si no que no lo deje
        //el evento.user trae el Id pero lo transformamos en String para poder hacer la comparación
        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene el  privilegio de editar este evento'
            });
        }

        //como la condición de arriba no se va a cumplir, pasaría a esta parte lo que quiere decir que la persona que quiere editar el evento es la misma que lo creo
        const nuevoEvento =  {
            //se desestrututa lo que viene en el body, el title, start, end, notas.
            ...req.body,
            //como el user no viene en el body lo que debemos hacer es enviarle de nuevo también el ID con el uid
            user: uid
        }

        //eventoId, el id del evento a actualizar, nuevoEvento -> lo que se quiere actualizar
        //esto siempre regresa el viejo documento para que se pueda hacer algún tipo de comparación, si 
        //se requiere obtener el ultimo docuemnto, con la información actualizada debemos colocar un tercer elemento en el findByIdAndUpdate
        // new: true, significa que quiero que retorne los elementos que se acaban de actualizar y no el viejo documento
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        });
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        
        const evento = await Evento.findById( eventoId );
        console.log(evento);

        if( !evento ){
            return res.status( 404 ).json({
                ok:false,
                msg: 'Evento no existe por ese ID'
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para elimiar este evento'
            });
        }

        //En la BD buscar y elimiar el evento con el Id eventoID
       await Evento.findByIdAndDelete( eventoId);
        
       res.json({
            ok: true,
            evento: `El evento ${eventoId} ha sido eliminado`
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admimistrador'
        });
    }

    
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}