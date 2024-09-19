import {
  actualizarProducto,
  buscarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductos,
} from "./crud-products.js";

const d = document;

window.cargarProducto = cargarProducto;
window.manejarEliminarProducto = manejarEliminarProducto;

window.onload = actualizarUI;
d.getElementById("formulario-producto").onsubmit = manejarCrearProducto;
d.getElementById("btn-actualizar").onclick = manejarActualizarProducto;

function cargarProducto(id) {
  const producto = buscarProducto(id);
  if (!producto) return;
  d.getElementById("id-edicion").value = producto.id;
  d.getElementById("nombre").value = producto.nombre;
  d.getElementById("precio").value = producto.precio;

  // actualizando la interfaz del formulario para el modo editar
  d.getElementById("btn-crear").style.display = "none";
  d.getElementById("btn-actualizar").style.display = "inline";
}

function actualizarUI() {
  const lista = d.getElementById("lista-productos");
  lista.innerHTML = obtenerProductos()
    .map(
      (p) => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>
                <button class="btn btn-success" onclick="cargarProducto(${p.id})">Editar</button>
                <button class="btn btn-danger" onclick="manejarEliminarProducto(${p.id})">Eliminar</button>
            </td>
        </tr>
    `
    )
    .join("");
}

function validateFormProduct({ nombre, precio }) {
  let regexNotNum = /^(?!\d+$).+/;
  if (!regexNotNum.test(nombre) || precio <= 0) {
    if (!regexNotNum.test(nombre)) alert("El nombre no puede ser un numero");
    if (precio <= 0) alert("El precio debe ser mayor a 0");
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

  if (!validateFormProduct({ nombre, precio })) return;

  crearProducto({ nombre, precio });
  actualizarUI();
  this.reset();
}

function manejarActualizarProducto(event) {
  // evitando el comportamiento por defecto de los formularios (recargar la pagina)
  event.preventDefault();

  const id = parseInt(d.getElementById("id-edicion").value);

  // obteniendo valores de los inputs
  const nombre = d.getElementById("nombre").value;
  const precio = parseFloat(d.getElementById("precio").value);

  if (!validateFormProduct({ nombre, precio })) return;

  actualizarProducto(id, { nombre, precio });
  actualizarUI();
  this.reset();

  // actualizando la interfaz del formulario para el modo guardar
  d.getElementById("btn-crear").style.display = "inline";
  d.getElementById("btn-actualizar").style.display = "none";
}

function manejarEliminarProducto(id) {
  const eleccion = prompt("¿Desea eliminar este producto?", "si", "no");
  if (eleccion !== "si") return;
  eliminarProducto(id);
  actualizarUI();
}
