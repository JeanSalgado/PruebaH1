import { loadAdminLibros } from './components/AdminLibros.ts';
import { loadAdminEstudiantes } from './components/AdminEstudiantes.ts';
import { loadAdminPrestamos } from './components/AdminPrestamos.ts';
import { loadDevoluciones } from './components/Devoluciones.ts'; // Importar la función loadDevoluciones

// Función para cargar el contenido dependiendo del link seleccionado
document.getElementById('librosLink')?.addEventListener('click', () => {
  loadAdminLibros();
});

document.getElementById('estudiantesLink')?.addEventListener('click', () => {
  loadAdminEstudiantes();
});

document.getElementById('prestamosLink')?.addEventListener('click', () => {
  loadAdminPrestamos();
});

document.getElementById('devolucionesLink')?.addEventListener('click', () => {
  loadDevoluciones(); // Llamar a loadDevoluciones cuando se haga clic en "Devoluciones"
});

const loadContent = () => {
  loadAdminLibros(); // Cargar la vista de Libros por defecto
};

loadContent();  // Cargar por defecto al inicio
