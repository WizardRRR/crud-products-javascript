import { getItemLocalStorage, setItemLocalStorage } from "./local-storage.js";

export function obtenerProductosConEliminados() {
  return getItemLocalStorage("productos");
}

export function obtenerProductosEliminados() {
  return obtenerProductosConEliminados().filter(
    (product) => product.deletedAt !== null
  );
}

export function obtenerProductos() {
  const productos = getItemLocalStorage("productos");
  if (!productos) return null;
  return productos.filter((p) => p.deletedAt === null);
}

export function buscarProducto(id) {
  return obtenerProductosConEliminados().find((p) => p.id === id);
}

export function crearProducto({ nombre, precio, stock, photoUri }) {
  const productos = obtenerProductosConEliminados();

  if (productos.find((p) => p.nombre === nombre))
    throw Error("El producto ya existe");

  productos.push({
    id: productos.length + 1,
    nombre,
    stock,
    precio,
    photoUri,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });
  setItemLocalStorage("productos", productos);
}

export function actualizarProducto(id, { nombre, precio, stock, photoUri }) {
  const productos = obtenerProductosConEliminados();
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;
  producto.nombre = nombre;
  producto.precio = precio;
  producto.photoUri = photoUri;
  producto.stock = stock;
  producto.updatedAt = new Date();
  setItemLocalStorage("productos", productos);
}

export function eliminarProducto(id) {
  const productos = obtenerProductosConEliminados();
  const producto = productos.find((p) => p.id === id);
  producto.deletedAt = new Date();
  setItemLocalStorage("productos", productos);
}

export function restaurarProducto(id) {
  const productos = obtenerProductosConEliminados();
  const producto = productos.find((p) => p.id === id);
  producto.deletedAt = null;
  setItemLocalStorage("productos", productos);
}
