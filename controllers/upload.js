const { request, response } = require("express");
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require("../models");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async (req = request, res = response) => {
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //     return res.status(400).send('No hay archivos en la petición.');
    // }
    try {
        const nombre = await subirArchivo(req.files, undefined, 'textos') //['txt', 'md'] //sino se manda el arreglo de extensiones se puede poner undefined
        res.json({ nombre })
    } catch (error) {
        res.status(400).json({ error })
    }

}
const actualizarImagen = async (req = request, res = response) => {
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //     return res.status(400).send('No hay archivos en la petición.');
    // }

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con id ${id}` })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con id ${id}` })
            }
            break;

        default:
            return res.status(500).json({ msg: 'No se valido' })
    }
    // Eliminar imagen anterior
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion)
    modelo.img = nombre;

    await modelo.save();

    res.status(200).json({ id, coleccion, modelo });
}

const actualizarImagenCloudinary = async (req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con id ${id}` })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con id ${id}` })
            }
            break;

        default:
            return res.status(500).json({ msg: 'No se valido' })
    }
    // Eliminar imagen anterior
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        // console.log(public_id);
        cloudinary.uploader.destroy(public_id);
    }
    // console.log(req.files.archivo)
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();
    res.status(200).json({ modelo });
}

const mostrarImagen = async (req = request, res = response) => {
    const { id, coleccion } = req.params;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con id ${id}` })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con id ${id}` })
            }
            break;

        default:
            return res.status(500).json({ msg: 'No se valido' })
    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }
    const pathNoImagen = path.join(__dirname, '../assets/noImage.png');
    console.log(pathNoImagen)
    res.sendFile(pathNoImagen);
}
module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}