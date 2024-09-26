import {
  actualizarProducto,
  buscarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductos,
  obtenerProductosConEliminados,
  obtenerProductosEliminados,
  restaurarProducto,
} from "./crud-products.js";
import { setItemLocalStorage } from "./local-storage.js";

const d = document;

if (obtenerProductosConEliminados() === null)
  setItemLocalStorage("productos", []);

window.cargarProducto = cargarProducto;
window.manejarEliminarProducto = manejarEliminarProducto;
window.manejarBotonRestaurarProducto = manejarBotonRestaurarProducto;
window.ordenarProductos = ordenarProductos;

window.onload = () => {
  actualizarUI();
  agregarBotonesDeOrdenamiento();
};
d.getElementById("formulario-producto").onsubmit = manejarCrearProducto;
d.getElementById("btn-actualizar").onclick = manejarActualizarProducto;

function cargarProducto(id) {
  const producto = buscarProducto(id);
  if (!producto) return;
  d.getElementById("id-edicion").value = producto.id;
  d.getElementById("nombre").value = producto.nombre;
  d.getElementById("precio").value = producto.precio;
  d.getElementById("stock").value = producto.stock;
  d.getElementById("photoUri").value = producto.photoUri;

  // actualizando la interfaz del formulario para el modo editar
  d.getElementById("btn-crear").style.display = "none";
  d.getElementById("btn-actualizar").style.display = "inline";
}

function actualizarUI(productos = obtenerProductos()) {
  const lista = d.getElementById("lista-productos");
  lista.innerHTML = productos
    .map(
      (p) => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.photoUri}" alt="${p.nombre}" /> <span>${p.nombre}</span></td>
            <td>$${p.precio}</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn btn-success" onclick="cargarProducto(${p.id})">Editar</button>
                <button class="btn btn-danger" onclick="manejarEliminarProducto(${p.id})">Eliminar</button>
            </td>
        </tr>
    `
    )
    .join("");
}

function validateFormProduct({ nombre, precio, stock, photoUri }) {
  let regexNotNum = /^(?!\d+$).+/;
  const patternValidateImage =
    /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)(\?.*)?$/i;

  if (
    !regexNotNum.test(nombre) ||
    precio <= 0 ||
    stock < -1 ||
    !patternValidateImage.test(photoUri)
  ) {
    if (!regexNotNum.test(nombre)) alert("El nombre no puede ser un numero");
    if (precio <= 0) alert("El precio debe ser mayor a 0");
    if (stock < -1) alert("El stock debe ser mayor a 0");
    if (!patternValidateImage.test(photoUri)) {
      alert("Deber ser la uri de una imagen");
    }
    return false;
  }
  return true;
}

function manejarCrearProducto(event) {
  // evitando el comportamiento por defecto de los formularios (recargar la pagina)
  event.preventDefault();

  // obteniendo valores de los inputs
  const nombre = d.getElementById("nombre").value;
  const precio = parseFloat(d.getElementById("precio").value);
  const stock = parseFloat(d.getElementById("stock").value);
  const photoUri = d.getElementById("photoUri").value;

  if (!validateFormProduct({ nombre, precio, stock, photoUri })) return;
  try {
    crearProducto({ nombre, precio, stock, photoUri });
  } catch (err) {
    alert(err.message);
    return;
  }
  actualizarUI();
  this.reset();
  d.getElementById("search").value = "";
}

function manejarActualizarProducto(event) {
  // evitando el comportamiento por defecto de los formularios (recargar la pagina)
  event.preventDefault();
  const id = parseInt(d.getElementById("id-edicion").value);

  // obteniendo valores de los inputs
  const nombre = d.getElementById("nombre").value;
  const precio = parseFloat(d.getElementById("precio").value);
  const stock = parseFloat(d.getElementById("stock").value);
  const photoUri = d.getElementById("photoUri").value;

  if (!validateFormProduct({ nombre, precio, stock, photoUri })) return;

  try {
    actualizarProducto(id, { nombre, precio, stock, photoUri });
  } catch (err) {
    alert(err.message);
    return;
  }

  actualizarUI();
  d.getElementById("formulario-producto").reset();

  // actualizando la interfaz del formulario para el modo guardar
  d.getElementById("btn-crear").style.display = "inline";
  d.getElementById("btn-actualizar").style.display = "none";
  d.getElementById("search").value = "";
}

function manejarEliminarProducto(id) {
  const eleccion = prompt("¿Desea eliminar este producto?", "si", "no");
  if (eleccion !== "si") return;
  eliminarProducto(id);
  actualizarUI();
  renderizarProductosEliminados();
  d.getElementById("search").value = "";
}

// funciones para mostrar los productos eliminados
const botonMostrarProductosEliminados = d.getElementById(
  "boton-muestra-productos-eliminados"
);
const botonOcultarProductosEliminados = d.getElementById(
  "boton-ocultar-productos-eliminados"
);
botonMostrarProductosEliminados.onclick = mostrarProductosEliminados;
botonOcultarProductosEliminados.onclick = ocultarProductosEliminados;

function renderizarProductosEliminados() {
  const lista = d.getElementById("lista-produtos-eliminados");
  lista.innerHTML = obtenerProductosEliminados()
    .map(
      (p) => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>${p.stock}</td>
            <td>
                <button id="boton-restaurar-producto"
                onclick="manejarBotonRestaurarProducto(${p.id})"
                >Restaurar</button>
            </td>
        </tr>
    `
    )
    .join("");
}

