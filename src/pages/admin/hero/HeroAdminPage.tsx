import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { GalleryHorizontal, Plus, ArrowUp, ArrowDown, Pencil, Trash2, Eye, EyeOff, Loader2, Upload, Images, X } from 'lucide-react';
import {
  obtenerHeroAdminRequest, crearHeroRequest, actualizarHeroRequest, ordenarHeroRequest, eliminarHeroRequest,
  type HeroSlide,
} from '../../../api/hero';
import { HeroSlideVista } from '../../../components/HeroCarrusel';
import { GaleriaModal } from '../../../components/GaleriaModal';
import { ConfirmarEliminarModal } from '../../../components/ConfirmarEliminarModal';
import { optimizarCloudinary } from '../../../imagenes';

// Mismo límite y misma regla de enlaces que el back.
const MAXIMO_SLIDES = 8;
const ENLACE_PERMITIDO = /^(\/(?!\/)\S*|https:\/\/\S+)$/;

type Imagen = File | string | null;
type CampoImagen = 'imagen' | 'imagenMovil';

interface Formulario {
  etiqueta: string;
  titulo: string;
  subtitulo: string;
  textoBoton: string;
  enlace: string;
  activo: boolean;
}

const FORMULARIO_VACIO: Formulario = { etiqueta: '', titulo: '', subtitulo: '', textoBoton: '', enlace: '', activo: true };

const dosDigitos = (n: number) => String(n).padStart(2, '0');

/** URL para mostrar un archivo elegido (o la URL guardada). Libera el blob al cambiar. */
const useVistaImagen = (imagen: Imagen) => {
  const url = useMemo(() => (imagen instanceof File ? URL.createObjectURL(imagen) : imagen), [imagen]);
  useEffect(() => () => { if (imagen instanceof File && url) URL.revokeObjectURL(url); }, [imagen, url]);
  return url;
};

/** Renderiza la diapositiva a 1440×810 y la escala al ancho disponible, como se vería en un escritorio. */
const VistaPrevia = ({ slide }: { slide: HeroSlide }) => {
  const contenedor = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(0.5);
  useEffect(() => {
    if (!contenedor.current) return;
    const observador = new ResizeObserver(([entrada]) => setEscala(entrada.contentRect.width / 1440));
    observador.observe(contenedor.current);
    return () => observador.disconnect();
  }, []);
  return (
    <div ref={contenedor} className="relative w-full aspect-[16/9] overflow-hidden border-2 border-neutral-700 bg-[#F4F4F0]">
      <div className="absolute top-0 left-0 w-[1440px] h-[810px] origin-top-left pointer-events-none" style={{ transform: `scale(${escala})` }}>
        <HeroSlideVista slide={slide} indice={slide.orden} total={Math.max(slide.orden + 1, 1)} />
      </div>
    </div>
  );
};

const Etiqueta = ({ children, htmlFor, extra }: { children: React.ReactNode; htmlFor?: string; extra?: string }) => (
  <label htmlFor={htmlFor} className="flex justify-between font-principal text-[10px] uppercase tracking-[0.14em] text-neutral-400 mb-1.5">
    <span>{children}</span>
    {extra && <span className="text-neutral-600">{extra}</span>}
  </label>
);

const claseInput = 'w-full bg-[#131313] border-2 border-neutral-700 focus:border-[#d7f250] outline-none px-3 py-2.5 text-sm text-white placeholder-neutral-600 transition-colors';

