const express = require('express');
const router = express.Router();
const Publicacion = require('../models/Publicacion');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ mensaje: 'Acceso denegado' });

    try {
        const verificado = jwt.verify(token, 'secreto');
        req.usuarioId = verificado.id;
        next();
    } catch (error) {
        res.status(400).json({ mensaje: 'Token inválido' });
    }
};

// Crear una nueva publicación
router.post('/', auth, async (req, res) => {
    const { texto } = req.body;

    try {
        const nuevaPublicacion = new Publicacion({ texto, autor: req.usuarioId });
        await nuevaPublicacion.save();
        res.status(201).json(nuevaPublicacion);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la publicación', error });
    }
});

// Obtener todas las publicaciones
router.get('/', async (req, res) => {
    try {
        const publicaciones = await Publicacion.find().populate('autor', 'nombre email');
        res.json(publicaciones);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al obtener publicaciones', error });
    }
});

module.exports = router;
