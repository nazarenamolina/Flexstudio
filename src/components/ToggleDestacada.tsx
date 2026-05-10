import { Switch } from '@headlessui/react';

interface Props {
  habilitado: boolean;
  onChange: (valor: boolean) => void;
  deshabilitado?: boolean;
}

export const ToggleDestacada = ({ habilitado, onChange, deshabilitado = false }: Props) => {
  return (
    <Switch
      checked={habilitado}
      onChange={onChange}
      disabled={deshabilitado}
      className={`${
        habilitado ? 'bg-[#d7f250]' : 'bg-gray-700'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#d7f250] focus:ring-offset-2 focus:ring-offset-[#131313] disabled:opacity-50 disabled:cursor-not-allowed shrink-0`}
    >
      <span className="sr-only">Marcar como destacada</span>
      <span
        className={`${
          habilitado ? 'translate-x-6 bg-[#131313]' : 'translate-x-1 bg-white'
        } inline-block h-4 w-4 transform rounded-full transition duration-300 ease-in-out`}
      />
    </Switch>
  );
};