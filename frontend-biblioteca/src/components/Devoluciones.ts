export function loadDevoluciones() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <h2 style="text-align: center; margin-bottom: 20px;">Devoluciones Registradas</h2>
    <table id="devolucionesTable" style="width: 100%; border-collapse: collapse; margin-top: 20px; text-align: center;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 10px;">Cédula Estudiante</th>
          <th style="border: 1px solid #ddd; padding: 10px;">Código Libro</th>
          <th style="border: 1px solid #ddd; padding: 10px;">Fecha Devolución</th>
          <th style="border: 1px solid #ddd; padding: 10px;">Estado</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  // Cargar las devoluciones desde el backend
  fetch('http://localhost:3000/api/prestamos')  // Ruta para obtener todos los préstamos
    .then((response) => response.json())
    .then((data) => {
      const devolucionesTable = document.getElementById('devolucionesTable')!.getElementsByTagName('tbody')[0];
      devolucionesTable.innerHTML = '';  // Limpiar tabla antes de insertar nuevos registros

      // Filtrar solo los préstamos devueltos
      const prestamosDevueltos = data.filter((prestamo: any) => prestamo.devuelto === true);

      if (prestamosDevueltos.length === 0) {
        const row = devolucionesTable.insertRow();
        row.innerHTML = `<td colspan="4" style="text-align: center; padding: 10px;">No hay devoluciones registradas.</td>`;
      }

      // Recorrer y mostrar los datos de los préstamos devueltos
      prestamosDevueltos.forEach((devolucion: any) => {
        const row = devolucionesTable.insertRow();
        row.innerHTML = `
          <td style="border: 1px solid #ddd; padding: 10px;">${devolucion.cedula_estudiante}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${devolucion.codigo_libro}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${devolucion.fecha_devolucion}</td>
          <td style="border: 1px solid #ddd; padding: 10px;">${devolucion.devuelto ? 'Devuelto' : 'Pendiente'}</td>
        `;
      });
    })
    .catch((error) => console.error('Error al cargar las devoluciones:', error));
}
