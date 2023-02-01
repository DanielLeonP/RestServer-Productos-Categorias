const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');
const validarCampos = require('../midlewares/validar-campos');
const { esAdminRole } = require('../midlewares/validar-roles');
const { validarJWT } = require('../midlewares/validarJWT');


const router = Router();

router.get('/', obtenerProductos);

//Obtener Producto por id
router.get('/:id',
    [
        check('id', 'No es un id de mongo válido').isMongoId(),
        check('id').custom(existeProducto),
        validarCampos
    ],
    obtenerProducto
);

//Crear Producto - privado - cualquier persona con un token valido
router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'La categoria no es un id de Mongo válido').isMongoId(),
        check('categoria').custom(existeCategoria),
        validarCampos
    ],
    crearProducto
);

//Actualizar Producto por id - cualquiera con token valido
router.put('/:id',
    [
        validarJWT,
        check('id', 'No es un id de mongo válido').isMongoId(),
        check('id').custom(existeProducto),
        check('categoria', 'La categoria no es un id de Mongo válido').isMongoId(),
        check('categoria').custom(existeCategoria),
        validarCampos
    ],
    actualizarProducto
);

//Borrar Producto por id - Solo Admins
router.delete('/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un id de mongo válido').isMongoId(),
        check('id').custom(existeProducto),
        validarCampos
    ],
    borrarProducto
);


module.exports = router;