const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');
const login = async (req = request, res = response) => {
    const { correo, password } = req.body;
    try {
        // Verificar si el correo existe
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(400).json({ msg: 'Usuario / Password no son correctos - correo' });
        }

        //Verificar si el usuario esta activo
        if (!user.estado) {
            return res.status(400).json({ msg: 'Usuario / Password no son correctos - estado:false' });
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Usuario / Password no son correctos - password' });
        }
        // Generar el JWT
        const token = await generarJWT(user.id);

        res.status(400).json({ msg: 'Login OK', user, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error, hbale con el administrador' });
    }
}
const googleSigIn = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);

        let user = await User.findOne({ correo });
        // console.log(user)
        if (!user) { //Crear user en bd
            const data = {
                nombre,
                correo,
                password: 'default',
                img,
                google: true,
                rol: 'USER_ROLE'
            };
            user = new User(data);
            await user.save();
        }

        //Si user en DB 
        if (!user.estado) {
            return res.status(400).json({ msg: 'Usuario bloqueado' });
        }

        // Generar el JWT
        const token = await generarJWT(user.id);


        res.status(200).json({ user, token });

    } catch (error) {
        res.status(400).json({ msg: 'El token no se pudo verificar.' });
        // console.log(error)
    }
}
module.exports = {
    login,
    googleSigIn
}