import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { crearCategoriaRequest } from '../../api/categoria';

export const NuevaCategoriaPage = () => {
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);

  // 1. ESTADO PARA LOS CAMPOS DE TEXTO
  const [datos, setDatos] = useState({
    titulo: '',
    precio: '',
    descripcionCard: '',
    descripcionBreve: '',
    descripcionDetallada: '',
    playbackIdMuestra: '',
  });

  // 2. ESTADO PARA LAS IMÁGENES
  const [imagenes, setImagenes] = useState({
    imagenTarjeta: null as File | null,
    imagenHero: null as File | null,
  });

  // Manejador genérico para inputs de texto
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // Manejador para los inputs de tipo File
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, tipo: 'imagenTarjeta' | 'imagenHero') => {
    if (e.target.files && e.target.files.length > 0) {
      setImagenes({ ...imagenes, [tipo]: e.target.files[0] });
    }
  };

  // 3. FUNCIÓN DE ENVÍO
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!datos.titulo || !datos.precio) {
      toast.error('El título y el precio son obligatorios');
      return;
    }

    setGuardando(true);
    const loadingToast = toast.loading('Creando categoría...');

    try {
      // Como hay imágenes, DEBEMOS usar FormData
      const formData = new FormData();
      formData.append('titulo', datos.titulo);
      formData.append('precio', datos.precio);
      
      if (datos.descripcionCard) formData.append('descripcionCard', datos.descripcionCard);
      if (datos.descripcionBreve) formData.append('descripcionBreve', datos.descripcionBreve);
      if (datos.descripcionDetallada) formData.append('descripcionDetallada', datos.descripcionDetallada);
      if (datos.playbackIdMuestra) formData.append('playbackIdMuestra', datos.playbackIdMuestra);

      // Agregamos las imágenes si el usuario seleccionó alguna
      if (imagenes.imagenTarjeta) formData.append('imagenTarjeta', imagenes.imagenTarjeta);
      if (imagenes.imagenHero) formData.append('imagenHero', imagenes.imagenHero);

      // En tu backend tienes "beneficios" como JSON, por ahora enviaremos un array vacío o lo omites
      // formData.append('beneficios', JSON.stringify([]));

      await crearCategoriaRequest(formData);

      toast.success('¡Categoría creada con éxito!', { id: loadingToast });
      navigate('/admin/categorias'); // Volvemos a la grilla

    } catch (error: any) {
      const mensaje = error.response?.data?.message || 'Error al crear la categoría';
      toast.error(Array.isArray(mensaje) ? mensaje[0] : mensaje, { id: loadingToast });
    } finally {
      setGuardando(false);
    }
  };

  // Clases utilitarias repetitivas
  const labelClass = "block text-sm font-bold text-gray-400 mb-2";
  const inputClass = "w-full bg-[#131313] border border-gray-800 focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all shadow-sm";

  return (
    <div className="w-full h-full flex flex-col font-sans overflow-y-auto custom-scrollbar pr-2 pb-10">
      
      {/* CABECERA */}
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button 
          onClick={() => navigate('/admin/categorias')}
          className="p-2 bg-[#131313] hover:bg-gray-800 border border-gray-800 rounded-full text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Nueva Disciplina</h1>
          <p className="text-gray-400 text-sm">Crea una nueva categoría para tus videos.</p>
        </div>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">
        
        {/* COLUMNA IZQUIERDA: Textos y Datos */}
        <div className="flex-1 space-y-6 bg-[#131313] p-6 md:p-8 rounded-[24px] border border-gray-800 shadow-sm">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-4">Información General</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Título de la Disciplina *</label>
              <input 
                type="text" 
                name="titulo"
                required
                placeholder="Ej: Clases de Danza | Inicial"
                value={datos.titulo}
                onChange={handleChange}
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}>Precio Mensual ($) *</label>
              <input 
                type="number" 
                name="precio"
                required
                min="0"
                step="0.01"
                placeholder="Ej: 5000"
                value={datos.precio}
                onChange={handleChange}
                className={inputClass} 
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Descripción para la Tarjeta (Corta)</label>
            <textarea 
              name="descripcionCard"
              rows={2}
              placeholder="Aparecerá en la cuadrícula principal..."
              value={datos.descripcionCard}
              onChange={handleChange}
              className={`${inputClass} resize-none`} 
            />
          </div>

          <div>
            <label className={labelClass}>Descripción Breve (Página de detalle)</label>
            <textarea 
              name="descripcionBreve"
              rows={2}
              placeholder="Un resumen rápido de la clase..."
              value={datos.descripcionBreve}
              onChange={handleChange}
              className={`${inputClass} resize-none`} 
            />
          </div>

          <div>
            <label className={labelClass}>Descripción Detallada (Larga)</label>
            <textarea 
              name="descripcionDetallada"
              rows={5}
              placeholder="Explica a fondo de qué trata la disciplina, a quién va dirigida..."
              value={datos.descripcionDetallada}
              onChange={handleChange}
              className={`${inputClass} resize-none`} 
            />
          </div>

          <div>
            <label className={labelClass}>Video de Muestra (Playback ID de Mux) - Opcional</label>
            <input 
              type="text" 
              name="playbackIdMuestra"
              placeholder="Ej: xJ02A9..."
              value={datos.playbackIdMuestra}
              onChange={handleChange}
              className={inputClass} 
            />
            <p className="text-xs text-gray-500 mt-2">Si tienes un video gratis de introducción, pega su ID aquí.</p>
          </div>
        </div>

        {/* COLUMNA DERECHA: Imágenes y Botón de Guardar */}
        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
          
          {/* Panel de Imágenes */}
          <div className="bg-[#131313] p-6 rounded-[24px] border border-gray-800 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Imágenes</h3>
            
            {/* Imagen Tarjeta */}
            <div>
              <label className={labelClass}>Imagen para la Tarjeta</label>
              <div className="relative w-full h-40 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'imagenTarjeta')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                {imagenes.imagenTarjeta ? (
                  <img src={URL.createObjectURL(imagenes.imagenTarjeta)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                ) : null}
                <div className="z-10 flex flex-col items-center pointer-events-none">
                  <ImageIcon className={`h-8 w-8 mb-2 ${imagenes.imagenTarjeta ? 'text-white' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${imagenes.imagenTarjeta ? 'text-white' : 'text-gray-500'}`}>
                    {imagenes.imagenTarjeta ? 'Cambiar Imagen' : 'Subir Portada (Vertical)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Imagen Hero (Banner) */}
            <div>
              <label className={labelClass}>Imagen de Fondo (Banner/Hero)</label>
              <div className="relative w-full h-32 border-2 border-dashed border-gray-700 hover:border-[#d7f250] rounded-xl flex flex-col items-center justify-center transition-colors bg-[#0a0a0a] overflow-hidden group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'imagenHero')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                {imagenes.imagenHero ? (
                  <img src={URL.createObjectURL(imagenes.imagenHero)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                ) : null}
                <div className="z-10 flex flex-col items-center pointer-events-none">
                  <ImageIcon className={`h-8 w-8 mb-2 ${imagenes.imagenHero ? 'text-white' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${imagenes.imagenHero ? 'text-white' : 'text-gray-500'}`}>
                    {imagenes.imagenHero ? 'Cambiar Imagen' : 'Subir Banner (Horizontal)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <button 
            type="submit" 
            disabled={guardando}
            className="w-full bg-[#d7f250] hover:bg-[#c4dd46] text-[#131313] p-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-1 shadow-lg disabled:opacity-70 disabled:hover:translate-y-0 uppercase tracking-widest"
          >
            {guardando ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Guardando...</>
            ) : (
              <><Save className="w-6 h-6" /> Guardar Disciplina</>
            )}
          </button>

        </div>
      </form>
    </div>
  );
};