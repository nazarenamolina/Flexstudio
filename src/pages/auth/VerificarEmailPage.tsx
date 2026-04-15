import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, MailCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { verificarEmailRequest } from '../../api/auth';

export const VerificarEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const correo = location.state?.correo;

  const [cargando, setCargando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<{ codigo: string }>();
 if (!correo) {
    return <Navigate to="/registro" replace />;
  }

  const onSubmit = async (data: { codigo: string }) => {
    setCargando(true);
    setErrorGlobal(null);
    try {
      await verificarEmailRequest({ correo, codigo: data.codigo });
      navigate('/login', { state: { mensaje: '¡Cuenta verificada! Ya puedes iniciar sesión.' } });
    } catch (error: any) {
      setErrorGlobal(error.response?.data?.message || 'Código incorrecto o expirado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-card font-sans p-4">
      <div className="max-w-md w-full bg-[#111111] border border-gray-800 rounded-2xl p-8 sm:p-10 shadow-2xl flex flex-col items-center">
        
        <div className="w-20 h-20 bg-[#d7f250]/10 rounded-full flex items-center justify-center mb-6">
          <MailCheck className="text-[#d7f250] w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-black text-white tracking-tighter mb-2">Revisa tu correo</h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Enviamos un código de seguridad de 6 dígitos a <br/>
          <strong className="text-[#d7f250] font-bold">{correo}</strong>
        </p>

        {errorGlobal && (
          <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={16} /> {errorGlobal}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div>
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000" 
              autoComplete="off"
              className={`w-full bg-[#1a1a1a] border ${errors.codigo ? 'border-red-500' : 'border-gray-800 focus:border-[#d7f250]'} rounded-xl px-4 py-4 text-center text-4xl tracking-[0.5em] font-black focus:outline-none transition-colors text-white placeholder-gray-700`}
              {...register('codigo', { 
                required: 'Ingresa el código',
                pattern: { value: /^[0-9]{6}$/, message: 'Debe contener exactamente 6 números' }
              })} 
            />
            {errors.codigo && <span className="text-red-400 text-xs flex justify-center mt-2 font-bold">{errors.codigo.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={cargando} 
            className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-bg-card font-black text-sm py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-70"
          >
            {cargando ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> VERIFICANDO...</> : 'CONFIRMAR CORREO'}
          </button>
        </form>

        <button 
          onClick={() => navigate('/registro')} 
          className="text-gray-500 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors mt-8 uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Corregir correo electrónico
        </button>
      </div>
    </div>
  );
};