export function loadAdminPrestamos() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <h2 style="text-align: center; margin-bottom: 20px;">Gestión de Préstamos y Devoluciones</h2>
    <button id="addPrestamoBtn" style="display: block; margin: 0 auto; padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; margin-bottom: 20px;">Nuevo Préstamo</button>
    
    <div id="prestamoForm" style="display:none; margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 5px; max-width: 600px; margin: 0 auto;">
      <h3 style="text-align: center;">Registrar Préstamo</h3>
      <select id="cedulaEstudiante" style="margin: 5px; padding: 5px; width: 100%; display: block; margin-bottom: 10px;">
        <option value="">Selecciona un Estudiante</option>
      </select>
      <div id="librosContainer">
        <input class="codigoLibro" type="text" placeholder="Código del Libro" style="margin: 5px; padding: 5px; width: 100%; display: block; margin-bottom: 10px;" />
      </div>
      <button id="addLibroBtn" style="display: block; margin: 0 auto; padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; margin-top: 10px;">Añadir otro libro</button>
      <input id="fechaPrestamo" type="date" style="margin: 5px; padding: 5px; width: 100%; display: block; margin-top: 10px; margin-bottom: 10px;" />
      <input id="fechaEntrega" type="date" style="margin: 5px; padding: 5px; width: 100%; display: block; margin-bottom: 10px;" />
      <button id="savePrestamoBtn" style="display: block; margin: 0 auto; padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; margin-top: 10px;">Guardar Préstamo</button>
    </div>

    <h3 style="text-align: center; margin-top: 40px;">Devolución de Libros</h3>
    <table id="prestamosTable" style="width: 100%; border-collapse: collapse; margin-top: 20px; text-align: center;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 10px;">Cédula Estudiante</th>
          <th style="border: 1px solid #ddd; padding: 10px;">Códigos de Libros</th>
          <th style="border: 1px solid #ddd; padding: 10px;">Fecha Préstamo</th>
          <th style="border: 1px solid #ddd; padding: 10px;">Fecha Entrega</th>
          <th style="border: 1px solid #ddd; padding: 10px;">Estado</th>
          <th style="border: 1px solid #ddd; padding: 10px;">Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  const addPrestamoBtn = document.getElementById('addPrestamoBtn')!;
  const prestamoForm = document.getElementById('prestamoForm')!;
  const savePrestamoBtn = document.getElementById('savePrestamoBtn')!;
  const cedulaSelect = document.getElementById('cedulaEstudiante') as HTMLSelectElement;
  const librosContainer = document.getElementById('librosContainer')!;
  const addLibroBtn = document.getElementById('addLibroBtn')!;

  // Mostrar formulario de préstamo
  addPrestamoBtn.addEventListener('click', () => {
    prestamoForm.style.display = prestamoForm.style.display === 'none' ? 'block' : 'none';
    cargarEstudiantes();
  });

  // Añadir un campo de libro
  addLibroBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.className = 'codigoLibro';
    input.type = 'text';
    input.placeholder = 'Código del Libro';
    input.style.margin = '5px';
    input.style.padding = '5px';
    input.style.width = '100%';
    input.style.display = 'block';
    input.style.marginBottom = '10px';
    librosContainer.appendChild(input);
  });

  // Guardar el préstamo
  savePrestamoBtn.addEventListener('click', async () => {
    const codigosLibros = Array.from(document.querySelectorAll('.codigoLibro')).map(
      (input) => (input as HTMLInputElement).value.trim()
    );

    const nuevoPrestamo = {
      cedula_estudiante: cedulaSelect.value,
      codigos_libros: codigosLibros.filter(Boolean),
      fecha_prestamo: (document.getElementById('fechaPrestamo') as HTMLInputElement).value,
      fecha_entrega: (document.getElementById('fechaEntrega') as HTMLInputElement).value,
    };

    // Verificar que todos los campos estén completos
    if (!nuevoPrestamo.cedula_estudiante || nuevoPrestamo.codigos_libros.length === 0) {
      alert('Por favor, completa toda la información requerida.');
      return;
    }

    // Realizar la solicitud POST para cada libro de manera individual
    try {
      const promises = nuevoPrestamo.codigos_libros.map(async (codigo_libro) => {
        const response = await fetch('http://localhost:3000/api/prestamos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cedula_estudiante: nuevoPrestamo.cedula_estudiante,
            codigos_libros: [codigo_libro],
            fecha_prestamo: nuevoPrestamo.fecha_prestamo,
            fecha_entrega: nuevoPrestamo.fecha_entrega,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Hubo un problema al registrar el préstamo.');
        }

        return response.json();
      });

      const resultados = await Promise.all(promises);

      alert('Préstamos registrados con éxito.');
      cargarPrestamos();
    } catch (error) {
      console.error('Error al registrar los préstamos:', error);
      alert('Hubo un error al registrar los préstamos. Intenta nuevamente.');
    }
  });

  cargarPrestamos();
}

