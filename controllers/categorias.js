const { request, response } = require("express");
const { Categoria } = require('../models');

const crearCategoria = async (req = request, res = response) => {
    try {
        const nombre = req.body.nombre.toUpperCase();

        const categoriaDB = await Categoria.findOne({ nombre });

        if (categoriaDB) {
            return res.status(400).json({ msg: `La categoria ${categoriaDB.nombre} ya existe.` });
        }

        // Generar la data a guardar
        const data = {
            nombre,
            usuario: req.user._id
        }
        const categoria = new Categoria(data);

        // Guardar en DB
        await categoria.save();

        res.status(201).json(categoria);
    } catch (error) {
        console.log(error)
    }
}

// Obtener categorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
    try {
        const { limit = 5, desde = 0 } = req.query;

        const query = { estado: true };

        const [total, categorias] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
            Categoria.countDocuments(query), //Cantidad de registros en BD
            Categoria.find(query)//Se pueden enviar condiciones
                .limit(Number(limit))
                .skip(Number(desde))
                .populate('usuario', 'nombre')
        ]);

        res.status(200).json({ 'msg': 'GET categorias', total, categorias });
    } catch (error) {
        console.log(error);
    }
}
// Obtener categoria - populate
const obtenerCategoria = async (req = request, res = response) => {
    try {
        const { id } = req.query;

        const categoriaDB = await Categoria.findOne({ id }).populate('usuario', 'nombre');

        res.status(200).json(categoriaDB);

    } catch (error) {
        console.log(error)
    }
}
// Actualizar categoria
const actualizarCategoria = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado, usuario, ...data } = req.body;

        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.user._id;

        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({ 'msg': 'DELETE categoria', categoria });
    } catch (error) {
        console.log(error)
    }
}
// Borrar categoria (estado: false)
const borrarCategoria = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

        res.status(200).json({ 'msg': 'DELETE categoria', categoria });
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}