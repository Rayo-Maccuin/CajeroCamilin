import { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Identificacion from './components/Identificacion';
import Montos from './components/Montos';
import Acarreo from './components/Acarreo';
import Resultado from './components/Resultado';
import Recarga from './components/Recarga';

import {
  INVENTARIO_INICIAL,
  MAX_RETIROS
} from './data/cajero';

import {
  calcularBilletes,
  actualizarInventario,
  contarBilletes,
  calcularRetirosPosibles,
  calcularSaldo
} from './logic/retiro';

function App() {
  const [pantalla, setPantalla] = useState(
    'menu'
  );

  const [tipoRetiro, setTipoRetiro] =
    useState(null);

  const [datosUsuario, setDatosUsuario] =
    useState(null);

  const [monto, setMonto] =
    useState(null);

  const [billetes, setBilletes] =
    useState(null);

  const [inventario, setInventario] =
    useState(INVENTARIO_INICIAL);

  const [retirosRealizados, setRetirosRealizados] =
    useState(0);

  const [hora, setHora] = useState(
    new Date().toLocaleTimeString(
      'es-CO',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    )
  );

  const [modalError, setModalError] = useState({
    mostrar: false,
    mensaje: '',
    onAceptar: null
  });

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(
        new Date().toLocaleTimeString(
          'es-CO',
          {
            hour: '2-digit',
            minute: '2-digit'
          }
        )
      );
    }, 60000);

    return () => clearInterval(intervalo);
  }, []);

  const mostrarModalError = (mensaje, onAceptar) => {
    setModalError({
      mostrar: true,
      mensaje,
      onAceptar: onAceptar || null
    });
  };

  const cerrarModalError = () => {
    setModalError({
      mostrar: false,
      mensaje: '',
      onAceptar: null
    });
  };

  const seleccionarTipo = (tipo) => {
    setTipoRetiro(tipo);
    setPantalla('identificacion');
  };

  const abrirRecarga = () => {
    setPantalla('recarga');
  };

  const confirmarRecarga = (distribucion) => {
    setInventario((prev) => {
      const nuevo = { ...prev };

      Object.keys(distribucion).forEach(
        (denominacion) => {
          nuevo[denominacion] =
            (nuevo[denominacion] || 0) +
            distribucion[denominacion];
        }
      );

      return nuevo;
    });

    setPantalla('menu');
  };

  const completarIdentificacion = (datos) => {
    setDatosUsuario(datos);
    setPantalla('monto');
  };

  const seleccionarMonto = (valor) => {
    const montoNumerico = Number(valor);
    const saldoDisponible = calcularSaldo(inventario);

    if (retirosRealizados >= MAX_RETIROS) {
      mostrarModalError(
        'No puede realizar más retiros. Ha alcanzado el límite permitido de 3 retiros.',
        reiniciar
      );

      return;
    }

    if (saldoDisponible === 0) {
      mostrarModalError(
        'El cajero no cuenta con efectivo disponible. No se puede realizar el retiro.',
        reiniciar
      );

      return;
    }

    if (montoNumerico > saldoDisponible) {
      mostrarModalError(
        `No hay suficiente efectivo disponible. El saldo del cajero es de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(saldoDisponible)}.`,
        reiniciar
      );

      return;
    }

    if (
      montoNumerico <= 0 ||
      montoNumerico % 10000 !== 0
    ) {
      mostrarModalError(
        'El monto solicitado no puede ser retirado. El cajero solo permite retiros en múltiplos de $10.000.',
        volverMonto
      );

      return;
    }

    const posible = calcularBilletes(
      montoNumerico,
      inventario
    );

    if (!posible) {
      mostrarModalError(
        'El cajero no puede generar este monto con el efectivo disponible. El proceso iniciará nuevamente.',
        reiniciar
      );

      return;
    }

    setMonto(montoNumerico);
    setPantalla('acarreo');
  };

  const completarAcarreo = (proceso) => {
    const resultadoBilletes = proceso.distribucion;

    if (!resultadoBilletes) {
      mostrarModalError(
        'No fue posible completar el retiro.',
        reiniciar
      );

      return;
    }

    const nuevoInventario =
      actualizarInventario(
        inventario,
        resultadoBilletes
      );

    const posibles =
      calcularRetirosPosibles(
        nuevoInventario,
        monto,
        MAX_RETIROS - retirosRealizados - 1
      );

    setBilletes(resultadoBilletes);
    setInventario(nuevoInventario);
    setRetirosRealizados((prev) => prev + 1);
    setPantalla('resultado');

    setResultadoData({
      cantidadBilletes:
        contarBilletes(resultadoBilletes),
      retirosPosibles: posibles
    });
  };

  const [resultadoData, setResultadoData] =
    useState({
      cantidadBilletes: 0,
      retirosPosibles: 0
    });

  const reiniciar = () => {
    setPantalla('menu');
    setTipoRetiro(null);
    setDatosUsuario(null);
    setMonto(null);
    setBilletes(null);
    setResultadoData({
      cantidadBilletes: 0,
      retirosPosibles: 0
    });
  };

  const volverMenu = () => {
    setPantalla('menu');
    setTipoRetiro(null);
  };

  const volverIdentificacion = () => {
    setPantalla('identificacion');
  };

  const volverMonto = () => {
    setPantalla('monto');
  };

  const volverRecarga = () => {
    setPantalla('menu');
  };

  return (
    <main className="app">
      <div className="app-frame">
        <div className="app-status">
          <div className="status-left">
            <span className="status-dot" />

            <span>CAJERO ACTIVO</span>
          </div>

          <div className="status-right">
            <span>RED: ONLINE</span>

            <span>{hora}</span>
          </div>
        </div>

        {pantalla === 'menu' && (
          <Menu
            onSelect={seleccionarTipo}
            onRefill={abrirRecarga}
            saldo={calcularSaldo(inventario)}
          />
        )}

        {pantalla === 'identificacion' && (
          <Identificacion
            tipo={tipoRetiro}
            onComplete={
              completarIdentificacion
            }
            onBack={volverMenu}
          />
        )}

        {pantalla === 'monto' && (
          <Montos
            onSelect={seleccionarMonto}
            onBack={
              volverIdentificacion
            }
          />
        )}

        {pantalla === 'acarreo' && (
          <Acarreo
            monto={monto}
            inventario={inventario}
            onComplete={
              completarAcarreo
            }
            onBack={volverMonto}
          />
        )}

        {pantalla === 'resultado' && (
          <Resultado
            monto={monto}
            billetes={billetes}
            cantidadBilletes={
              resultadoData.cantidadBilletes
            }
            retirosPosibles={
              resultadoData.retirosPosibles
            }
            retirosRealizados={retirosRealizados}
            maxRetiros={MAX_RETIROS}
            identificacion={
              datosUsuario?.identificacion
            }
            onRestart={reiniciar}
          />
        )}

        {pantalla === 'recarga' && (
          <Recarga
            onBack={volverRecarga}
            onConfirm={confirmarRecarga}
          />
        )}

        <div className="app-footer">
          <span>Seguridad bancaria</span>

          <span>Pantalla táctil activa</span>
        </div>
      </div>

      {modalError.mostrar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Notificación</h2>

            <p>{modalError.mensaje}</p>

            <div className="modal-actions">
              <button
                className="primary-button"
                onClick={() => {
                  cerrarModalError();

                  if (modalError.onAceptar) {
                    modalError.onAceptar();
                  }
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