const SelectorImagen = ({ titulo, ayuda, imagen, onArchivo, onGaleria, onQuitar }: {
  titulo: string; ayuda: string; imagen: Imagen;
  onArchivo: (f: File) => void; onGaleria: () => void; onQuitar?: () => void;
}) => {
  const vista = useVistaImagen(imagen);
  return (
    <div>
      <Etiqueta extra={ayuda}>{titulo}</Etiqueta>
      <div className="flex gap-3 items-stretch">
        <div className="w-28 h-20 shrink-0 border-2 border-neutral-700 bg-[#0d0d0d] overflow-hidden grid place-items-center">
          {vista ? <img src={vista} alt="" className="w-full h-full object-cover" /> : <span className="font-principal text-[10px] text-neutral-600">SIN IMAGEN</span>}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="relative flex items-center justify-center gap-2 border-2 border-neutral-700 hover:border-[#d7f250] hover:text-[#d7f250] px-3 py-2 font-principal text-[11px] uppercase tracking-[0.1em] cursor-pointer transition-colors">
            <Upload size={14} /> Subir archivo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onArchivo(f); e.target.value = ''; }}
            />
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={onGaleria} className="flex-1 flex items-center justify-center gap-2 border-2 border-neutral-700 hover:border-[#d7f250] hover:text-[#d7f250] px-3 py-2 font-principal text-[11px] uppercase tracking-[0.1em] cursor-pointer transition-colors">
              <Images size={14} /> Galería
            </button>
            {onQuitar && imagen && (
              <button type="button" onClick={onQuitar} aria-label={`Quitar ${titulo.toLowerCase()}`} className="border-2 border-neutral-700 hover:border-red-500 hover:text-red-500 px-3 cursor-pointer transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeroAdminPage = () => {
  const queryClient = useQueryClient();
  const { data: slides = [], isLoading } = useQuery({ queryKey: ['hero-admin'], queryFn: obtenerHeroAdminRequest });

  // null = editor cerrado; 'nueva' = creando; HeroSlide = editando.
  const [editando, setEditando] = useState<HeroSlide | 'nueva' | null>(null);
  const [form, setForm] = useState<Formulario>(FORMULARIO_VACIO);
  const [imagen, setImagen] = useState<Imagen>(null);
  const [imagenMovil, setImagenMovil] = useState<Imagen>(null);
  const [galeriaPara, setGaleriaPara] = useState<CampoImagen | null>(null);
  const [aEliminar, setAEliminar] = useState<HeroSlide | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const refrescar = () => {
    queryClient.invalidateQueries({ queryKey: ['hero-admin'] });
    queryClient.invalidateQueries({ queryKey: ['hero'] });
  };

  const abrirEditor = (slide: HeroSlide | 'nueva') => {
    setEditando(slide);
    if (slide === 'nueva') {
      setForm(FORMULARIO_VACIO);
      setImagen(null);
      setImagenMovil(null);
    } else {
      setForm({
        etiqueta: slide.etiqueta ?? '', titulo: slide.titulo ?? '', subtitulo: slide.subtitulo ?? '',
        textoBoton: slide.textoBoton ?? '', enlace: slide.enlace ?? '', activo: slide.activo ?? true,
      });
      setImagen(slide.imagenUrl);
      setImagenMovil(slide.imagenMovilUrl ?? null);
    }
    requestAnimationFrame(() => editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const cerrarEditor = () => setEditando(null);

  const guardarMutation = useMutation({
    mutationFn: ({ id, datos }: { id?: string; datos: FormData }) => (id ? actualizarHeroRequest(id, datos) : crearHeroRequest(datos)),
    onSuccess: (_r, { id }) => {
      toast.success(id ? 'Diapositiva guardada' : 'Diapositiva agregada al carrusel');
      refrescar();
      cerrarEditor();
    },
    onError: (error) => toast.error(typeof error === 'string' ? error : 'No se pudo guardar la diapositiva'),
  });

  const activoMutation = useMutation({
    mutationFn: (slide: HeroSlide) => {
      const datos = new FormData();
      datos.append('activo', String(!slide.activo));
      return actualizarHeroRequest(slide.id, datos);
    },
    onSuccess: (s) => { toast.success(s.activo ? 'Visible en la home' : 'Oculta de la home'); refrescar(); },
    onError: (error) => toast.error(typeof error === 'string' ? error : 'No se pudo cambiar la visibilidad'),
  });

  const ordenarMutation = useMutation({
    mutationFn: ordenarHeroRequest,
    onMutate: async (ids: string[]) => {
      await queryClient.cancelQueries({ queryKey: ['hero-admin'] });
      const anterior = queryClient.getQueryData<HeroSlide[]>(['hero-admin']);
      queryClient.setQueryData<HeroSlide[]>(['hero-admin'], (lista = []) =>
        ids.map((id, orden) => ({ ...lista.find(s => s.id === id)!, orden })));
      return { anterior };
    },
    onError: (error, _ids, contexto) => {
      queryClient.setQueryData(['hero-admin'], contexto?.anterior);
      toast.error(typeof error === 'string' ? error : 'No se pudo reordenar');
    },
    onSettled: refrescar,
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: string) => eliminarHeroRequest(id),
    onSuccess: (_r, id) => {
      toast.success('Diapositiva eliminada');
      if (editando !== null && editando !== 'nueva' && editando.id === id) cerrarEditor();
      setAEliminar(null);
      refrescar();
    },
    onError: (error) => toast.error(typeof error === 'string' ? error : 'No se pudo eliminar la diapositiva'),
  });

  const mover = (indice: number, direccion: -1 | 1) => {
    const ids = slides.map(s => s.id);
    const destino = indice + direccion;
    if (destino < 0 || destino >= ids.length) return;
    [ids[indice], ids[destino]] = [ids[destino], ids[indice]];
    ordenarMutation.mutate(ids);
  };

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagen) return toast.error('Elegí una imagen principal');
    const enlace = form.enlace.trim();
    if (enlace && !ENLACE_PERMITIDO.test(enlace)) return toast.error('El enlace debe empezar con / (página del sitio) o con https://');
    if (form.textoBoton.trim() && !enlace) return toast.error('El botón necesita un enlace');

    const existente = editando !== 'nueva' && editando ? editando : null;
    const datos = new FormData();
    (['etiqueta', 'titulo', 'subtitulo', 'textoBoton'] as const).forEach(campo => datos.append(campo, form[campo].trim()));
    datos.append('enlace', enlace);
    datos.append('activo', String(form.activo));

    if (imagen instanceof File) datos.append('imagen', imagen);
    else if (imagen !== existente?.imagenUrl) datos.append('imagenUrl', imagen);

    if (imagenMovil instanceof File) datos.append('imagenMovil', imagenMovil);
    else if (imagenMovil && imagenMovil !== existente?.imagenMovilUrl) datos.append('imagenMovilUrl', imagenMovil);
    else if (!imagenMovil && existente?.imagenMovilUrl) datos.append('eliminarImagenMovil', 'true');

    guardarMutation.mutate({ id: existente?.id, datos });
  };

  const vistaImagen = useVistaImagen(imagen);
  const vistaMovil = useVistaImagen(imagenMovil);
  const slideEnVista: HeroSlide = {
    id: 'vista-previa',
    orden: editando && editando !== 'nueva' ? editando.orden : slides.length,
    imagenUrl: vistaImagen || '',
    imagenMovilUrl: vistaMovil,
    etiqueta: form.etiqueta || null,
    titulo: form.titulo || null,
    subtitulo: form.subtitulo || null,
    textoBoton: form.textoBoton || null,
    enlace: form.enlace || null,
  };

  const cambiar = (campo: keyof Formulario) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [campo]: e.target.value }));

  if (isLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#d7f250]" />
      </div>
    );
  }

  const lleno = slides.length >= MAXIMO_SLIDES;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <GaleriaModal
        isOpen={galeriaPara !== null}
        onClose={() => setGaleriaPara(null)}
        onSelectImagen={(url) => {
          if (galeriaPara === 'imagen') setImagen(url);
          if (galeriaPara === 'imagenMovil') setImagenMovil(url);
          setGaleriaPara(null);
        }}
      />
      <ConfirmarEliminarModal
        isOpen={aEliminar !== null}
        onClose={() => setAEliminar(null)}
        onConfirm={() => aEliminar && eliminarMutation.mutate(aEliminar.id)}
        tituloItem={aEliminar?.titulo || `la diapositiva ${dosDigitos((aEliminar?.orden ?? 0) + 1)}`}
        estaEliminando={eliminarMutation.isPending}
      />

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b-2 border-neutral-800 pb-6">
        <div>
          <p className="font-principal text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Home · Hero</p>
          <h1 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3 font-principal uppercase leading-none">
            <GalleryHorizontal className="text-[#d7f250] w-8 h-8 md:w-10 md:h-10 shrink-0" />
            Carrusel
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-principal text-xs text-neutral-500 tabular-nums">{dosDigitos(slides.length)} / {dosDigitos(MAXIMO_SLIDES)}</span>
          <button
            type="button"
            onClick={() => abrirEditor('nueva')}
            disabled={lleno}
            title={lleno ? `Máximo ${MAXIMO_SLIDES} diapositivas` : undefined}
            className="flex items-center gap-2 bg-[#d7f250] text-[#131313] border-2 border-[#d7f250] px-4 py-2.5 font-principal text-xs uppercase tracking-[0.12em] hover:bg-transparent hover:text-[#d7f250] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
          >
            <Plus size={16} /> Nueva diapositiva
          </button>
        </div>
      </div>

      {slides.length === 0 && (
        <div className="border-2 border-dashed border-neutral-700 p-8 text-center mb-8">
          <p className="font-principal text-xs uppercase tracking-[0.14em] text-neutral-400">Todavía no hay diapositivas.</p>
          <p className="text-sm text-neutral-500 mt-2">Mientras tanto, la home muestra los dos banners de siempre.</p>
        </div>
      )}

      {/* Lista */}
      <ol className="flex flex-col border-2 border-neutral-800 divide-y-2 divide-neutral-800 mb-10 empty:hidden">
        {slides.map((slide, i) => {
          const seleccionada = editando !== null && editando !== 'nueva' && editando.id === slide.id;
          return (
            <li key={slide.id} className={`flex items-stretch gap-0 bg-[#131313]/80 ${seleccionada ? 'outline-2 outline-[#d7f250] -outline-offset-2' : ''} ${slide.activo ? '' : 'opacity-60'}`}>
              <div className="w-14 shrink-0 grid place-items-center border-r-2 border-neutral-800 font-principal text-sm text-[#d7f250] tabular-nums">
                {dosDigitos(i + 1)}
              </div>
              <img src={optimizarCloudinary(slide.imagenUrl, 300)} alt="" className="w-24 sm:w-36 h-20 object-cover shrink-0 border-r-2 border-neutral-800" />
              <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-center">
                <p className="font-principal uppercase text-white text-lg leading-tight truncate">
                  {slide.titulo || <span className="text-neutral-500">Banner sin texto</span>}
                </p>
                <p className="font-principal text-[10px] uppercase tracking-[0.12em] text-neutral-500 truncate mt-1">
                  {slide.activo ? 'Visible' : 'Oculta'}
                  {slide.enlace ? ` · ${slide.enlace}` : ''}
                  {slide.imagenMovilUrl ? ' · con versión móvil' : ''}
                </p>
              </div>
              <div className="flex shrink-0 border-l-2 border-neutral-800">
                <div className="hidden sm:flex flex-col border-r-2 border-neutral-800">
                  <button type="button" onClick={() => mover(i, -1)} disabled={i === 0 || ordenarMutation.isPending} aria-label="Subir" className="flex-1 px-3 hover:bg-[#d7f250] hover:text-black disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"><ArrowUp size={14} /></button>
                  <button type="button" onClick={() => mover(i, 1)} disabled={i === slides.length - 1 || ordenarMutation.isPending} aria-label="Bajar" className="flex-1 px-3 border-t-2 border-neutral-800 hover:bg-[#d7f250] hover:text-black disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"><ArrowDown size={14} /></button>
                </div>
                <button type="button" onClick={() => activoMutation.mutate(slide)} disabled={activoMutation.isPending} aria-label={slide.activo ? 'Ocultar' : 'Mostrar'} title={slide.activo ? 'Ocultar de la home' : 'Mostrar en la home'} className="px-3 sm:px-4 hover:bg-white/10 cursor-pointer transition-colors">
                  {slide.activo ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button type="button" onClick={() => abrirEditor(slide)} aria-label="Editar" className="px-3 sm:px-4 border-l-2 border-neutral-800 hover:bg-[#d7f250] hover:text-black cursor-pointer transition-colors">
                  <Pencil size={18} />
                </button>
                <button type="button" onClick={() => setAEliminar(slide)} aria-label="Eliminar" className="px-3 sm:px-4 border-l-2 border-neutral-800 hover:bg-red-600 hover:text-white text-red-500 cursor-pointer transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Editor */}
      {editando !== null && (
        <div ref={editorRef} className="scroll-mt-6 border-2 border-neutral-700 bg-[#131313]/90">
          <div className="flex items-center justify-between border-b-2 border-neutral-700 px-4 sm:px-6 h-12">
            <span className="font-principal text-[11px] uppercase tracking-[0.14em] text-[#d7f250]">
              {editando === 'nueva' ? 'Nueva diapositiva' : `Editando N° ${dosDigitos(editando.orden + 1)}`}
            </span>
            <button type="button" onClick={cerrarEditor} aria-label="Cerrar editor" className="text-neutral-400 hover:text-white cursor-pointer"><X size={20} /></button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12">
            <form onSubmit={guardar} className="xl:col-span-5 p-4 sm:p-6 flex flex-col gap-5 border-b-2 xl:border-b-0 xl:border-r-2 border-neutral-700">
              <SelectorImagen
                titulo="Imagen principal"
                ayuda="JPG/PNG/WEBP · máx. 8 MB"
                imagen={imagen}
                onArchivo={setImagen}
                onGaleria={() => setGaleriaPara('imagen')}
              />
              <SelectorImagen
                titulo="Imagen para celulares"
                ayuda="Opcional · vertical"
                imagen={imagenMovil}
                onArchivo={setImagenMovil}
                onGaleria={() => setGaleriaPara('imagenMovil')}
                onQuitar={() => setImagenMovil(null)}
              />

              <div>
                <Etiqueta htmlFor="hero-titulo" extra={`${form.titulo.length}/120`}>Título</Etiqueta>
                <input id="hero-titulo" maxLength={120} value={form.titulo} onChange={cambiar('titulo')} className={claseInput} placeholder="Ej: Flexibilidad sin límites" />
                <p className="text-[11px] text-neutral-500 mt-1.5">Sin título, la imagen ocupa toda la pantalla (para banners que ya traen el texto).</p>
              </div>
              <div>
                <Etiqueta htmlFor="hero-etiqueta" extra={`${form.etiqueta.length}/60`}>Etiqueta</Etiqueta>
                <input id="hero-etiqueta" maxLength={60} value={form.etiqueta} onChange={cambiar('etiqueta')} className={claseInput} placeholder="Ej: Nueva clase" />
              </div>
              <div>
                <Etiqueta htmlFor="hero-subtitulo" extra={`${form.subtitulo.length}/300`}>Subtítulo</Etiqueta>
                <textarea id="hero-subtitulo" maxLength={300} rows={3} value={form.subtitulo} onChange={cambiar('subtitulo')} className={`${claseInput} resize-none`} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Etiqueta htmlFor="hero-boton" extra={`${form.textoBoton.length}/40`}>Texto del botón</Etiqueta>
                  <input id="hero-boton" maxLength={40} value={form.textoBoton} onChange={cambiar('textoBoton')} className={claseInput} placeholder="Ej: Ver clases" />
                </div>
                <div>
                  <Etiqueta htmlFor="hero-enlace">Enlace</Etiqueta>
                  <input id="hero-enlace" maxLength={500} value={form.enlace} onChange={cambiar('enlace')} className={claseInput} placeholder="/categorias/… o https://…" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={form.activo} onChange={(e) => setForm(f => ({ ...f, activo: e.target.checked }))} className="w-4 h-4 accent-[#d7f250]" />
                <span className="font-principal text-[11px] uppercase tracking-[0.12em] text-neutral-300">Visible en la home</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={guardarMutation.isPending} className="flex-1 flex items-center justify-center gap-2 bg-[#d7f250] text-[#131313] border-2 border-[#d7f250] px-4 py-3 font-principal text-xs uppercase tracking-[0.12em] hover:bg-transparent hover:text-[#d7f250] disabled:opacity-60 cursor-pointer transition-colors">
                  {guardarMutation.isPending ? <><Loader2 size={16} className="animate-spin" /> Guardando…</> : 'Guardar'}
                </button>
                <button type="button" onClick={cerrarEditor} className="px-5 border-2 border-neutral-700 font-principal text-xs uppercase tracking-[0.12em] text-neutral-300 hover:border-white hover:text-white cursor-pointer transition-colors">
                  Cancelar
                </button>
              </div>
            </form>

            <div className="xl:col-span-7 p-4 sm:p-6">
              <Etiqueta>Vista previa · escritorio</Etiqueta>
              {vistaImagen ? (
                <VistaPrevia slide={slideEnVista} />
              ) : (
                <div className="aspect-[16/9] border-2 border-dashed border-neutral-700 grid place-items-center font-principal text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  Elegí una imagen para ver la vista previa
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
