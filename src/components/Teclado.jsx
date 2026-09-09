import { Delete, Check } from 'lucide-react';

function Teclado({
  valor,
  setValor,
  maxLength,
  oculto = false,
  confirmDisabled,
  onConfirm
}) {
  const agregar = (numero) => {
    if (valor.length >= maxLength) {
      return;
    }

    setValor(valor + numero);
  };

  const borrar = () => {
    setValor(valor.slice(0, -1));
  };

  const limpiar = () => {
    setValor('');
  };

  const teclas = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'C', '0', 'B'
  ];

  return (
    <div className="keypad">
      <div className="input-display">
        {valor.length === 0
          ? 'Ingrese'
          : oculto
            ? '•'.repeat(valor.length)
            : valor}
      </div>

      <div className="keypad-grid">
        {teclas.map((tecla) => (
          <button
            key={tecla}
            onClick={() => {
              if (tecla === 'C') {
                limpiar();
              } else if (tecla === 'B') {
                borrar();
              } else {
                agregar(tecla);
              }
            }}
            className={
              tecla === 'C' || tecla === 'B'
                ? 'key secondary'
                : 'key'
            }
          >
            {tecla === 'B' ? (
              <Delete size={20} />
            ) : (
              tecla
            )}
          </button>
        ))}
      </div>

      <button
        className="confirm-button"
        disabled={
          confirmDisabled ??
          valor.length !== maxLength
        }
        onClick={onConfirm}
      >
        <Check size={20} />
        Continuar
      </button>
    </div>
  );
}

export default Teclado;
