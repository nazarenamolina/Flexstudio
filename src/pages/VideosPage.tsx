import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClaseDetalle } from "../hooks/useClaseDetalle";
import { Share2, Bookmark, Download, Play } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

export const VideosPage = () => {
  const { id } = useParams<{ id: string }>();
  const { clase, cargando, error } = useClaseDetalle(id);
  const [videoActivo, setVideoActivo] = useState<any>(null);

 
  useEffect(() => {
 
    if (clase?.videos && clase.videos.length > 0 && !videoActivo) {
      const videosOrdenados = [...clase.videos].sort((a, b) => a.orden - b.orden);
      setVideoActivo(videosOrdenados[0]);
    }
  }, [clase, videoActivo]);

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#131313] text-white">
        <span className="animate-pulse text-xl font-principal tracking-widest text-[#d7f250]">
          Cargando tu masterclass...
        </span>
      </div>
    );
  }

  if (error || !clase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#131313]">
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-6 text-red-500">
          Error al cargar la clase. Por favor, intenta nuevamente.
        </div>
      </div>
    );
  }

  const videosCompletados = 0; 
  const totalVideos = clase.videos?.length || 1;
  const progresoPorcentaje = Math.round((videosCompletados / totalVideos) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#131313] pt-25 px-5 md:pt-30 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* COLUMNA IZQUIERDA: Reproductor MUX y Detalles */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* REPRODUCTOR MUX */}
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative shadow-[0_0_30px_rgba(215,242,80,0.15)] transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(215,242,80,0.3)]">
            {videoActivo && videoActivo.playbackId ? (
              <MuxPlayer
                streamType="on-demand"
                playbackId={videoActivo.playbackId}
                metadataVideoTitle={videoActivo.titulo || clase.titulo}
                primaryColor="#ffffff"
                accentColor="#d7f250"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  aspectRatio: '16/9', 
                  ['--mux-player-control-bar-base-color' as any]: 'rgba(19, 19, 19, 0.85)' 
                }}
              />
            ) : (
              // Fallback si el video no tiene Playback ID (ej. está "PROCESANDO")
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#131313] text-[#a1a1aa]">
                {videoActivo?.estado === 'PROCESANDO' ? (
                  <>
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d7f250] border-t-transparent mb-4"></div>
                    <p className="font-principal tracking-wider">PROCESANDO VIDEO...</p>
                  </>
                ) : (
                  <p>Selecciona un video del temario.</p>
                )}
              </div>
            )}
          </div>

          {/* TARJETA DE DETALLES DEL VIDEO ACTIVO */}
          <div className="bg-[#131313] rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-white font-principal uppercase">
                  {videoActivo?.titulo || clase.titulo}
                </h1>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="flex items-center gap-2 text-[#d7f250] uppercase tracking-wider font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#d7f250] animate-pulse"></span> 
                    {clase.titulo}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-white">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#d7f250] hover:text-black transition-all duration-300 rounded-md text-sm font-semibold group">
                  <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" /> Compartir
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#d7f250] hover:text-black transition-all duration-300 rounded-md text-sm font-semibold group">
                  <Bookmark className="w-4 h-4 transition-transform group-hover:scale-110" /> Guardar
                </button>
              </div>
            </div>

            <p className="text-[#a1a1aa] leading-relaxed mb-6 text-sm md:text-base">
              {clase.descripcionDetallada || 'Disfruta de esta clase exclusiva del Elite Training Program.'}
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: Temario y Progreso */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* TARJETA DE PROGRESO */}
          <div className="bg-[#131313] rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-xs text-[#a1a1aa] uppercase tracking-widest font-semibold">Tu Progreso</h3>
              <span className="text-lg font-bold text-[#d7f250] font-principal">{progresoPorcentaje}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-[#d7f250] rounded-full shadow-[0_0_10px_rgba(215,242,80,0.5)] transition-all duration-1000" 
                style={{ width: `${progresoPorcentaje}%` }}
              ></div>
            </div>
            
            <button className="w-full py-4 bg-[#d7f250] text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-white transition-colors flex items-center justify-center gap-2 font-principal">
              <Download className="w-4 h-4" /> Material Adicional
            </button>
          </div>

          {/* TEMARIO DEL CURSO */}
          <div className="bg-[#131313] rounded-xl p-6 shadow-lg flex-1">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white font-principal uppercase">
              <span className="w-4 h-1 bg-[#d7f250] block rounded-sm"></span>
              Contenido
            </h2>

            <div className="space-y-3">
              {clase.videos && clase.videos.length > 0 ? (
                // Ordenamos los videos para asegurar que salgan en orden 1, 2, 3...
                [...clase.videos]
                  .sort((a, b) => a.orden - b.orden)
                  .map((video: any, index: number) => {
                  
                  const isActivo = videoActivo?.id === video.id;

                  return (
                    <div 
                      key={video.id} 
                      onClick={() => setVideoActivo(video)}
                      className={`flex gap-4 items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                        isActivo 
                          ? 'bg-white/10 border-l-4 border-[#d7f250] shadow-md' 
                          : 'hover:bg-white/5 opacity-70 hover:opacity-100 border-l-4 border-transparent'
                      }`}
                    >
                      <div className={`relative w-16 md:w-20 aspect-video bg-[#0a0a0a] rounded flex-shrink-0 flex items-center justify-center overflow-hidden ${isActivo ? 'border border-[#d7f250]/50' : ''}`}>
                         {/* Si el video tiene miniatura, la mostramos sutilmente de fondo */}
                        {video.imagenUrl && (
                           <img src={video.imagenUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                        )}
                        <Play className={`w-5 h-5 relative z-10 ${isActivo ? 'text-[#d7f250] fill-[#d7f250]' : 'text-white/50 fill-white/50'}`} />
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        <p className={`text-sm font-bold truncate ${isActivo ? 'text-[#d7f250]' : 'text-[#ffffff]'}`}>
                          {index + 1}. {video.titulo}
                        </p>
                        <p className="text-xs text-[#a1a1aa] mt-1 flex items-center gap-1">
                          {isActivo ? (
                            <span className="animate-pulse">Reproduciendo ahora</span>
                          ) : (
                            video.duracion ? `${Math.floor(video.duracion / 60)} min` : 'Clase'
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-[#a1a1aa] py-4 text-sm">Esta clase aún no tiene videos disponibles.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};