function registrarDevolucion(id: number) {
  const fechaDevolucion = new Date().toDateString();

  fetch(`http://localhost:3000/api/prestamos/devolucion/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fecha_devolucion: fechaDevolucion }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message || 'Devolución registrada.');
      cargarPrestamos();

      // Llamar al endpoint para sancionar al estudiante
      sancionarEstudiante(data.cedula_estudiante);
    })
    .catch((error) => console.error('Error al registrar devolución:', error));
}

function sancionarEstudiante(cedula: string) {
  fetch(`http://localhost:3000/api/estudiantes/sancionar/${cedula}`, {
    method: 'PUT',
  })
    .then(() => {
      // Recargar la tabla de estudiantes después de sancionar
      cargarEstudiantes();
    })
    .catch((error) => console.error('Error al sancionar al estudiante:', error));
}

function cargarPrestamos() {
  fetch('http://localhost:3000/api/prestamos')
    .then((response) => response.json())
    .then((data) => {
      const prestamosTable = document.querySelector('#prestamosTable tbody') as HTMLTableSectionElement;
      prestamosTable.innerHTML = '';

      if (data.length === 0) {
        const row = prestamosTable.insertRow();
        row.innerHTML = `<td colspan="6">No hay préstamos registrados.</td>`;
      }

      data.forEach((prestamo: any) => {
        const devuelto = prestamo.devuelto === null ? false : prestamo.devuelto;

        const row = prestamosTable.insertRow();
        row.innerHTML = `
          <td>${prestamo.cedula_estudiante}</td>
          <td>${prestamo.codigo_libro}</td>
          <td>${prestamo.fecha_prestamo}</td>
          <td>${prestamo.fecha_entrega}</td>
          <td>${devuelto ? 'Devuelto' : 'Pendiente'}</td>
          <td>${devuelto ? `Devolución: ${prestamo.fecha_devolucion || 'No registrada'}` : '<button style="background-color: #F44336; color: white; padding: 5px 10px; border: none; border-radius: 5px;">Devolver</button>'}</td>
        `;

        if (!devuelto) {
          const button = row.querySelector('button')!;
          button.addEventListener('click', () => registrarDevolucion(prestamo.id));
          cargarEstudiantes();
        }
      });
      
    })
    .catch((error) => console.error('Error al cargar los préstamos:', error));
}

function cargarEstudiantes() {
  fetch('http://localhost:3000/api/estudiantes')
    .then((response) => response.json())
    .then((data) => {
      const cedulaSelect = document.getElementById('cedulaEstudiante') as HTMLSelectElement;
      cedulaSelect.innerHTML = '<option value="">Selecciona un Estudiante</option>';
      data.forEach((estudiante: any) => {
        const option = document.createElement('option');
        option.value = estudiante.cedula;
        option.textContent = `${estudiante.nombre} ${estudiante.apellido}`;
        cedulaSelect.appendChild(option);
      });
    })
    .catch((error) => console.error('Error al cargar los estudiantes:', error));
}
    
