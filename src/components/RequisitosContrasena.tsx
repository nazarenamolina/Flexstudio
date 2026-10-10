import { Check, Circle } from 'lucide-react';
import { REQUISITOS_CONTRASENA } from '../validaciones';

/** Lista de requisitos de la contraseña que se van marcando mientras se escribe. */
export const RequisitosContrasena = ({ valor, id }: { valor: string; id?: string }) => (
  <ul id={id} className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs" aria-label="Requisitos de la contraseña">
    {REQUISITOS_CONTRASENA.map((requisito) => {
      const cumple = requisito.cumple(valor);
      return (
        <li key={requisito.id} className={`flex items-center gap-2 transition-colors ${cumple ? 'text-[#131313] font-semibold' : 'text-neutral-500'}`}>
          {cumple
            ? <span className="grid place-items-center w-4 h-4 rounded-full bg-[#d7f250]"><Check size={11} strokeWidth={3} /></span>
            : <Circle size={14} className="text-neutral-300" />}
          {requisito.texto}
          <span className="sr-only">{cumple ? '(cumplido)' : '(pendiente)'}</span>
        </li>
      );
    })}
  </ul>
);
