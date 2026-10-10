import { useWatch, type Control, type FieldErrors, type Path, type UseFormRegister } from 'react-hook-form';
import { AlertTriangle } from 'lucide-react';

/** Campos de precio que comparten el alta y la edición de una clase. */
export interface FormConPrecios {
  precioArs: number | string;
  precioUsd: number | string;
}

// Límite de las columnas DECIMAL(10,2) del back (create-categoria.dto.ts).
const PRECIO_MAXIMO = 99_999_999;

const tienePrecio = (valor: unknown) => Number(valor) > 0;

interface Props<T extends FormConPrecios> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  labelClass: string;
  inputClass: string;
}

/**
 * Precio en pesos (Mercado Pago, Argentina) y en dólares (PayPal, exterior). Un precio vacío o en 0
 * significa que la clase no se vende en esa moneda: se avisa, porque en la web aparece como
 * "No disponible en tu moneda". Sin ningún precio la clase no se podría comprar y no se guarda.
 */
export const CamposPrecio = <T extends FormConPrecios>({ register, control, errors, labelClass, inputClass }: Props<T>) => {
  const [precioArs, precioUsd] = useWatch({ control, name: ['precioArs', 'precioUsd'] as Path<T>[] });
  const errorArs = errors.precioArs?.message as string | undefined;
  const errorUsd = errors.precioUsd?.message as string | undefined;

  const reglas = (moneda: string) => ({
    min: { value: 0, message: `El precio en ${moneda} no puede ser negativo` },
    max: { value: PRECIO_MAXIMO, message: `El precio en ${moneda} es demasiado alto` },
  });

  return (
    <>
      <div>
        <label htmlFor="precio-ars" className={labelClass}>Precio (ARS)</label>
        <input
          id="precio-ars"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          placeholder="Ej: 15000"
          aria-invalid={!!errorArs}
          {...register('precioArs' as Path<T>, {
            ...reglas('pesos'),
            validate: (_valor, valores) =>
              tienePrecio(valores.precioArs) || tienePrecio(valores.precioUsd) || 'Poné al menos un precio: sin precio la clase no se puede comprar',
          })}
          className={inputClass}
        />
        {errorArs ? (
          <p role="alert" className="text-red-400 text-xs mt-1.5">{errorArs}</p>
        ) : !tienePrecio(precioArs) && tienePrecio(precioUsd) ? (
          <p className="flex items-start gap-1.5 text-amber-300/90 text-xs mt-1.5">
            <AlertTriangle size={13} className="shrink-0 mt-px" aria-hidden="true" />
            Sin precio en pesos: no se podrá comprar desde Argentina.
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="precio-usd" className={labelClass}>Precio (USD)</label>
        <input
          id="precio-usd"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          placeholder="Ej: 20"
          aria-invalid={!!errorUsd}
          {...register('precioUsd' as Path<T>, reglas('dólares'))}
          className={inputClass}
        />
        {errorUsd ? (
          <p role="alert" className="text-red-400 text-xs mt-1.5">{errorUsd}</p>
        ) : !tienePrecio(precioUsd) && tienePrecio(precioArs) ? (
          <p className="flex items-start gap-1.5 text-amber-300/90 text-xs mt-1.5">
            <AlertTriangle size={13} className="shrink-0 mt-px" aria-hidden="true" />
            Sin precio en dólares: no se podrá comprar desde el exterior.
          </p>
        ) : null}
      </div>
    </>
  );
};