function mostrarProductosEliminados() {
  botonMostrarProductosEliminados.style.display = "none";
  botonOcultarProductosEliminados.style.display = "inline";
  const contenedor = d.querySelector(".contenedor-tabla-productos-eliminados");
  contenedor.style = "display: block;";
  renderizarProductosEliminados();
}

function ocultarProductosEliminados() {
  botonMostrarProductosEliminados.style.display = "inline";
  botonOcultarProductosEliminados.style.display = "none";
  const contenedor = d.querySelector(".contenedor-tabla-productos-eliminados");
  contenedor.style = "display: none;";
}

function manejarBotonRestaurarProducto(id) {
  const eleccion = prompt("¿Desea restaurar este producto?", "si", "no");
  if (eleccion !== "si") return;
  restaurarProducto(id);
  actualizarUI();
  renderizarProductosEliminados();
}

//funciones para el ordenamiento
function ordenarProductos(campo, orden) {
  let productos = obtenerProductos();
  productos.sort((a, b) => {
    if (orden === "asc") {
      return a[campo] - b[campo];
    } else {
      return b[campo] - a[campo];
    }
  });
  actualizarUI(productos);
}

function agregarBotonesDeOrdenamiento() {
  const encabezadoPrecio = d.querySelector("th:nth-child(3)");
  const encabezadoStock = d.querySelector("th:nth-child(4)");

  encabezadoPrecio.innerHTML = `
    Precio
    <button onclick="ordenarProductos('precio', 'asc')" class="btn">↑</button>
    <button onclick="ordenarProductos('precio', 'desc')" class="btn">↓</button>
  `;

  encabezadoStock.innerHTML = `
    Stock
    <button onclick="ordenarProductos('stock', 'asc')" class="btn">↑</button>
    <button onclick="ordenarProductos('stock', 'desc')" class="btn">↓</button>
  `;
}

function manejarBusqueda(event) {
  const valor = event.target.value;
  const lista = d.getElementById("lista-productos");

  lista.innerHTML = obtenerProductos()
    .filter((producto) => producto.nombre.includes(valor))
    .map(
      (p) => `
          <tr>
              <td>${p.id}</td>
              <td>${p.nombre}</td>
              <td>$${p.precio}</td>
              <td>$${p.stock}</td>
              <td>
                  <button class="btn btn-success" onclick="cargarProducto(${p.id})">Editar</button>
                  <button class="btn btn-danger" onclick="manejarEliminarProducto(${p.id})">Eliminar</button>
              </td>
          </tr>
      `
    )
    .join("");
}

d.getElementById("search").addEventListener("input", manejarBusqueda);
