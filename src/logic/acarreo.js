import { DENOMINACIONES, INVENTARIO_INICIAL } from '../data/cajero';

const ORDEN_ACARREO = [...DENOMINACIONES].reverse();

function distribucionVacia() {
  return Object.fromEntries(
    DENOMINACIONES.map((denominacion) => [denominacion, 0])
  );
}

function resultadoFallido(filas = [], reinicios = 0) {
  return {
    filas,
    acumulado: 0,
    encontrado: false,
    reinicios,
    distribucion: distribucionVacia()
  };
}

function retirarVuelta(solicitar, inventario) {
  const distribucion = distribucionVacia();
  const filas = [];
  let monto = 0;

  for (let i = 0; i < ORDEN_ACARREO.length; i++) {
    if (ORDEN_ACARREO[i] + monto > solicitar) {
      break;
    }

    const fila = distribucionVacia();
    let valorFila = 0;

    for (let j = i; j < ORDEN_ACARREO.length; j++) {
      const denominacion = ORDEN_ACARREO[j];
      const disponibles =
        inventario[denominacion] - distribucion[denominacion];

      if (disponibles > 0 && monto + denominacion <= solicitar) {
        monto += denominacion;
        valorFila += denominacion;
        distribucion[denominacion]++;
        fila[denominacion]++;
      }
    }

    if (valorFila > 0) {
      filas.push({
        tipo: 'fila',
        matriz: DENOMINACIONES.map(
          (denominacion) => fila[denominacion]
        ),
        valor: valorFila
      });
    }
  }

  return { monto, distribucion, filas };
}

export function generarAcarreo(monto, inventario) {
  if (!Number.isInteger(monto) || monto <= 0 || monto % 10000 !== 0) {
    return resultadoFallido();
  }

  const disponible = Object.fromEntries(
    DENOMINACIONES.map((denominacion) => [
      denominacion,
      Math.max(0, Number(inventario[denominacion]) || 0)
    ])
  );
  const distribucion = distribucionVacia();
  const filas = [];
  let acumulado = 0;
  let reinicios = 0;

  while (acumulado < monto) {
    const vuelta = retirarVuelta(monto - acumulado, disponible);

    if (vuelta.monto === 0) {
      return resultadoFallido(filas, reinicios);
    }

    vuelta.filas.forEach((fila) => {
      acumulado += fila.valor;
      filas.push({ ...fila, acumulado });
    });

    DENOMINACIONES.forEach((denominacion) => {
      disponible[denominacion] -= vuelta.distribucion[denominacion];
      distribucion[denominacion] += vuelta.distribucion[denominacion];
    });

    if (acumulado < monto) {
      reinicios++;
      filas.push({ tipo: 'reinicio', numero: reinicios });
    }
  }

  return {
    filas,
    acumulado,
    encontrado: true,
    reinicios,
    distribucion
  };
}

export function simularAcarreo(monto) {
  return generarAcarreo(monto, INVENTARIO_INICIAL);
}
