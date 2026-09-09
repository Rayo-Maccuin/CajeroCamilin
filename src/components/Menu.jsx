import {
  Smartphone,
  Wallet,
  Landmark,
  RefreshCw
} from 'lucide-react';

function formatear(monto) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(monto);
}

function Menu({ onSelect, onRefill, saldo }) {
  const opciones = [
    {
      id: 'celular',
      titulo: 'Retiro por celular',
      descripcion: 'Retiro estilo Nequi',
      icono: Smartphone
    },
    {
      id: 'ahorro_mano',
      titulo: 'Ahorro a la Mano',
      descripcion: 'Retiro con número de cuenta',
      icono: Wallet
    },
    {
      id: 'cuenta_ahorros',
      titulo: 'Cuenta de ahorros',
      descripcion: 'Retiro desde cuenta de ahorros',
      icono: Landmark
    }
  ];

  return (
    <section className="screen menu-screen">
      <div className="brand">
        <div className="brand-icon">
          <Landmark size={26} />
        </div>

        <div>
          <strong>CAJERO</strong>
          <span>Metodología del acarreo</span>
        </div>
      </div>

      <div className="heading">
        <span>BIENVENIDO</span>

        <h1>
          Seleccione el tipo
          <br />
          de retiro
        </h1>

        <p>
          Seleccione una modalidad para comenzar.
        </p>
      </div>

      <div className="menu-grid">
        {opciones.map((opcion) => {
          const Icon = opcion.icono;

          return (
            <button
              key={opcion.id}
              className="menu-card"
              onClick={() => onSelect(opcion.id)}
            >
              <div className="menu-card-icon">
                <Icon size={25} />
              </div>

              <div>
                <strong>{opcion.titulo}</strong>
                <span>{opcion.descripcion}</span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        className="refill-card"
        onClick={onRefill}
      >
        <div className="menu-card-icon">
          <RefreshCw size={25} />
        </div>

        <div>
          <strong>Recargar cajero</strong>

          <span>
            Definir distribución de efectivo
          </span>
        </div>
      </button>

      <div className="cash-indicator">
        <span>EFECTIVO DISPONIBLE</span>
        <strong>{formatear(saldo)}</strong>
      </div>
    </section>
  );
}

export default Menu;
