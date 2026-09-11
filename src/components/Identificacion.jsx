import { useEffect, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react';
import Teclado from './Teclado';
import {
  INFORMACION_RETIRO,
  TIPOS_RETIRO
} from '../data/cajero';
import {
  validarClave,
  validarIdentificacion,
  validarPrefijoIdentificacion
} from '../logic/validaciones';

function Identificacion({
  tipo,
  onComplete,
  onBack
}) {
  const informacion = INFORMACION_RETIRO[tipo];

  const [paso, setPaso] = useState('identificacion');
  const [identificacion, setIdentificacion] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  const [claveTemporal, setClaveTemporal] =
    useState('');
  const [mostrarClaveTemporal, setMostrarClaveTemporal] =
    useState(true);
  const [tiempoRestante, setTiempoRestante] =
    useState(60);

  useEffect(() => {
    if (
      paso === 'clave' &&
      tipo === TIPOS_RETIRO.CELULAR
    ) {
      const pin = Array.from(
        { length: 6 },
        () =>
          Math.floor(Math.random() * 10)
      ).join('');

      setClaveTemporal(pin);
      setMostrarClaveTemporal(true);
      setTiempoRestante(60);
    }
  }, [paso, tipo]);

  useEffect(() => {
    if (
      paso !== 'clave' ||
      tipo !== TIPOS_RETIRO.CELULAR
    ) {
      return;
    }

    if (tiempoRestante <= 0) {
      const pin = Array.from(
        { length: 6 },
        () =>
          Math.floor(Math.random() * 10)
      ).join('');

      setClaveTemporal(pin);
      setMostrarClaveTemporal(true);
      setTiempoRestante(60);

      return;
    }

    const intervalo = setInterval(() => {
      setTiempoRestante((t) => t - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [paso, tipo, tiempoRestante]);

  const confirmarIdentificacion = () => {
    const valido = validarIdentificacion(tipo, identificacion);

    if (!valido) {
      setError(
        tipo === TIPOS_RETIRO.CELULAR
          ? 'El número de celular debe tener 10 dígitos y comenzar en 3.'
          : tipo === TIPOS_RETIRO.AHORRO_MANO
            ? 'El número debe tener 11 dígitos, comenzar en 0 o 1 y el segundo dígito debe ser 3.'
            : `Debe ingresar ${informacion.longitud} dígitos numéricos.`
      );

      return;
    }

    setError('');
    setProcesando(true);
    setTimeout(() => {
      setPaso('clave');
      setProcesando(false);
    }, 400);
  };

  const confirmarClave = () => {
    if (!validarClave(clave, informacion.longitudClave)) {
      setError(
        `La clave debe tener ${informacion.longitudClave} dígitos.`
      );

      return;
    }

    if (esCelular && clave !== claveTemporal) {
      setError('La clave ingresada no coincide con la clave temporal.');

      return;
    }

    setError('');
    setProcesando(true);
    setTimeout(() => {
      onComplete({ identificacion, clave });
    }, 400);
  };

  const esCelular = tipo === TIPOS_RETIRO.CELULAR;
  const esAhorroMano = tipo === TIPOS_RETIRO.AHORRO_MANO;

  return (
    <section className="screen form-screen">
      <button
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div className="form-heading">
        <div className="form-icon">
          <KeyRound size={25} />
        </div>

        <div>
          <span>{informacion.titulo}</span>

          <h1>
            {paso === 'identificacion'
              ? 'Ingrese sus datos'
              : 'Ingrese su clave'}
          </h1>
        </div>
      </div>

      {paso === 'identificacion' ? (
        <>
          <div className="instruction">
            {esCelular
              ? 'Ingrese su número de celular de 10 dígitos.'
              : esAhorroMano
                ? 'Ingrese los 11 dígitos. Debe iniciar con 0 o 1 y el segundo dígito debe ser 3.'
                : 'Ingrese el número de cuenta de 11 dígitos.'}
          </div>

          {esCelular && (
            <div className="vector-preview">
              <span>Vector</span>
              <strong>0{identificacion.padEnd(10, '·')}</strong>
            </div>
          )}

          <Teclado
            valor={identificacion}
            setValor={setIdentificacion}
            maxLength={informacion.longitud}
            confirmDisabled={procesando || identificacion.length !== informacion.longitud}
            validarTecla={(valorSiguiente) =>
              validarPrefijoIdentificacion(tipo, valorSiguiente)
            }
            onConfirm={confirmarIdentificacion}
          />
        </>
      ) : (
        <>
          {esCelular && (
            <div className="visible-key">
              <span>CLAVE TEMPORAL</span>

              <div className="temporal-key-row">
                <strong>
                  {mostrarClaveTemporal
                    ? claveTemporal
                    : '••••••'}
                </strong>

                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() =>
                    setMostrarClaveTemporal(
                      (v) => !v
                    )
                  }
                >
                  {mostrarClaveTemporal ? (
                    <>
                      <EyeOff size={14} />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <Eye size={14} />
                      Mostrar
                    </>
                  )}
                </button>
              </div>

              <div className="timer">
                <span>Vigencia:</span>
                <strong>{tiempoRestante}s</strong>
              </div>

              <small>
                Clave visible durante 60 segundos.
                <br />
                Se renovará automáticamente.
              </small>
            </div>
          )}

          <div className="instruction">
            Ingrese su clave de{' '}
            {informacion.longitudClave} dígitos.
          </div>

          <Teclado
            valor={clave}
            setValor={setClave}
            maxLength={informacion.longitudClave}
            oculto={tipo !== TIPOS_RETIRO.CELULAR}
            confirmDisabled={procesando || clave.length !== informacion.longitudClave}
            onConfirm={confirmarClave}
          />
        </>
      )}

      {procesando && (
        <div className="instruction" role="status">
          ✓ Información validada. Preparando el siguiente paso...
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </section>
  );
}

export default Identificacion;
