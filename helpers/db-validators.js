const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const User = require("../models/user");

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

// Verificar correo
const emailExiste = async (correo = '') => {
    const existeEmail = await User.findOne({ correo });
    if (existeEmail) {
        throw new Error(`Correo '${correo}' ya se encuentra registrado`);
    }
}
const existeUsuarioPorId = async (id) => {
    const existeUsuario = await User.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id '${id}' no existe`);
    }
}

const existeCategoria = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id '${id}' no existe en categorias`);
    }
}
const existeProducto = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id '${id}' no existe en productos`);
    }
}

const coleccionesPermitidas = async (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La colección '${coleccion}' no es permitida, ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
};