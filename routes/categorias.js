const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const validarCampos = require('../midlewares/validar-campos');
const { esAdminRole } = require('../midlewares/validar-roles');
const { validarJWT } = require('../midlewares/validarJWT');

const router = Router();

//Obtener todas las categorias - public
router.get('/', obtenerCategorias);

//Obtener categoria por id
router.get('/:id',
    [
        check('id', 'No es un id de mongo válido').isMongoId(),
        check('id').custom(existeCategoria),
        validarCampos
    ],
    obtenerCategoria
);

//Crear categoria - privado - cualquier persona con un token valido
router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearCategoria
);

//Actualizar categoria por id - cualquiera con token valido
router.put('/:id',
    [
        validarJWT,
        check('id', 'No es un id de mongo válido').isMongoId(),
        check('id').custom(existeCategoria),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarCategoria
);

//Borrar categoria por id - Solo Admins
router.delete('/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un id de mongo válido').isMongoId(),
        check('id').custom(existeCategoria),
        validarCampos
    ],
    borrarCategoria
);


module.exports = router;