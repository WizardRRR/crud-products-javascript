export function obtenerProductos() {
  return JSON.parse(localStorage.getItem("productos"));
}

export function buscarProducto(id) {
  return obtenerProductos().find((p) => p.id === id);
}

export function crearProducto({ nombre, precio }) {
  const productos = obtenerProductos();
  productos.push({ id: productos.length + 1, nombre, precio });
  localStorage.setItem("productos", JSON.stringify(productos));
}

export function actualizarProducto(id, { nombre, precio }) {
  const productos = obtenerProductos();
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;
  producto.nombre = nombre;
  producto.precio = precio;
  localStorage.setItem("productos", JSON.stringify(productos));
}

export function eliminarProducto(id) {
  const productos = obtenerProductos();
  const productosActualizados = productos.filter((p) => p.id !== id);
  localStorage.setItem("productos", JSON.stringify(productosActualizados));
}
