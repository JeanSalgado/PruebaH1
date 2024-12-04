const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'biblioteca',
  password: 'admin1',
  port: 5432,
});

// Verificar disponibilidad de los libros
const verificarDisponibilidadLibros = async (codigos_libros) => {
  const query = `
    SELECT codigo_libro FROM prestamos
    WHERE codigo_libro = ANY($1) AND devuelto = false
  `;
  const { rows } = await pool.query(query, [codigos_libros]);
  return rows.map(row => row.codigo_libro); // Libros no disponibles
};

// Verificar si el estudiante está sancionado
const verificarSancionEstudiante = async (cedula_estudiante) => {
  const query = `
    SELECT sancion_activa_hasta FROM estudiantes
    WHERE cedula = $1
  `;
  const { rows } = await pool.query(query, [cedula_estudiante]);
  return rows.length > 0 && new Date(rows[0].sancion_activa_hasta) > new Date();
};

const registrarPrestamo = async ({ cedula_estudiante, codigo_libro, fecha_prestamo, fecha_entrega }) => {
  const queryLibroDisponible = `
    SELECT disponibilidad 
    FROM libros
    WHERE codigo = $1
  `;

  const queryPrestamo = `
    INSERT INTO prestamos (cedula_estudiante, codigo_libro, fecha_prestamo, fecha_entrega, devuelto)
    VALUES ($1, $2, $3, $4, false)
  `;
  
  const queryLibro = `
    UPDATE libros
    SET disponibilidad = false
    WHERE codigo = $1
  `;
  
  const client = await pool.connect();
  try {
    // Verificar si el libro está disponible
    const { rows } = await client.query(queryLibroDisponible, [codigo_libro]);
    if (rows.length === 0 || rows[0].disponibilidad === false) {
      throw new Error('El libro no está disponible para préstamo.');
    }

    // Registrar el préstamo
    await client.query(queryPrestamo, [cedula_estudiante, codigo_libro, fecha_prestamo, fecha_entrega]);

    // Cambiar la disponibilidad del libro a false
    await client.query(queryLibro, [codigo_libro]);

  } catch (error) {
    console.error('Error al registrar el préstamo:', error);
    throw error;  // Lanza el error para que lo manejes en el lugar que lo llame
  } finally {
    client.release();  // Liberar la conexión
  }
};



// Registrar devolución y aplicar sanción si es necesario
const registrarDevolucion = async (id, fecha_devolucion) => {
  const query = `
    SELECT cedula_estudiante, fecha_entrega, codigo_libro
    FROM prestamos
    WHERE id = $1
  `;

  const queryLibro = `
    UPDATE libros
    SET disponibilidad = true
    FROM prestamos
    WHERE prestamos.codigo_libro = libros.codigo
    AND prestamos.id = $1
  `;

  const { rows } = await pool.query(query, [id]);
  const prestamo = rows[0];
  const sancionar = new Date(fecha_devolucion) > new Date(prestamo.fecha_entrega);

  // Actualizar la devolución del préstamo
  await pool.query(`
    UPDATE prestamos 
    SET fecha_devolucion = $1, devuelto = true
    WHERE id = $2
  `, [fecha_devolucion, id]);

  // Cambiar la disponibilidad del libro a true utilizando INNER JOIN
  await pool.query(queryLibro, [id]);

  // Si el estudiante se retrasa, sancionarlo
  if (sancionar) {
    const sancionHasta = new Date();
    sancionHasta.setDate(sancionHasta.getDate() + 15); // Sanción de 15 días
    await pool.query(`
      UPDATE estudiantes 
      SET sancion_activa_hasta = $1, sancionado = true
      WHERE cedula = $2
    `, [sancionHasta.toISOString(), prestamo.cedula_estudiante]);
  }
};


// Función para obtener todos los préstamos
async function obtenerTodosLosPrestamos() {
  try {
    // Suponiendo que tienes una base de datos SQL o NoSQL, puedes usar el siguiente código para obtener los préstamos
    const prestamos = await pool.query('SELECT * FROM prestamos'); // Esto depende de tu base de datos
    return prestamos.rows; // Ajusta el formato según la estructura de tu base de datos
  } catch (error) {
    console.error('Error al obtener los préstamos:', error);
    throw new Error('No se pudieron obtener los préstamos');
  }
}
async function aplicarSancion(cedulaEstudiante) {
  try {
    const result = await pool.query(
      'UPDATE estudiantes SET sancion = $1 WHERE cedula = $2',
      ['Si', cedulaEstudiante]
    );
    return result.rowCount > 0; // Devuelve true si se actualizó la sanción
  } catch (error) {
    console.error('Error al aplicar sanción:', error);
    throw new Error('No se pudo aplicar la sanción.');
  }
}




module.exports = { verificarDisponibilidadLibros, verificarSancionEstudiante, registrarPrestamo, registrarDevolucion, obtenerTodosLosPrestamos, aplicarSancion };
