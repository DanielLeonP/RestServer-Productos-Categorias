const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/upload');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../midlewares');
const validarCampos = require('../midlewares/validar-campos');

const router = Router();

router.post('/', [validarArchivoSubir], cargarArchivo);

router.put('/:coleccion/:id',
    [
        validarArchivoSubir,
        check('id', 'El id deve ser Mongo Id').isMongoId(),
        check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
        validarCampos
    ],
    // actualizarImagen
    actualizarImagenCloudinary
);

router.get('/:coleccion/:id',
    [
        check('id', 'El id deve ser Mongo Id').isMongoId(),
        check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
        validarCampos
    ],
    mostrarImagen
);

module.exports = router;