import { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Teclado from './Teclado';

const DENOMINACIONES = [
  100000,
  50000,
  20000,
  10000
];

function calcularDistribucion(total) {
  const resultado = {};

  let subtotal = 0;

  for (let i = DENOMINACIONES.length - 1; i >= 0; i--) {
    const denominacion = DENOMINACIONES[i];

    if (subtotal + denominacion <= total) {
      resultado[denominacion] = 1;

      subtotal += denominacion;
    } else {
      resultado[denominacion] = 0;
    }
  }

  let restante = total - subtotal;

  while (restante > 0) {
    for (let i = 0; i < DENOMINACIONES.length; i++) {
      const denominacion = DENOMINACIONES[i];

      if (restante >= denominacion) {
        resultado[denominacion] =
          (resultado[denominacion] || 0) + 1;

        restante -= denominacion;

        break;
      }
    }
  }

  return resultado;
}

function formatear(monto) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(monto);
}

function Recarga({ onBack, onConfirm }) {
  const [monto, setMonto] = useState('');
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [distribucionPendiente, setDistribucionPendiente] =
    useState(null);

  const confirmar = () => {
    const valor = Number(monto);

    if (!valor || valor <= 0) {
      setError('Ingrese un monto válido.');

      return;
    }

    if (valor % 10000 !== 0) {
      setError(
        'El monto debe estar expresado en múltiplos de $10.000.'
      );

      return;
    }

    setError('');

    const distribucion =
      calcularDistribucion(valor);

    setDistribucionPendiente(distribucion);
    setMostrarModal(true);
  };

  const aceptarRecarga = () => {
    if (distribucionPendiente) {
      onConfirm(distribucionPendiente);
    }

    setMostrarModal(false);
    setDistribucionPendiente(null);
    setMonto('');
  };

  const cancelarRecarga = () => {
    setMostrarModal(false);
    setDistribucionPendiente(null);
  };

  const esMontoValido =
    monto.length > 0 &&
    Number(monto) > 0 &&
    Number(monto) % 10000 === 0;

  return (
    <section className="screen refill-screen">
      <button
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div className="form-heading">
        <div className="form-icon">
          <RefreshCw size={25} />
        </div>

        <div>
          <span>ADMINISTRACIÓN</span>

          <h1>
            Recargar efectivo
          </h1>
        </div>
      </div>

      <div className="instruction">
        Ingrese el monto total de efectivo que debe
        tener disponible el cajero. Al confirmar,
        se actualizará la distribución automáticamente.
      </div>

      <div className="refill-input">
        <span className="refill-dollar">$</span>

        <div className="refill-keypad">
          <Teclado
            valor={monto}
            setValor={setMonto}
            maxLength={9}
            oculto={false}
            confirmDisabled={!esMontoValido}
            onConfirm={confirmar}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              Confirmar recarga
            </h2>

            <p>
              ¿Está seguro de recargar{' '}
              <strong>
                {formatear(Number(monto))}
              </strong>{' '}
              al cajero?
            </p>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={cancelarRecarga}
              >
                Cancelar
              </button>

              <button
                className="primary-button"
                onClick={aceptarRecarga}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Recarga;
