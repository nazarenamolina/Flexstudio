import type { Moneda } from './hooks/useMoneda';

/** Precio de una clase en la moneda dada, o null si no tiene (o es 0): no se puede comprar en esa moneda. */
export const precioEn = (clase: { precioArs?: string | number | null; precioUsd?: string | number | null }, moneda: Moneda): number | null => {
  const valor = Number(moneda === 'ARS' ? clase.precioArs : clase.precioUsd);
  return Number.isFinite(valor) && valor > 0 ? valor : null;
};

/** Mismo formato en todo el sitio: "$ 15.000" y "U$D 20.00". */
export const formatearPrecio = (valor: number, moneda: Moneda) =>
  moneda === 'ARS' ? `$ ${valor.toLocaleString('es-AR')}` : `U$D ${valor.toFixed(2)}`;
