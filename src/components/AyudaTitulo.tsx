/** Explica cómo marcar el corte del título en el encabezado de la clase (ver titulos.ts). */
export const AyudaTitulo = () => (
  <p className="mt-2 text-xs leading-relaxed text-neutral-400">
    Con <code className="rounded bg-white/10 px-1 text-[#d7f250]">|</code> elegís dónde se corta el encabezado:{' '}
    <span className="text-neutral-300">"Clases para | Gimnastas"</span> muestra "Clases para" en cursiva y "GIMNASTAS"
    grande en verde. Sin barra, se corta a la mitad de las palabras. La barra no aparece en tarjetas, carrito ni comprobantes.
  </p>
);
