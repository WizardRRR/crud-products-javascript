export function setItemLocalStorage(key, value) {
  const serializedValue = JSON.stringify(value);
  localStorage.setItem(key, serializedValue);
}

export function getItemLocalStorage(key) {
  const serializedValue = localStorage.getItem(key);
  if (serializedValue === null) return null;
  return JSON.parse(serializedValue);
}
