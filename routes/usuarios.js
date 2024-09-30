const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Registro de usuario
router.post('/register', async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const contraseñaHash = await bcrypt.hash(contraseña, salt);

        const nuevoUsuario = new Usuario({ nombre, email, contraseña: contraseñaHash });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar usuario', error });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(400).json({ mensaje: 'Usuario no encontrado' });

        const esValido = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esValido) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: usuario._id }, 'secreto', { expiresIn: '1h' });
        res.json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error en el login', error });
    }
});

module.exports = router;
