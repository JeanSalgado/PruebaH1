const express = require('express');
const { addEstudiante, getEstudiantes, updateEstudiante, deleteEstudiante } = require('../models/estudiantes'); // Asegúrate de que estas funciones estén bien definidas en tu modelo
const router = express.Router();

// Registrar estudiante
router.post('/', async (req, res) => {
  const { cedula, nombre, apellido, sexo, fecha_nacimiento } = req.body;

  // Validación básica de datos
  if (!cedula || !nombre || !apellido || !sexo || !fecha_nacimiento) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    // Verificar si ya existe un estudiante con esa cédula
    const estudianteExistente = await getEstudiantes({ cedula });
    if (estudianteExistente.length > 0) {
      return res.status(409).json({ message: 'Ya existe un estudiante con esa cédula' });
    }

    await addEstudiante({ cedula, nombre, apellido, sexo, fecha_nacimiento });
    res.status(201).json({ message: 'Estudiante registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el estudiante', error: error.message });
  }
});

// Obtener estudiantes
router.get('/', async (req, res) => {
  try {
    const estudiantes = await getEstudiantes();
    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los estudiantes', error: error.message });
  }
});

// Editar estudiante
router.put('/:cedula', async (req, res) => {
  const { cedula } = req.params;
  const { nombre, apellido, sexo, fecha_nacimiento } = req.body;

  // Validación de los datos
  if (!nombre || !apellido || !sexo || !fecha_nacimiento) {
    return res.status(400).json({ message: 'Faltan datos requeridos para actualizar' });
  }

  try {
    const updatedEstudiante = await updateEstudiante(cedula, { nombre, apellido, sexo, fecha_nacimiento });
    if (updatedEstudiante) {
      res.status(200).json({ message: 'Estudiante actualizado con éxito' });
    } else {
      res.status(404).json({ message: 'Estudiante no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estudiante', error: error.message });
  }
});

// Eliminar estudiante
router.delete('/:cedula', async (req, res) => {
  const { cedula } = req.params;

  try {
    // Verifica si el estudiante existe antes de intentar eliminarlo
    const estudianteExistente = await getEstudiantes({ cedula });
    if (estudianteExistente.length === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const result = await deleteEstudiante(cedula); // Elimina el estudiante basado en la cédula
    if (result) {
      res.status(200).json({ message: 'Estudiante eliminado con éxito' });
    } else {
      res.status(404).json({ message: 'Estudiante no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el estudiante:', error);
    res.status(500).json({ message: 'Error al eliminar el estudiante', error: error.message });
  }
});

module.exports = router;