const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'biblioteca',
  password: 'admin1',
  port: 5432,
});

// Agregar estudiante
async function addEstudiante({ cedula, nombre, apellido, sexo, fecha_nacimiento }) {
  const query = 'INSERT INTO estudiantes (cedula, nombre, apellido, sexo, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5)';
  const values = [cedula, nombre, apellido, sexo, fecha_nacimiento];
  
  try {
    await pool.query(query, values);
  } catch (error) {
    throw error;
  }
}

// Obtener estudiantes
async function getEstudiantes(filters = {}) {
  let query = 'SELECT * FROM estudiantes';
  const values = [];
  if (filters.cedula) {
    query += ' WHERE cedula = $1';
    values.push(filters.cedula);
  }

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// Actualizar estudiante
async function updateEstudiante(cedula, { nombre, apellido, sexo, fecha_nacimiento }) {
  const query = `
    UPDATE estudiantes
    SET nombre = $1, apellido = $2, sexo = $3, fecha_nacimiento = $4
    WHERE cedula = $5 RETURNING *
  `;
  const values = [nombre, apellido, sexo, fecha_nacimiento, cedula];

  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Devuelve el estudiante actualizado
  } catch (error) {
    throw error;
  }
}

// Eliminar estudiante
async function deleteEstudiante(cedula) {
  const query = 'DELETE FROM estudiantes WHERE cedula = $1 RETURNING *';
  const values = [cedula];

  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Devuelve el estudiante eliminado
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addEstudiante,
  getEstudiantes,
  updateEstudiante,
  deleteEstudiante,
};
