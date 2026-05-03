import { useState } from 'react';
import { Edit2, Trash2, Image as ImageIcon, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { type VideoData } from '../api/videos';


interface Props {
  video: VideoData;
  viewMode: 'grid' | 'list';
  onEdit: (id: string) => void;
  onDelete: (id: string, titulo: string) => void;
}

const formatearDuracionVideo = (segundosTotales?: number) => {
  if (!segundosTotales || segundosTotales === 0) return null;
  const horas = Math.floor(segundosTotales / 3600);
  const minutos = Math.floor((segundosTotales % 3600) / 60);
  const segundos = segundosTotales % 60;
  if (horas > 0) {
    return `${horas}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  }
  return `${minutos}:${segundos.toString().padStart(2, '0')}`;
};

export const VideoCard = ({ video, viewMode, onEdit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const isGrid = viewMode === 'grid';
  const estaProcesando = video.estado === 'PROCESANDO' || !video.playbackId;
  const descripcion = video.descripcion || 'Sin descripción.';
  const duracionReloj = formatearDuracionVideo(video.duracion);

  return (
    <div onClick={() => onEdit(video.id)} className={`relative rounded-2xl overflow-hidden group cursor-pointer bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/5 hover:border-[#d7f250]/40 hover:shadow-[0_0_20px_rgba(215,242,80,0.08)] transition-all duration-300 ease-out ${isGrid ? 'flex flex-col h-[280px] sm:h-[320px]' : 'flex flex-row sm:h-[120px] sm:max-h-[120px]'}`}>

      {/* IMAGEN — Solo visible en grid o desktop */}
      {isGrid && (
        <div className="absolute inset-0 overflow-hidden">
          {estaProcesando ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/80">
              {video.imagenUrl && <img src={video.imagenUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" />}
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-[#d7f250] relative z-10 mb-2" />
              <p className="text-[8px] sm:text-[10px] text-[#d7f250] font-black uppercase tracking-[0.2em] relative z-10 text-center">Procesando</p>
            </div>
          ) : video.imagenUrl ? (
            <img src={video.imagenUrl} alt={video.titulo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]"><ImageIcon size={40} className="text-gray-700" /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
        </div>
      )}

      {/* Imagen en desktop list view */}
      {!isGrid && (
        <div className="hidden sm:block relative w-48 h-full overflow-hidden shrink-0">
          {estaProcesando ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/80">
              {video.imagenUrl && <img src={video.imagenUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" />}
              <Loader2 className="w-5 h-5 animate-spin text-[#d7f250] relative z-10" />
            </div>
          ) : video.imagenUrl ? (
            <img src={video.imagenUrl} alt={video.titulo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]"><ImageIcon size={32} className="text-gray-700" /></div>
          )}
        </div>
      )}

      {/* 👇 4. BADGE DE DURACIÓN (Muestra duracionReloj calculado arriba) */}
      {!estaProcesando && duracionReloj && (
        <span className={`absolute bottom-3 right-3 bg-black/80 text-white text-[9px] font-bold px-2 py-1 rounded-md blur-s z-20 shadow-lg ${isGrid ? '' : 'sm:bottom-2 sm:right-2'}`}>
          {duracionReloj}
        </span>
      )}

      {/* CONTENIDO */}
      <div className={`relative z-10 flex-1 flex ${isGrid ? 'flex-col justify-end p-6' : 'flex-row items-center px-4 min-w-0 gap-3'}`}>

        {/* TEXTOS Y BADGES */}
        <div className={`flex flex-col justify-center flex-1 min-w-0 ${isGrid ? '' : 'py-3 sm:py-0'}`}>
          {/* BADGES */}
          <div className={`flex items-center gap-2 ${isGrid ? 'mb-2' : 'mb-1.5'}`}>
            <span className={`px-4 py-2 rounded-full bg-[#d7f250]/25 text-[#d7f250] text-[9px] sm:text-[10px] font-bold tracking-wide shrink-0`}>
              {video.categoria?.titulo || 'Sin categoría'}
            </span>
          </div>

          {/* TITULO */}
          <h3 className={`${isGrid ? 'text-2xl sm:text-3xl mt-auto' : 'text-base sm:text-xl font-bold'} text-white uppercase font-principal leading-tight pr-2 group-hover:text-[#d7f250] transition-colors duration-200 ${isGrid ? 'line-clamp-2' : 'truncate'}`}>
            {video.titulo}
          </h3>

          {/* DESCRIPCIÓN — Solo en list view */}
          {!isGrid && (
            <div className="mt-1">
              {/* Desktop: siempre visible */}
              <p className="hidden sm:block text-white/40 text-xs truncate group-hover:text-white/50 transition-colors">
                {descripcion}
              </p>

              {/* Móvil: colapsable */}
              <div className="sm:hidden">
                <p className={`text-white/40 wrap-break-word text-[10px] leading-relaxed transition-all duration-300 group-hover:text-white/50 ${expanded ? '' : 'line-clamp-2'}`}>{descripcion}</p>

                {descripcion !== 'Sin descripción.' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setExpanded(!expanded); }}
                    className="flex items-center gap-0.5 text-[#d7f250]/80 hover:text-[#d7f250] text-[10px] font-semibold mt-1 transition-colors"
                  >
                    {expanded ? (
                      <>Ocultar <ChevronUp size={11} /></>
                    ) : (
                      <>Ver más <ChevronDown size={11} /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* BOTONES ACCIÓN */}
        <div className={`flex items-center gap-2 shrink-0 ${isGrid ? 'mt-4' : ''}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(video.id); }}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-black hover:bg-[#d7f250] hover:border-[#d7f250] hover:shadow-[0_0_12px_rgba(215,242,80,0.3)] transition-all duration-200"
          >
            <Edit2 size={13} className="sm:w-[14px] sm:h-[14px]" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(video.id, video.titulo); }}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-red-500/90 hover:border-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] transition-all duration-200"
          >
            <Trash2 size={13} className="sm:w-[14px] sm:h-[14px]" />
          </button>
        </div>
      </div>
    </div>
  );
};