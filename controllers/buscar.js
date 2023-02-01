const { request, response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require('mongoose').Types;
const coleccionesPermitidas = [
    'usuario',
    'categoria',
    'producto',
    'rol'
];

const buscarUsuario = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.status(200).json({
            results:
                (usuario)
                    ? [usuario] //if
                    : [] //else
        });
    }

    const regex = new RegExp(termino, 'i');
    const usaurios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    res.json({
        busqueda: termino,
        results:
            (usaurios)
                ? [usaurios] //if
                : [] //else 
    })
}

const buscarCategoria = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.status(200).json({
            results:
                (categoria)
                    ? [categoria] //if
                    : [] //else
        });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        $and: [{ estado: true }]
    });
    res.json({
        busqueda: termino,
        results:
            (categorias)
                ? [categorias] //if
                : [] //else 
    })
}
const buscarProducto = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.status(200).json({
            results:
                (producto)
                    ? [producto] //if
                    : [] //else
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $and: [{ estado: true }]
    }).populate('categoria', 'nombre');
    res.json({
        busqueda: termino,
        results:
            (productos)
                ? [productos] //if
                : [] //else 
    })
}

const buscar = async (req = request, res = response) => {
    try {
        const { coleccion, termino } = req.params;
        if (!coleccionesPermitidas.includes(coleccion)) {
            return res.status(400).json({ msg: `Las colecciones permitidas son: ${coleccionesPermitidas}` });
        }
        switch (coleccion) {
            case 'usuario':
                buscarUsuario(termino, res);
                break;
            case 'categoria':
                buscarCategoria(termino, res);
                break;
            case 'producto':
                buscarProducto(termino, res);
                break;

            default:
                res.status(200).json({ msg: 'Aun no se realiza la busqueda' });
        }
    } catch (error) {
        res.json(400).json(error.message);
    }

}

module.exports = {
    buscar
}