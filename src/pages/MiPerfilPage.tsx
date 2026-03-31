import { Save, Loader2, User, MapPin, Camera } from 'lucide-react';
import { useMiPerfil } from '../hooks/useMiPerfil';
import { useAuthStore } from '../store/authStore';
import { AvatarIniciales } from '../components/AvatarIniciales';

export const MiPerfilPage = () => {
    const { register, handleSubmit, errors, isSubmitting, cargandoDatos } = useMiPerfil();
    const usuario = useAuthStore((state) => state.usuario);

    const labelClass = "block text-sm font-bold text-gray-400 mb-2";
    const inputClass = "w-full bg-[#0a0a0a] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm";
    const inputDisabledClass = "w-full bg-[#131313] border border-gray-800 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed opacity-70";

    if (cargandoDatos) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center text-[#d7f250]">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    return (
        // 👇 1. Cambiamos mt-10 por pt-32 para evitar el navbar y quitamos h-full/overflow
        <div className="w-full max-w-5xl mx-auto flex flex-col font-sans px-4 md:px-8 pb-16 pt-32">

            {/* CABECERA DE LA PÁGINA */}
            {/* 👇 2. Aumentamos el margen inferior a mb-12 para separar el form */}
            <div className="mb-12 flex flex-col md:flex-row items-center gap-6">
                
                {/* EL AVATAR EN GRANDE */}
                <div className="relative group shrink-0">
                    <AvatarIniciales
                        nombre={usuario?.nombre || ''}
                        apellido={usuario?.apellido || ''}
                        size="xl"
                        className="border-4 border-white shadow-xl"
                    />
                    <div className="absolute bottom-0 right-0 bg-[#d7f250] p-2 rounded-full border-4 border-white text-[#131313] shadow-md">
                        <Camera size={16} />
                    </div>
                </div>

                <div className="text-center md:text-left">
                    {/* 👇 3. Cambiamos text-white a text-[#131313] para que se lea en el fondo claro */}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#131313] tracking-tight">
                        ¡Hola, {usuario?.nombre}!
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Gestiona tu información personal y tus datos de contacto.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* INFO PERSONAL */}
                <div className="bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-neon-pink"></div>
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                        <User className="text-neon-pink w-6 h-6" />
                        <h3 className="text-xl font-bold text-white">Información Personal</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Nombre *</label>
                            <input type="text" {...register('nombre', { required: 'Obligatorio' })} className={inputClass} />
                            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Apellido *</label>
                            <input type="text" {...register('apellido', { required: 'Obligatorio' })} className={inputClass} />
                            {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Correo Electrónico</label>
                            <input type="email" {...register('correo')} disabled className={inputDisabledClass} title="No puedes cambiar tu correo desde aquí" />
                        </div>
                        <div>
                            <label className={labelClass}>Teléfono</label>
                            <input type="text" {...register('telefono')} placeholder="Ej: +54 9 381..." className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Fecha de Nacimiento</label>
                            <input type="date" {...register('fechaNacimiento')} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* DIRECCIÓN Y CONTACTO */}
                <div className="bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#d7f250]"></div>
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                        <MapPin className="text-[#d7f250] w-6 h-6" />
                        <h3 className="text-xl font-bold text-white">Dirección de Facturación</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Dirección Completa</label>
                            <input type="text" {...register('direccion')} placeholder="Calle, número, piso, depto..." className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>País</label>
                            <input type="text" {...register('pais')} disabled className={inputDisabledClass} title="Para cambiar tu país de residencia, contacta a soporte." />
                        </div>
                        <div>
                            <label className={labelClass}>Provincia / Estado</label>
                            <input type="text" {...register('provincia')} placeholder="Ej: Tucumán" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Ciudad</label>
                            <input type="text" {...register('ciudad')} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Código Postal</label>
                            <input type="text" {...register('codigoPostal')} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* BOTÓN GUARDAR */}
                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-10 py-4 bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-transform shadow-lg disabled:opacity-70 uppercase tracking-widest"
                    >
                        {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Guardando...</> : <><Save className="w-6 h-6" /> Actualizar Perfil</>}
                    </button>
                </div>
            </form>
        </div>
    );
};