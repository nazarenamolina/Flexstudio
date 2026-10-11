import { Save, Loader2, User, MapPin } from 'lucide-react';
import { useMiPerfil } from '../hooks/useMiPerfil';
import { useAuthStore } from '../store/authStore';
import { AvatarIniciales } from '../components/AvatarIniciales';
import { claseEtiqueta, claseCampo, claseError } from './auth/estilos';

export const MiPerfilPage = () => {
    const { register, handleSubmit, errors, isSubmitting, cargandoDatos } = useMiPerfil();
    const usuario = useAuthStore((state) => state.usuario);
    // Mismos estilos de formulario que las pantallas de cuenta (login, registro…).
    const labelClass = claseEtiqueta;
    const inputClass = claseCampo();
    const inputDisabledClass = claseCampo();

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
                    <h1 className="font-principal text-4xl md:text-5xl uppercase text-[#131313] leading-tight mb-2">
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
                            <h2 className="font-principal text-2xl uppercase text-[#131313]">Información Personal</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="perfil-nombre" className={labelClass}>Nombre *</label>
                                <input id="perfil-nombre" type="text" autoComplete="given-name" {...register('nombre', { required: 'Obligatorio' })} className={inputClass} />
                                {errors.nombre && <p className={claseError}>{errors.nombre.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="perfil-apellido" className={labelClass}>Apellido *</label>
                                <input id="perfil-apellido" type="text" autoComplete="family-name" {...register('apellido', { required: 'Obligatorio' })} className={inputClass} />
                                {errors.apellido && <p className={claseError}>{errors.apellido.message}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="perfil-correo" className={labelClass}>Correo Electrónico</label>
                                <input id="perfil-correo" type="email" autoComplete="email" {...register('correo')} disabled className={inputDisabledClass} title="No puedes cambiar tu correo desde aquí" />
                            </div>
                            <div>
                                <label htmlFor="perfil-telefono" className={labelClass}>Teléfono</label>
                                <input id="perfil-telefono" type="tel" autoComplete="tel" {...register('telefono')} placeholder="Ej: 3815790448 o +56 9 6123 4567" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="perfil-fechaNacimiento" className={labelClass}>Fecha de Nacimiento</label>
                                <input id="perfil-fechaNacimiento" type="date" autoComplete="bday" {...register('fechaNacimiento')} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* TARJETA 2: UBICACIÓN */}
                    <div className="bg-white border border-neutral-100 p-6 md:p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col transition-shadow hover:shadow-[0_8px_30px_rgba(215,242,80,0.15)]">
                        <div className="flex items-center gap-3 mb-8">
                            <MapPin className="text-[#131313] w-6 h-6" />
                            <h2 className="font-principal text-2xl uppercase text-[#131313]">Ubicación</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="sm:col-span-2">
                                <label htmlFor="perfil-direccion" className={labelClass}>Dirección Completa</label>
                                <input id="perfil-direccion" type="text" autoComplete="street-address" {...register('direccion')} placeholder="Ej: Barrio las marias manzana B..." className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="perfil-pais" className={labelClass}>País</label>
                                <input id="perfil-pais" type="text" autoComplete="country-name" {...register('pais')} disabled className={inputDisabledClass} title="Para cambiar tu país de residencia, contacta a soporte." />
                            </div>
                            <div>
                                <label htmlFor="perfil-provincia" className={labelClass}>Provincia / Estado</label>
                                <input id="perfil-provincia" type="text" autoComplete="address-level1" {...register('provincia')} placeholder="Ej: Tucumán" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="perfil-ciudad" className={labelClass}>Ciudad</label>
                                <input id="perfil-ciudad" type="text" autoComplete="address-level2" {...register('ciudad')} placeholder="Ej: Yerba Buena" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="perfil-codigoPostal" className={labelClass}>Código Postal</label>
                                <input id="perfil-codigoPostal" type="text" autoComplete="postal-code" {...register('codigoPostal')} placeholder="Ej: 4107" className={inputClass} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-3 rounded-full bg-neon-pink px-6 sm:px-8 py-3 sm:py-4 font-principal text-lg sm:text-xl font-bold text-[#131313] shadow-sm transition-all duration-400 hover:-translate-y-1 hover:bg-[#131313] hover:text-white hover:shadow-md cursor-pointer disabled:pointer-events-none disabled:opacity-60"
                    >
                        {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Guardando...</> : <><Save className="w-5 h-5" /> Actualizar Perfil</>}
                    </button>
                </div>
            </form>
        </div>
    );
};