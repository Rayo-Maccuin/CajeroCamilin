export const DENOMINACIONES = [
  100000,
  50000,
  20000,
  10000
];

export const INVENTARIO_INICIAL = {
  100000: 100,
  50000: 100,
  20000: 100,
  10000: 100
};

export const MAX_RETIROS = 10;

export const TIPOS_RETIRO = {
  CELULAR: 'celular',
  AHORRO_MANO: 'ahorro_mano',
  CUENTA_AHORROS: 'cuenta_ahorros'
};

export const INFORMACION_RETIRO = {
  celular: {
    titulo: 'Retiro por celular',
    descripcion: 'Retiro estilo Nequi',
    longitud: 10,
    longitudClave: 6
  },

  ahorro_mano: {
    titulo: 'Ahorro a la Mano',
    descripcion: 'Retiro con número de cuenta',
    longitud: 11,
    longitudClave: 4
  },

  cuenta_ahorros: {
    titulo: 'Cuenta de ahorros',
    descripcion: 'Retiro con número de cuenta',
    longitud: 11,
    longitudClave: 4
  }
};

export const MONTOS_FIJOS = [
  10000,
  20000,
  50000,
  100000,
  200000,
  1000000
];
