const pool = require('../db');

const addLibro = async ({ codigo, categoria, editorial, nombre, autor, anio_publicacion, tipo, disponibilidad }) => {
  const query = `INSERT INTO libros (codigo, categoria, editorial, nombre, autor, anio_publicacion, tipo, disponibilidad)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
  const values = [codigo, categoria, editorial, nombre, autor, anio_publicacion, tipo, disponibilidad];
  await pool.query(query, values);
};

const getLibros = async () => {
  const res = await pool.query('SELECT * FROM libros');
  return res.rows;
};

const updateLibro = async (codigo, { categoria, editorial, nombre, autor, anio_publicacion, tipo, disponibilidad }) => {
  const query = `UPDATE libros SET categoria = $1, editorial = $2, nombre = $3, autor = $4, anio_publicacion = $5, tipo = $6, disponibilidad = $7
                 WHERE codigo = $8`;
  const values = [categoria, editorial, nombre, autor, anio_publicacion, tipo, disponibilidad, codigo];
  await pool.query(query, values);
};

const deleteLibro = async (codigo) => {
  const query = `DELETE FROM libros WHERE codigo = $1`;
  await pool.query(query, [codigo]);
};

module.exports = { addLibro, getLibros, updateLibro, deleteLibro };
