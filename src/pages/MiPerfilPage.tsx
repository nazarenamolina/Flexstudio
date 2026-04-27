import { Save, Loader2, User, MapPin } from 'lucide-react';
import { useMiPerfil } from '../hooks/useMiPerfil';
import { useAuthStore } from '../store/authStore';
import { AvatarIniciales } from '../components/AvatarIniciales';

export const MiPerfilPage = () => {
    const { register, handleSubmit, errors, isSubmitting, cargandoDatos } = useMiPerfil();
    const usuario = useAuthStore((state) => state.usuario);
    const labelClass = "block text-sm font-semibold text-[#131313] mb-2";
    const inputClass = "w-full bg-white border border-gray-200 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250] rounded-xl px-4 py-3 text-[#131313] placeholder-gray-400 outline-none transition-all";
    const inputDisabledClass = "w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed";

    if (cargandoDatos) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center text-[#d7f250]">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1200px] mx-auto flex flex-col font-sans px-4 md:px-8 pb-16 pt-32">

            <div className="mb-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative group shrink-0">
                    <AvatarIniciales
                        nombre={usuario?.nombre || ''}
                        apellido={usuario?.apellido || ''}
                        size="xl"
                        className="shadow-md"
                    />
                </div>
                <div className="text-center md:text-left mt-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#131313] tracking-tight mb-2">
                        ¡Hola, {usuario?.nombre}!
                    </h1>
                    <p className="text-[#131313]/70 text-sm max-w-2xl">
                        Acá podés editar tu información personal, recordá guardar los cambios antes de salir. Si deseas cambiar tu correo o país de residencia contacta con soporte.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* TARJETA 1: INFO PERSONAL */}
                    <div className="bg-white border border-neutral-100 p-6 md:p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col transition-shadow hover:shadow-[0_8px_30px_rgba(215,242,80,0.15)]">
                        <div className="flex items-center gap-3 mb-8">
                            <User className="text-[#131313] w-6 h-6" />
                            <h3 className="text-xl font-bold text-[#131313]">Información Personal</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Correo Electrónico</label>
                                <input type="email" {...register('correo')} disabled className={inputDisabledClass} title="No puedes cambiar tu correo desde aquí" />
                            </div>
                            <div>
                                <label className={labelClass}>Teléfono</label>
                                <input type="text" {...register('telefono')} placeholder="Ej: 3815790448" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Fecha de Nacimiento</label>
                                <input type="date" {...register('fechaNacimiento')} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* TARJETA 2: UBICACIÓN */}
                    <div className="bg-white border border-neutral-100 p-6 md:p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col transition-shadow hover:shadow-[0_8px_30px_rgba(215,242,80,0.15)]">
                        <div className="flex items-center gap-3 mb-8">
                            <MapPin className="text-[#131313] w-6 h-6" />
                            <h3 className="text-xl font-bold text-[#131313]">Ubicación</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Dirección Completa</label>
                                <input type="text" {...register('direccion')} placeholder="Ej: Barrio las marias manzana B..." className={inputClass} />
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
                                <input type="text" {...register('ciudad')} placeholder="Ej: Yerba Buena" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Código Postal</label>
                                <input type="text" {...register('codigoPostal')} placeholder="Ej: 4107" className={inputClass} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-3 rounded-full bg-neon-pink px-6 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#131313] shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md cursor-pointer"
                    >
                        {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Guardando...</> : <><Save className="w-5 h-5" /> Actualizar Perfil</>}
                    </button>
                </div>
            </form>
        </div>
    );
};