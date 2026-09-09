import {
  CheckCircle2,
  Banknote,
  RotateCcw
} from 'lucide-react';

function formatear(monto) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(monto);
}

function Resultado({
  monto,
  billetes,
  cantidadBilletes,
  retirosPosibles,
  retirosRealizados,
  maxRetiros,
  identificacion,
  onRestart
}) {
  const denominaciones = [
    100000,
    50000,
    20000,
    10000
  ];

  return (
    <section className="screen result-screen">
      <div className="success-icon">
        <CheckCircle2 size={34} />
      </div>

      <span className="success-label">
        RETIRO APROBADO
      </span>

      <h1>{formatear(monto)}</h1>

      <p className="result-account">
        Operación realizada para:
        <strong>{identificacion}</strong>
      </p>

      <p className="session-counter">
        Retiros realizados: {retirosRealizados} / {maxRetiros}
      </p>

      <div className="result-grid">
        <div className="result-card">
          <Banknote size={20} />

          <span>Billetes entregados</span>

          <strong>{cantidadBilletes}</strong>
        </div>

        <div className="result-card">
          <span>Retiros posibles</span>

          <strong>{retirosPosibles}</strong>

          <small>
            Según el efectivo disponible
          </small>
        </div>
      </div>

      <div className="bills">
        <h3>Detalle del retiro</h3>

        {denominaciones.map((denominacion) => (
          <div
            className="bill-row"
            key={denominacion}
          >
            <span>
              {formatear(denominacion)}
            </span>

            <strong>
              × {billetes[denominacion]}
            </strong>
          </div>
        ))}
      </div>

      <button
        className="primary-button restart-button"
        onClick={onRestart}
      >
        <RotateCcw size={18} />
        Realizar otro retiro
      </button>
    </section>
  );
}

export default Resultado;
