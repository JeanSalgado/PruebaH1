const express = require('express');
const { addLibro, getLibros, updateLibro, deleteLibro } = require('../models/libros');

const router = express.Router();

// Obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const libros = await getLibros();
    res.status(200).json(libros);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los libros', error: error.message });
  }
});

// Agregar un libro
router.post('/', async (req, res) => {
  const { codigo, categoria, editorial, nombre, autor, anio_publicacion, tipo, disponibilidad } = req.body;

  // Conversión de disponibilidad
  const disponibilidadBool = disponibilidad === 'Disponible' ? true : false;

  try {
    await addLibro({ codigo, categoria, editorial, nombre, autor, anio_publicacion, tipo, disponibilidad: disponibilidadBool });
    res.status(201).json({ message: 'Libro registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el libro', error: error.message });
  }
});


// Actualizar un libro
router.put('/:codigo', async (req, res) => {
  const { codigo } = req.params;
  const { categoria, editorial, nombre, autor, anio_publicacion, tipo, disponibilidad } = req.body;

  // Conversión de disponibilidad
  const disponibilidadBool = disponibilidad === 'Disponible' ? true : false;

  try {
    await updateLibro(codigo, { categoria, editorial, nombre, autor, anio_publicacion, tipo, disponibilidad: disponibilidadBool });
    res.status(200).json({ message: 'Libro actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el libro', error: error.message });
  }
});

// Eliminar un libro
router.delete('/:codigo', async (req, res) => {
  const { codigo } = req.params;
  try {
    await deleteLibro(codigo);
    res.status(200).json({ message: 'Libro eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el libro', error: error.message });
  }
});

module.exports = router;
