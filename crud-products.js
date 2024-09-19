let productos = [
  { id: 1, nombre: "Acc LAS lvl30", precio: 25 },
  { id: 2, nombre: "Acc LAN lvl30", precio: 30 },
  { id: 3, nombre: "Acc BR lvl30", precio: 40 },
];

export function obtenerProductos() {
  return productos;
}

export function buscarProducto(id) {
  return productos.find((p) => p.id === id);
}

export function crearProducto({ nombre, precio }) {
  const id = productos.length + 1;
  productos.push({ id, nombre, precio });
}

export function actualizarProducto(id, { nombre, precio }) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;
  producto.nombre = nombre;
  producto.precio = precio;
}

export function eliminarProducto(id) {
  productos = productos.filter((p) => p.id !== id);
}
