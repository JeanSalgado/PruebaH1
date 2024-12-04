const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const estudiantesRouter = require('./routes/estudiantes');
const librosRouter = require('./routes/libros');
const prestamosRouter = require('./routes/prestamos');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Definición del pool de la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Verificación de la conexión a la base de datos
pool.connect()
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch(err => console.error('Error de conexión a la base de datos', err));

app.use(express.json());
app.use(cors());
app.use('/api/estudiantes', estudiantesRouter);
app.use('/api/libros', librosRouter);
app.use('/api/prestamos', prestamosRouter); 

app.put('/api/estudiantes/sancion/:cedula', async (req, res) => {
  const { cedula } = req.params;
  const { sancion } = req.body;

  if (!cedula || sancion === undefined) {
    return res.status(400).json({ error: 'Cédula y sanción son obligatorios.' });
  }

  try {
    // Verificar si el estudiante existe
    const result = await pool.query('SELECT * FROM estudiantes WHERE cedula = $1', [cedula]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'El estudiante con la cédula proporcionada no existe.' });
    }

    // Actualizar la sanción
    await pool.query('UPDATE estudiantes SET sancion = $1 WHERE cedula = $2', [sancion, cedula]);
    res.json({ message: 'Sanción actualizada correctamente.', cedula, sancion });
  } catch (error) {
    console.error('Error al actualizar la sanción:', error);
    res.status(500).json({ error: 'Hubo un error al actualizar la sanción.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
