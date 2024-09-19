import { getItemLocalStorage, setItemLocalStorage } from "./local-storage";

export function obtenerProductos() {
  return getItemLocalStorage("productos");
}

export function buscarProducto(id) {
  return obtenerProductos().find((p) => p.id === id);
}

export function crearProducto({ nombre, precio }) {
  const productos = obtenerProductos();
  productos.push({ id: productos.length + 1, nombre, precio });
  setItemLocalStorage("productos", productos);
}

export function actualizarProducto(id, { nombre, precio }) {
  const productos = obtenerProductos();
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;
  producto.nombre = nombre;
  producto.precio = precio;
  setItemLocalStorage("productos", productos);
}

export function eliminarProducto(id) {
  const productos = obtenerProductos();
  const productosActualizados = productos.filter((p) => p.id !== id);
  setItemLocalStorage("productos", productosActualizados);
}
