const { Schema, model } = require('mongoose');
const categoria = require('./categoria');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Usuario requierido']
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'La categoria es obligatoria']
    },
    descripcion: {
        type: String,
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
    }
});

ProductoSchema.methods.toJSON = function () {
    const { __v, ...producto } = this.toObject();
    return producto;
}

module.exports = model('Producto', ProductoSchema);