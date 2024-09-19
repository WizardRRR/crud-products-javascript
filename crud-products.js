import { getItemLocalStorage, setItemLocalStorage } from "./local-storage.js";

export function obtenerProductosConEliminados() {
  return getItemLocalStorage("productos");
}

export function obtenerProductos() {
  const productos = getItemLocalStorage("productos");
  if (!productos) return null;
  return productos.filter((p) => p.deletedAt === null);
}

export function buscarProducto(id) {
  return obtenerProductosConEliminados().find((p) => p.id === id);
}

export function crearProducto({ nombre, precio }) {
  const productos = obtenerProductosConEliminados();
  productos.push({ id: productos.length + 1, nombre, precio, deletedAt: null });
  setItemLocalStorage("productos", productos);
}

export function actualizarProducto(id, { nombre, precio }) {
  const productos = obtenerProductosConEliminados();
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;
  producto.nombre = nombre;
  producto.precio = precio;
  setItemLocalStorage("productos", productos);
}

export function eliminarProducto(id) {
  const productos = obtenerProductosConEliminados();
  const producto = productos.find((p) => p.id === id);
  producto.deletedAt = new Date();
  setItemLocalStorage("productos", productos);
}
