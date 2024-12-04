export function loadAdminLibros() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
  <h2 style="text-align: center; margin-bottom: 20px;">Administrar Libros</h2>
  <button id="addBookBtn" style="margin-bottom: 20px; padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;">
    Agregar Nuevo Libro
  </button>

  <div id="bookForm" style="display:none; margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 5px; max-width: 600px; margin: 0 auto;">
    <input id="codigo" type="text" placeholder="Código" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;" />
    <input id="nombre" type="text" placeholder="Nombre" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;" />
    <input id="autor" type="text" placeholder="Autor" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;" />
    <input id="editorial" type="text" placeholder="Editorial" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;" />
    <input id="anio_publicacion" type="number" placeholder="Año de Publicación" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;" />

    <select id="categoria" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;">
      <option value="">Seleccione una categoría</option>
      <option value="Literatura">Literatura</option>
      <option value="Salud">Salud</option>
      <option value="Informática">Informática</option>
      <option value="Erótico">Erótico</option>
    </select>

    <select id="tipo" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;">
      <option value="libro">Libro</option>
      <option value="revista">Revista</option>
    </select>

    <select id="disponibilidad" style="margin: 5px 0; padding: 8px; width: 100%; box-sizing: border-box;">
      <option value="Disponible">Disponible</option>
      <option value="No disponible">No disponible</option>
    </select>

    <div style="margin-top: 20px; text-align: center;">
      <button id="saveBookBtn" style="padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;">
        Guardar
      </button>
      <button id="cancelBtn" style="padding: 10px 15px; background-color: #f44336; color: white; border: none; border-radius: 5px; margin-left: 10px;">
        Cancelar
      </button>
    </div>
  </div>

  <table id="booksTable" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <thead>
      <tr>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Código</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Categoría</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Editorial</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Nombre</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Autor</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Año de Publicación</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Tipo</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Disponibilidad</th> 
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
`;


  const addBookBtn = document.getElementById('addBookBtn')!;
  const bookForm = document.getElementById('bookForm')!;
  const saveBookBtn = document.getElementById('saveBookBtn')!;
  const cancelBtn = document.getElementById('cancelBtn')!;

  // Mostrar el formulario para agregar libro
  addBookBtn.addEventListener('click', () => {
    bookForm.style.display = bookForm.style.display === 'none' ? 'block' : 'none';
    if (bookForm.style.display === 'block') {
      // Limpiar los campos al mostrar el formulario
      (document.getElementById('codigo') as HTMLInputElement).value = '';
      (document.getElementById('nombre') as HTMLInputElement).value = '';
      (document.getElementById('autor') as HTMLInputElement).value = '';
      (document.getElementById('editorial') as HTMLInputElement).value = '';
      (document.getElementById('anio_publicacion') as HTMLInputElement).value = '';
      (document.getElementById('categoria') as HTMLSelectElement).value = '';
      (document.getElementById('tipo') as HTMLSelectElement).value = 'libro';
    }
  });


  // Cancelar la acción de agregar libro
  cancelBtn.addEventListener('click', () => {
    bookForm.style.display = 'none';
  });

  // Guardar el libro
  saveBookBtn.addEventListener('click', () => {
    const nuevoLibro = {
      codigo: (document.getElementById('codigo') as HTMLInputElement).value,
      categoria: (document.getElementById('categoria') as HTMLSelectElement).value,
      editorial: (document.getElementById('editorial') as HTMLInputElement).value,
      nombre: (document.getElementById('nombre') as HTMLInputElement).value,
      autor: (document.getElementById('autor') as HTMLInputElement).value,
      anio_publicacion: Number((document.getElementById('anio_publicacion') as HTMLInputElement).value),
      tipo: (document.getElementById('tipo') as HTMLSelectElement).value,
      disponibilidad: (document.getElementById('disponibilidad') as HTMLSelectElement).value,  // Agregado
    };

    if (!nuevoLibro.codigo || !nuevoLibro.nombre || !nuevoLibro.autor || !nuevoLibro.editorial || !nuevoLibro.anio_publicacion || !nuevoLibro.categoria || !nuevoLibro.disponibilidad) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    fetch('http://localhost:3000/api/libros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoLibro),
    })
      .then(() => {
        loadAdminLibros(); // Recargar los libros después de guardar
        bookForm.style.display = 'none'; // Ocultar el formulario después de guardar
      })
      .catch((error) => console.error('Error al agregar el libro:', error));
  });


  // Cargar los libros desde el backend
  fetch('http://localhost:3000/api/libros')
    .then((response) => response.json())
    .then((data) => {
      const booksTable = document.getElementById('booksTable')!.getElementsByTagName('tbody')[0];
      booksTable.innerHTML = '';
      data.forEach((libro: any) => {
        const row = booksTable.insertRow();
        row.innerHTML = `
  <td style="border: 1px solid #ddd; padding: 10px;">${libro.codigo}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${libro.categoria}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${libro.editorial}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${libro.nombre}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${libro.autor}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${libro.anio_publicacion}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${libro.tipo}</td>
  <td style="border: 1px solid #ddd; padding: 10px;">${libro.disponibilidad ? 'Disponible' : 'No disponible'}</td>
  <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">
    <button class="editBtn" data-id="${libro.codigo}" style="background-color: #FF9800; color: white; padding: 5px 10px; border: none; border-radius: 5px; margin-right: 5px;">Editar</button>
    <button class="deleteBtn" data-id="${libro.codigo}" style="background-color: #F44336; color: white; padding: 5px 10px; border: none; border-radius: 5px;">Eliminar</button>
  </td>`;

      });

      // Eliminar libro
      const deleteBtns = document.querySelectorAll('.deleteBtn');
      deleteBtns.forEach((btn: any) => {
        btn.addEventListener('click', (e: Event) => {
          const codigo = (e.target as HTMLButtonElement).dataset.id;
          fetch(`http://localhost:3000/api/libros/${codigo}`, {
            method: 'DELETE',
          }).then(() => {
            loadAdminLibros(); // Recargar los libros después de eliminar
          });
        });
      });

      // Editar libro
      const editBtns = document.querySelectorAll('.editBtn');
      editBtns.forEach((btn: any) => {
        btn.addEventListener('click', (e: Event) => {
          const codigo = (e.target as HTMLButtonElement).dataset.id;
          const libro = data.find((l: any) => l.codigo == codigo);
          if (libro) {
            (document.getElementById('codigo') as HTMLInputElement).value = libro.codigo;
            (document.getElementById('categoria') as HTMLInputElement).value = libro.categoria;
            (document.getElementById('editorial') as HTMLInputElement).value = libro.editorial;
            (document.getElementById('nombre') as HTMLInputElement).value = libro.nombre;
            (document.getElementById('autor') as HTMLInputElement).value = libro.autor;
            (document.getElementById('anio_publicacion') as HTMLInputElement).value = libro.anio_publicacion;
            (document.getElementById('tipo') as HTMLSelectElement).value = libro.tipo;
            (document.getElementById('disponibilidad') as HTMLSelectElement).value = libro.disponibilidad ? 'Disponible' : 'No disponible'; // Asignar disponibilidad
            bookForm.style.display = 'block';
      
            // Actualizar el manejador de eventos para guardar cambios
            saveBookBtn.onclick = () => {
              const libroEditado = {
                codigo: (document.getElementById('codigo') as HTMLInputElement).value,
                categoria: (document.getElementById('categoria') as HTMLInputElement).value,
                editorial: (document.getElementById('editorial') as HTMLInputElement).value,
                nombre: (document.getElementById('nombre') as HTMLInputElement).value,
                autor: (document.getElementById('autor') as HTMLInputElement).value,
                anio_publicacion: Number((document.getElementById('anio_publicacion') as HTMLInputElement).value),
                tipo: (document.getElementById('tipo') as HTMLSelectElement).value,
                disponibilidad: (document.getElementById('disponibilidad') as HTMLSelectElement).value,
              };
      
              fetch(`http://localhost:3000/api/libros/${codigo}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(libroEditado),
              })
                .then(() => loadAdminLibros()) // Recargar los libros después de guardar
                .catch((error) => console.error('Error al editar el libro:', error));
            };
          }
        });
      });
          });
        }