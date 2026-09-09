import { useState } from 'react';
import { ArrowLeft, Banknote } from 'lucide-react';
import { MONTOS_FIJOS } from '../data/cajero';

function formatear(monto) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(monto);
}

function Montos({ onSelect, onBack }) {
  const [otro, setOtro] = useState('');
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  const seleccionar = (monto) => {
    if (procesando) {
      return;
    }

    setProcesando(true);
    setTimeout(() => onSelect(monto), 400);
  };

  const seleccionarOtro = () => {
    const monto = Number(otro);

    if (!monto || monto <= 0) {
      setError('Ingrese un monto válido.');

      return;
    }

    if (monto % 10000 !== 0) {
      setError(
        'El monto debe estar expresado en múltiplos de $10.000.'
      );

      return;
    }

    setError('');
    seleccionar(monto);
  };

  return (
    <section className="screen amount-screen">
      <button
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div className="form-heading">
        <div className="form-icon">
          <Banknote size={25} />
        </div>

        <div>
          <span>RETIRO</span>
          <h1>Seleccione el monto</h1>
        </div>
      </div>

      <div className="amount-grid">
        {MONTOS_FIJOS.map((monto) => (
          <button
            key={monto}
            className="amount-button"
            onClick={() => seleccionar(monto)}
            disabled={procesando}
          >
            {formatear(monto)}
          </button>
        ))}
      </div>

      <div className="other-amount">
        <label htmlFor="otro">
          Otro monto
        </label>

        <div className="other-input">
          <span>$</span>

          <input
            id="otro"
            type="number"
            min="10000"
            step="10000"
            value={otro}
            onChange={(e) => setOtro(e.target.value)}
            placeholder="Ej. 150000"
          />

          <button
            onClick={seleccionarOtro}
            disabled={procesando}
          >
            Retirar
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {procesando && (
        <div className="instruction" role="status">
          Monto aceptado. Preparando el acarreo...
        </div>
      )}

      <div className="denomination-note">
        <strong>Denominaciones disponibles</strong>

        <span>
          $10.000 · $20.000 · $50.000 · $100.000
        </span>
      </div>
    </section>
  );
}

export default Montos;
