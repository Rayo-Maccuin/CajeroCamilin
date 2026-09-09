import { DENOMINACIONES } from '../data/cajero';
import { generarAcarreo } from './acarreo';

export function calcularBilletes(monto, inventario) {
  const proceso = generarAcarreo(monto, inventario);

  return proceso.encontrado ? proceso.distribucion : null;
}

export function actualizarInventario(inventario, billetes) {
  const nuevoInventario = { ...inventario };

  Object.keys(billetes).forEach((denominacion) => {
    nuevoInventario[denominacion] -= billetes[denominacion];
  });

  return nuevoInventario;
}

export function contarBilletes(billetes) {
  return Object.values(billetes).reduce(
    (total, cantidad) => total + cantidad,
    0
  );
}

export function calcularSaldo(inventario) {
  return Object.entries(inventario).reduce(
    (total, [denominacion, cantidad]) =>
      total + Number(denominacion) * cantidad,
    0
  );
}

export function calcularRetirosPosibles(
  inventario,
  monto,
  limite = Infinity
) {
  let cantidad = 0;
  let inventarioActual = { ...inventario };

  while (cantidad < limite) {
    const billetes = calcularBilletes(
      monto,
      inventarioActual
    );

    if (!billetes) {
      break;
    }

    cantidad++;

    inventarioActual = actualizarInventario(
      inventarioActual,
      billetes
    );
  }

  return cantidad;
}
