// Escribe una cantidad de productos con la palabra en singular o plural: "1 producto", "5 productos".
export function formatUnits(count: number) {
  return `${count} ${count === 1 ? 'producto' : 'productos'}`
}
