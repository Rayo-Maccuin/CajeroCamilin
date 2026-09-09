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

export function convertirNumero(numero) {
  return Number(String(numero).replace(/\D/g, ''));
}
