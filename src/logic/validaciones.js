export function validarCelular(numero) {
  return /^3\d{9}$/.test(numero);
}

export function validarAhorroMano(numero) {
  return /^[01]3\d{9}$/.test(numero);
}

export function validarCuentaAhorros(numero) {
  return /^\d{11}$/.test(numero);
}

export function validarClave(clave, longitud) {
  const expresion = new RegExp(`^\\d{${longitud}}$`);

  return expresion.test(clave);
}

export function validarIdentificacion(tipo, numero) {
  switch (tipo) {
    case 'celular':
      return validarCelular(numero);

    case 'ahorro_mano':
      return validarAhorroMano(numero);

    case 'cuenta_ahorros':
      return validarCuentaAhorros(numero);

    default:
      return false;
  }
}

export function validarPrefijoIdentificacion(tipo, numero) {
  if (!/^\d*$/.test(numero)) {
    return false;
  }

  switch (tipo) {
    case 'celular':
      return numero === '' || /^3\d*$/.test(numero);

    case 'ahorro_mano':
      return numero === '' || /^[01]$/.test(numero) || /^[01]3\d*$/.test(numero);

    case 'cuenta_ahorros':
      return true;

    default:
      return false;
  }
}

export function convertirNumero(numero) {
  return Number(String(numero).replace(/\D/g, ''));
}
