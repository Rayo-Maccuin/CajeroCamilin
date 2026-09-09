import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { generarAcarreo } from '../logic/acarreo';

function formatear(monto) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(monto);
}

function Acarreo({
  monto,
  inventario,
  onComplete,
  onBack
}) {
  const [proceso, setProceso] = useState(null);
  const [filaActual, setFilaActual] = useState(0);
  const [procesando, setProcesando] = useState(true);

  useEffect(() => {
    const resultado = generarAcarreo(
      monto,
      inventario
    );

    setProceso(resultado);
    setFilaActual(0);
    setProcesando(true);

    let indice = 0;
    const intervalo = setInterval(() => {
      indice++;

      setFilaActual(indice);

      if (indice >= resultado.filas.length) {
        clearInterval(intervalo);

        setTimeout(() => {
          setProcesando(false);
        }, 500);
      }
    }, 450);

    return () => clearInterval(intervalo);
  }, [monto, inventario]);

  if (!proceso) {
    return (
      <section className="screen processing">
        <div className="spinner" />

        <h2>Procesando retiro...</h2>
      </section>
    );
  }

  const filasVisibles =
    proceso.filas.slice(
      0,
      Math.min(
        filaActual + 1,
        proceso.filas.length
      )
    );

  return (
    <section className="screen carriage-screen">
      <button
        className="back-button"
        onClick={onBack}
        disabled={procesando}
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div className="carriage-header">
        <div>
          <span>METODOLOGÍA DEL ACARREO</span>

          <h1>
            Procesando {formatear(monto)}
          </h1>

          <p className="carriage-order">
            Recorrido: 10K → 20K → 50K → 100K
          </p>
        </div>

        {procesando && (
          <div className="processing-badge">
            Procesando
          </div>
        )}
      </div>

      <div className="carriage-table">
        <div className="table-row table-header">
          <span>Paso</span>
          <span>100K</span>
          <span>50K</span>
          <span>20K</span>
          <span>10K</span>
          <span>Valor</span>
        </div>

        {filasVisibles.map((fila, index) => {
          if (fila.tipo === 'reinicio') {
            return (
              <div
                className="restart-row"
                key={`restart-${index}`}
              >
                <RotateCcw size={17} />

                R{fila.numero} — Reinicio
              </div>
            );
          }

          return (
            <div
              className="table-row carriage-row"
              key={index}
            >
              <span>{index + 1}</span>

              {fila.matriz.map((valor, i) => (
                <span
                  key={i}
                  className={
                    valor === 1
                      ? 'matrix-one'
                      : 'matrix-zero'
                  }
                >
                  {valor}
                </span>
              ))}

              <strong>
                {formatear(fila.valor)}
              </strong>
            </div>
          );
        })}
      </div>

      {!procesando && (
        <div className="carriage-result">
          {proceso.encontrado ? (
            <>
              <CheckCircle2 size={21} />

              <div>
                <strong>
                  Monto encontrado
                </strong>

                <span>
                  El acarreo encontró la combinación
                  solicitada.
                </span>
              </div>

              <button
                className="primary-button"
                onClick={() => onComplete(proceso)}
              >
                Ver resultado
              </button>
            </>
          ) : (
            <>
              <div>
                <strong>
                  No fue posible realizar el retiro
                </strong>

                <span>
                  El monto no pudo ser conformado
                  mediante el proceso de acarreo.
                </span>
              </div>

              <button
                className="primary-button"
                onClick={onBack}
              >
                Intentar nuevamente
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default Acarreo;
