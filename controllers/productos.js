const { request, response } = require("express");
const { Producto } = require('../models');

const crearProducto = async (req = request, res = response) => {
    try {
        //nombre, estado, usuario, precio, categoria,descripcion, disponible
        const { estado, usuario, ...data } = req.body;
        console.log({ data })
        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.user._id;
        console.log({ data })

        const { nombre } = data;
        const productoDB = await Producto.findOne({ nombre });

        if (productoDB) {
            return res.status(400).json({ msg: `El producto ${productoDB.nombre} ya existe.` });
        }

        const producto = new Producto(data);

        // Guardar en DB
        await producto.save();

        res.status(201).json({ msg: 'POST Producto', producto });
    } catch (error) {
        console.log(error)
        return res.status(500).json(error.message);
    }
}

// Obtener categorias - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
    try {
        const { limit = 5, desde = 0 } = req.query;

        const query = { estado: true };

        const [total, productos] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
            Producto.countDocuments(query), //Cantidad de registros en BD
            Producto.find(query)//Se pueden enviar condiciones
                .limit(Number(limit))
                .skip(Number(desde))
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
        ]);

        res.status(200).json({ 'msg': 'GET Productos', total, productos });
    } catch (error) {
        console.log(error);
    }
}
// Obtener categoria - populate
const obtenerProducto = async (req = request, res = response) => {
    try {
        const { id } = req.query;

        const productoDB = await Producto.findOne({ id })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');

        res.status(200).json(productoDB);

    } catch (error) {
        console.log(error)
    }
}
// Actualizar categoria
const actualizarProducto = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado, usuario, ...data } = req.body;

        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.user._id;

        const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({ 'msg': 'Update Producto', producto });
    } catch (error) {
        console.log(error)
    }
}
// Borrar categoria (estado: false)
const borrarProducto = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({ 'msg': 'DELETE Producto', producto });
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}