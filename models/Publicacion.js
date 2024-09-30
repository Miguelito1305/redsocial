const mongoose = require('mongoose');

const PublicacionSchema = new mongoose.Schema({
    texto: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fechaPublicacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Publicacion', PublicacionSchema);
