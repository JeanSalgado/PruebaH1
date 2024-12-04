const express = require('express');
const { verificarDisponibilidadLibros, verificarSancionEstudiante, registrarPrestamo, registrarDevolucion, obtenerTodosLosPrestamos, aplicarSancion } = require('../models/prestamos');

const router = express.Router();

// Ruta para obtener todos los préstamos
router.get('/', async (req, res) => {
  try {
    // Obtener todos los préstamos (ajusta esto según tu modelo)
    const prestamos = await obtenerTodosLosPrestamos(); // Debes implementar esta función en tu modelo
    res.status(200).json(prestamos);
  } catch (error) {
    console.error('Error al obtener los préstamos:', error);
    res.status(500).json({ error: 'Error al obtener los préstamos.' });
  }
});

// Registrar préstamo con múltiples libros
router.post('/', async (req, res) => {
  const { cedula_estudiante, codigos_libros, fecha_prestamo, fecha_entrega } = req.body;

  try {
    console.log("Datos recibidos:", req.body); // Verifica que los datos llegan correctamente

    // Verificar disponibilidad de los libros
    const librosNoDisponibles = await verificarDisponibilidadLibros(codigos_libros);
    if (librosNoDisponibles.length > 0) {
      console.log("Libros no disponibles:", librosNoDisponibles); // Verifica qué libros están fuera de disponibilidad
      return res.status(400).json({ error: `Los siguientes libros no están disponibles: ${librosNoDisponibles.join(', ')}` });
    }

    // Verificar si el estudiante está sancionado
    const sancionado = await verificarSancionEstudiante(cedula_estudiante);
    if (sancionado) {
      console.log("Estudiante sancionado:", cedula_estudiante); // Verifica si el estudiante está sancionado
      return res.status(400).json({ error: 'El estudiante está sancionado y no puede realizar préstamos.' });
    }

    // Registrar los préstamos de los libros
    for (const codigo_libro of codigos_libros) {
      const result = await registrarPrestamo({ cedula_estudiante, codigo_libro, fecha_prestamo, fecha_entrega });
      console.log("Préstamo registrado para el libro:", codigo_libro, result); // Verifica el resultado del registro
    }

    res.status(201).json({ message: 'Préstamo registrado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar el préstamo:', error); // Imprime cualquier error para depuración
    res.status(500).json({ error: 'Error al registrar el préstamo.' });
  }
});


// Registrar devolución de libro
router.put('/devolucion/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha_devolucion } = req.body;

  try {
    const prestamo = await registrarDevolucion(id, fecha_devolucion);
    // Verificar si la devolución está fuera de tiempo y aplicar sanción si es necesario
    const fechaEntrega = new Date(prestamo.fecha_entrega);
    const fechaDevolucion = new Date(fecha_devolucion);

    if (fechaDevolucion > fechaEntrega) {
      // Sancionar al estudiante por 15 días
      await aplicarSancion(prestamo.cedula_estudiante);
    }

    res.status(200).json({ message: 'Devolución registrada correctamente.' });
  } catch (error) {
    console.error('Error al registrar la devolución:', error);
    res.status(500).json({ error: 'Error al procesar la devolución.' });
  }
});

// Ruta para obtener los préstamos activos
router.get('/prestamos', async (req, res) => {
  try {
    const prestamosActivos = await db.query(
      'SELECT * FROM prestamos WHERE devuelto IS NULL OR devuelto = false'
    );
    res.json(prestamosActivos.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los préstamos activos.' });
  }
});

// Ruta para obtener los préstamos devueltos
router.put('/devolucion/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha_devolucion } = req.body;

  try {
    // Registrar devolución en la tabla de préstamos
    const prestamo = await registrarDevolucion(id, fecha_devolucion);

    // Comparar fechas para sanción
    const fechaEntrega = new Date(prestamo.fecha_entrega);
    const fechaDevolucion = new Date(fecha_devolucion);

    if (fechaDevolucion > fechaEntrega) {
      // Aplicar sanción al estudiante si devolvió fuera del plazo
      await aplicarSancion(prestamo.cedula_estudiante);
    }

    res.status(200).json({ message: 'Devolución registrada correctamente.' });
  } catch (error) {
    console.error('Error al registrar la devolución:', error);
    res.status(500).json({ error: 'Error al procesar la devolución.' });
  }
});



module.exports = router;
