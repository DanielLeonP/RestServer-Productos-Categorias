const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSigIn } = require('../controllers/auth');
const validarCampos = require('../midlewares/validar-campos');

const router = Router();

router.post('/login',
    [
        check('correo', ' EL correo es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ]
    , login);
router.post('/google',
    [
        check('id_token', 'El id_token de Google es necesario').not().isEmpty(),
        validarCampos
    ]
    , googleSigIn);

module.exports = router;