import { useForm } from 'react-hook-form';
import { MailCheck, AlertCircle } from 'lucide-react';
import { type CheckoutPerfilData } from '../../../api/usuario';  

interface Props {
  formData: CheckoutPerfilData;
  usuario: any;
  onPrev: () => void;
  onNext: (datosValidados: CheckoutPerfilData) => void;
}

type FormValues = CheckoutPerfilData & { tipoDocumento: 'DNI' | 'CUIT' };
const Paso2Formulario = ({ formData, usuario, onPrev, onNext }: Props) => {

  const { register, handleSubmit, watch, setValue, clearErrors, formState: { errors } } = useForm<FormValues>({
    defaultValues: { 
      ...formData, 
      tipoDocumento: formData.documentoIdentidad?.length === 11 ? 'CUIT' : 'DNI' 
    },
    mode: 'onTouched'
  });

  const tipoDocActual = watch('tipoDocumento');

  const inputClass = "border-[1px] border-neutral-400 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#d7f250] transition-colors w-full text-[#131313]";
  const inputErrorClass = "bg-red-500/5 border-[1px] border-red-500 rounded-md px-4 py-3 text-sm focus:outline-none transition-colors w-full text-white";
  const disabledInputClass = "border-[1px] border-neutral-400 rounded-md px-4 py-3 text-sm cursor-not-allowed w-full";

  const onSubmit = (data: FormValues) => {
    const { tipoDocumento, ...datosLimpios } = data;
    onNext(datosLimpios);
  };

  const esArgentina = usuario?.pais === 'Argentina';

  const cambiarTipoDocumento = (tipo: 'DNI' | 'CUIT') => {
    setValue('tipoDocumento', tipo);
    setValue('documentoIdentidad', '');
    clearErrors('documentoIdentidad');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        
        <div className="flex flex-col gap-2">
          <label className="font-principal font-semibold text-neutral-800">Nombre Completo</label>
          <input type="text" value={`${usuario?.nombre || ''} ${usuario?.apellido || ''}`} disabled className={disabledInputClass} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-principal font-semibold text-neutral-800">País de Residencia</label>
          <input type="text" value={usuario?.pais || 'No definido'} disabled title="El país se define al registrarse." className={disabledInputClass} />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2 relative">
          <label className="font-principal font-semibold text-neutral-800">Correo Electrónico</label>
          <div className="flex items-center">
            <input type="email" value={usuario?.correo || ''} disabled className={`${disabledInputClass} pr-24`} />
            <button type="button" className="absolute right-2 text-xs bg-[#2a2a2a] hover:bg-[#333] text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer">
              <MailCheck size={14} /> Verificar
            </button>
          </div>
        </div>

        {esArgentina && (
          <div className="flex flex-col gap-2">
            <label className="font-principal font-semibold text-neutral-800">Datos de facturación: </label>
            <div className="flex flex-col gap-3 md:col-span-2 p-5 border-[1px] border-neutral-400 rounded-xl">
            <div className="flex gap-2 p-1 rounded-lg border border-neutral-400 w-full md:w-1/2">
              <button type="button" onClick={() => cambiarTipoDocumento('DNI')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${tipoDocActual === 'DNI' ? 'bg-[#d7f250] text-neutral-800 shadow-md' : 'text-neutral-600 hover:text-black'}`}>DNI </button>
              <button
                type="button"
                onClick={() => cambiarTipoDocumento('CUIT')}
                className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${tipoDocActual === 'CUIT' ? 'bg-[#d7f250] text-neutral-800 shadow-md' : 'text-neutral-600 hover:text-black'}`}
              >
                CUIT / CUIL
              </button>
            </div>

            {/* El Input Dinámico */}
            <div className="flex flex-col gap-1 mt-1">
              <input 
                type="text" 
                placeholder={tipoDocActual === 'DNI' ? "Ej: 20123456" : "Ej: 20123456789"}
                className={errors.documentoIdentidad ? inputErrorClass : inputClass}
                {...register('documentoIdentidad', { 
                  required: `El ${tipoDocActual} es obligatorio.`,
                  validate: (value) => {
                    if (!value) return true;
                    
                    // Lógica si eligió DNI
                    if (tipoDocActual === 'DNI') {
                      if (value.length < 7 || value.length > 8) return 'El DNI debe tener 7 u 8 números.';
                      if (!/^\d+$/.test(value)) return 'El DNI sólo debe contener números.';
                      return true;
                    }
                    
                    // Lógica si eligió CUIT
                    if (tipoDocActual === 'CUIT') {
                      if (value.length !== 11) return 'El CUIT/CUIL debe tener exactamente 11 números.';
                      if (!/^\d+$/.test(value)) return 'El CUIT sólo debe contener números.';
                      
                      const base = value.slice(0, -1);
                      const digitoVerificador = parseInt(value.slice(-1));
                      const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
                      let total = 0;
                      
                      for (let i = 0; i < multiplicadores.length; i++) {
                        total += parseInt(base[i]) * multiplicadores[i];
                      }
                      
                      const resto = total % 11;
                      const calculado = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;
                      
                      return calculado === digitoVerificador || 'El CUIT/CUIL ingresado es inválido.';
                    }
                  }
                })}
              />
              {errors.documentoIdentidad && (
                <span className="text-red-400 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.documentoIdentidad.message}
                </span>
              )}
            </div>
          </div>
          </div>
        )}

        {/* RESTO DEL FORMULARIO... */}
        <div className="flex flex-col gap-2">
          <label className="font-principal font-semibold text-neutral-800">Número de teléfono</label>
          <input 
            type="text" 
            className={errors.telefono ? inputErrorClass : inputClass}
            {...register('telefono', { 
              pattern: { value: /^[0-9+ ]+$/, message: 'Solo números y el signo +' }
            })} 
          />
          {errors.telefono && <span className="text-red-400 text-xs">{errors.telefono.message}</span>}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-principal font-semibold text-neutral-800">Dirección Completa</label>
          <input type="text" placeholder="Ej: Calle Falsa 123, Piso 2..." className={inputClass} {...register('direccion')} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-principal font-semibold text-neutral-800">Provincia / Estado</label>
          <input type="text" className={inputClass} {...register('provincia')} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-principal font-semibold text-neutral-800">Ciudad</label>
          <input type="text" className={inputClass} {...register('ciudad')} />
        </div>
        
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-principal font-semibold text-neutral-800">Código Postal</label>
          <input type="text" className={inputClass} {...register('codigoPostal')} />
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 pt-12">
        <button type="button" onClick={onPrev} className="flex items-center justify-center gap-3 rounded-full bg-[#131313]/60 px-6 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#fff]/90 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md cursor-pointer">
          Anterior
        </button>
        <button type="submit" className="flex items-center justify-center gap-3 rounded-full bg-neon-pink px-6 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#131313]/90 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md cursor-pointer">
          Siguiente
        </button>
      </div>
    </form>
  );
};

export default Paso2Formulario;