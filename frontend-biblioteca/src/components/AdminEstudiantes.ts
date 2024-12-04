export function loadAdminEstudiantes() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
  <h2 style="text-align: center; margin-bottom: 20px;">Administrar Estudiantes</h2>
  <button id="addStudentBtn" style="margin-bottom: 20px; padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;">
    Agregar Nuevo Estudiante
  </button>

  <div id="studentForm" style="display:none; margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 5px; max-width: 600px; margin: 0 auto;">
    <input id="cedula" type="text" placeholder="Cédula" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;" disabled />
    <input id="nombre" type="text" placeholder="Nombre" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;" />
    <input id="apellido" type="text" placeholder="Apellido" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;" />
    
    <select id="sexo" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;">
      <option value="">Seleccione un sexo</option>
      <option value="M">Masculino</option>
      <option value="F">Femenino</option>
    </select>

    <input id="fecha_nacimiento" type="date" placeholder="Fecha de Nacimiento" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;" />
    
    <!-- Nuevo campo Sanción Activa Hasta -->
    <input id="sancion_activa_hasta" type="date" placeholder="Sanción Activa Hasta" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;" />

    <div style="margin-top: 20px; text-align: center;">
      <button id="saveStudentBtn" style="padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;">
        Guardar
      </button>
      <button id="cancelBtn" style="padding: 10px 15px; background-color: #f44336; color: white; border: none; border-radius: 5px; margin-left: 10px;">
        Cancelar
      </button>
    </div>
  </div>

  <table id="studentsTable" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <thead>
      <tr>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Cédula</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Nombre</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Apellido</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Sexo</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Fecha de Nacimiento</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Sancionado</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Sancionado Hasta</th> <!-- Nueva columna -->
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
`;

  const addStudentBtn = document.getElementById('addStudentBtn')!;
  const studentForm = document.getElementById('studentForm')!;
  const saveStudentBtn = document.getElementById('saveStudentBtn')!;
  const cancelBtn = document.getElementById('cancelBtn')!;

  // Mostrar el formulario para agregar estudiante
  addStudentBtn.addEventListener('click', () => {
    studentForm.style.display = studentForm.style.display === 'none' ? 'block' : 'none';
    if (studentForm.style.display === 'block') {
      // Limpiar los campos al mostrar el formulario
      (document.getElementById('cedula') as HTMLInputElement).value = '';
      (document.getElementById('nombre') as HTMLInputElement).value = '';
      (document.getElementById('apellido') as HTMLInputElement).value = '';
      (document.getElementById('sexo') as HTMLSelectElement).value = '';
      (document.getElementById('fecha_nacimiento') as HTMLInputElement).value = '';
      (document.getElementById('sancion_activa_hasta') as HTMLInputElement).value = ''; // Limpiar campo de sanción activa hasta
  
      // Habilitar el campo de cédula al agregar un nuevo estudiante
      (document.getElementById('cedula') as HTMLInputElement).disabled = false;
  
      saveStudentBtn.textContent = 'Guardar';
    }
  });

  // Cancelar la acción de agregar estudiante
  cancelBtn.addEventListener('click', () => {
    studentForm.style.display = 'none';
  });

  // Guardar o actualizar el estudiante
  saveStudentBtn.addEventListener('click', () => {
    const nuevoEstudiante = {
      cedula: (document.getElementById('cedula') as HTMLInputElement).value,
      nombre: (document.getElementById('nombre') as HTMLInputElement).value,
      apellido: (document.getElementById('apellido') as HTMLInputElement).value,
      sexo: (document.getElementById('sexo') as HTMLSelectElement).value,
      fecha_nacimiento: (document.getElementById('fecha_nacimiento') as HTMLInputElement).value,
      sancion_activa_hasta: (document.getElementById('sancion_activa_hasta') as HTMLInputElement).value,
    };

    if (!nuevoEstudiante.cedula || !nuevoEstudiante.nombre || !nuevoEstudiante.apellido || !nuevoEstudiante.sexo || !nuevoEstudiante.fecha_nacimiento) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    if (saveStudentBtn.textContent === 'Guardar') {
      // Crear un nuevo estudiante
      fetch('http://localhost:3000/api/estudiantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoEstudiante),
      })
        .then(() => {
          loadAdminEstudiantes(); // Recargar los estudiantes después de guardar
          studentForm.style.display = 'none'; // Ocultar el formulario después de guardar
        })
        .catch((error) => console.error('Error al agregar el estudiante:', error));
    } else {
      // Actualizar el estudiante existente
      fetch(`http://localhost:3000/api/estudiantes/${nuevoEstudiante.cedula}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoEstudiante),
      })
        .then(() => {
          loadAdminEstudiantes(); // Recargar los estudiantes después de actualizar
          studentForm.style.display = 'none'; // Ocultar el formulario después de actualizar
        })
        .catch((error) => console.error('Error al actualizar el estudiante:', error));
    }
  });

  // Cargar los estudiantes desde el backend
  fetch('http://localhost:3000/api/estudiantes')
    .then((response) => response.json())
    .then((data) => {
      const studentsTable = document.getElementById('studentsTable')!.getElementsByTagName('tbody')[0];
      studentsTable.innerHTML = '';
      data.forEach((estudiante: any) => {
        const row = studentsTable.insertRow();
        row.innerHTML = `
  <td style="border: 1px solid #ddd; padding: 10px;">${estudiante.cedula}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${estudiante.nombre}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${estudiante.apellido}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${estudiante.sexo}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${estudiante.fecha_nacimiento}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${estudiante.sancionado ? 'Sí' : 'No'}</td> 
  <td style="border: 1px solid #ddd; padding: 10px;">${estudiante.sancion_activa_hasta ? estudiante.sancion_activa_hasta : 'No tiene sanción'}</td> <!-- Nueva columna -->
  <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">
    <button class="editBtn" data-id="${estudiante.cedula}" style="background-color: #FF9800; color: white; padding: 5px 10px; border: none; border-radius: 5px; margin-right: 5px;">Editar</button>
    <button class="deleteBtn" data-id="${estudiante.cedula}" style="background-color: #F44336; color: white; padding: 5px 10px; border: none; border-radius: 5px;">Eliminar</button>
  </td>
`;
      });

      // Eliminar estudiante
      const deleteBtns = document.querySelectorAll('.deleteBtn');
      deleteBtns.forEach((btn: any) => {
        btn.addEventListener('click', (e: Event) => {
          const cedula = (e.target as HTMLButtonElement).getAttribute('data-id');
          if (cedula && confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
            fetch(`http://localhost:3000/api/estudiantes/${cedula}`, {
              method: 'DELETE',
            })
              .then(() => {
                loadAdminEstudiantes(); // Recargar la lista de estudiantes después de eliminar
              })
              .catch((error) => console.error('Error al eliminar el estudiante:', error));
          }
        });
      });

      // Editar estudiante
      const editBtns = document.querySelectorAll('.editBtn');
      editBtns.forEach((btn: any) => {
        btn.addEventListener('click', (e: Event) => {
          const cedula = (e.target as HTMLButtonElement).getAttribute('data-id');
          const estudiante = data.find((e: any) => e.cedula === cedula);
          if (estudiante) {
            (document.getElementById('cedula') as HTMLInputElement).value = estudiante.cedula;
            (document.getElementById('nombre') as HTMLInputElement).value = estudiante.nombre;
            (document.getElementById('apellido') as HTMLInputElement).value = estudiante.apellido;
            (document.getElementById('sexo') as HTMLSelectElement).value = estudiante.sexo;
            
            // Convertir la fecha de nacimiento al formato YYYY-MM-DD y asignarlo al campo de fecha
            const fechaNacimiento = new Date(estudiante.fecha_nacimiento);
            const fechaFormateada = fechaNacimiento.toISOString().split('T')[0];
            (document.getElementById('fecha_nacimiento') as HTMLInputElement).value = fechaFormateada;

            // Asignar el valor de "Sancionado Hasta"
            if (estudiante.sancion_activa_hasta) {
              (document.getElementById('sancion_activa_hasta') as HTMLInputElement).value = estudiante.sancion_activa_hasta;
            }
            
            studentForm.style.display = 'block';
            saveStudentBtn.textContent = 'Actualizar';
          }
        });
      });
    });
}
