const validarCamposm = require('../midlewares/validar-campos');
const validarRolesm = require('../midlewares/validar-roles');
const validarJWTm = require('../midlewares/validarJWT');
const validarArchivoSubirm = require('../midlewares/validar-archivo')
module.exports = {
    ...validarCamposm,
    ...validarRolesm,
    ...validarJWTm,
    ...validarArchivoSubirm
}