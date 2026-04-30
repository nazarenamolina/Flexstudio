import { useParams } from "react-router-dom";
import { useClaseDetalle } from "../hooks/useClaseDetalle";
import { Play, Loader2, Video, Clock, CheckCircle, TextAlignStart } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

export const VideosPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Extraemos toda la "inteligencia" desde nuestro Hook
  const { 
    clase, 
    cargando, 
    error, 
    videoActivo, 
    setVideoActivo, 
    credencialesSeguras, 
    cargandoVideo,
    videosCompletados, 
    marcarCompletado 
  } = useClaseDetalle(id);

  // --- ESTADO: CARGANDO ---
  if (cargando) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d7f250] to-[#b8d940] flex items-center justify-center shadow-lg shadow-[#d7f250]/20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
        </div>
        <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Cargando...</p>
      </div>
    </div>
  );

  // --- ESTADO: ERROR ---
  if (error || !clase) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <Video className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-gray-600 font-medium">Error al cargar la clase. Verifica tu suscripción.</p>
      </div>
    </div>
  );

  // Cálculos para la UI
  const videosOrdenados = [...(clase.videos || [])].sort((a: any, b: any) => a.orden - b.orden);
  const videoIndex = videosOrdenados.findIndex((v: any) => v.id === videoActivo?.id);

  // --- UI PRINCIPAL ---
  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-24 pb-12">

        {/* Header con título */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-15 h-15 rounded-full bg-gradient-to-br from-[#d7f250] to-[#b8d940] flex items-center justify-center shadow-sm">
              <Video size={30} className="text-gray-900" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              {videoActivo?.titulo || clase.titulo}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ================= COLUMNA IZQUIERDA (REPRODUCTOR Y DESCRIPCIÓN) ================= */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Reproductor */}
            <div className="w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden relative shadow-2xl border border-gray-200">
              {cargandoVideo ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d7f250] to-[#b8d940] flex items-center justify-center shadow-lg shadow-[#d7f250]/30 mb-4">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
                  </div>
                  <p className="text-[#d7f250] text-xs font-bold tracking-[0.2em] uppercase">Validando acceso...</p>
                </div>
              ) : credencialesSeguras?.token ? (
                <MuxPlayer
                  streamType="on-demand"
                  playbackId={credencialesSeguras.playbackId}
                  tokens={{
                    playback: credencialesSeguras.token,
                    thumbnail: credencialesSeguras.token
                  }}
                  metadataVideoTitle={videoActivo?.titulo || clase.titulo}
                  primaryColor="#ffffff"
                  accentColor="#d7f250"
                  onEnded={() => marcarCompletado(videoActivo.id)}
                  style={{ width: '100%', height: '100%', aspectRatio: '16/9' }}
                >
                  <div slot="poster" className="absolute inset-0 w-full h-full bg-black overflow-hidden cursor-pointer">
                    {videoActivo?.imagenUrl && (
                      <img
                        src={videoActivo.imagenUrl}
                        alt="Fondo"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl brightness-[0.35] scale-125"
                      />
                    )}
                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-[#d7f250] animate-pulse"></span>
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                        Clase Lista
                      </span>
                    </div>
                  </div>
                </MuxPlayer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                      <Play size={28} className="text-white ml-1" />
                    </div>
                    <p className="text-gray-400 text-sm">Selecciona una lección para comenzar</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navegación entre videos (Anterior / Siguiente) */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => videoIndex > 0 && setVideoActivo(videosOrdenados[videoIndex - 1])}
                disabled={videoIndex <= 0}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-300 ${videoIndex <= 0 ? 'bg-gray-100 text-gray-400' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:-translate-x-1'}`}
              >
                <Play size={16} className="rotate-180" /> Anterior
              </button>
              <button
                onClick={() => videoIndex < videosOrdenados.length - 1 && setVideoActivo(videosOrdenados[videoIndex + 1])}
                disabled={videoIndex >= videosOrdenados.length - 1}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-300 ${videoIndex >= videosOrdenados.length - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#d7f250] to-[#c4e038] text-gray-900 hover:shadow-lg hover:shadow-[#d7f250]/25 hover:-translate-y-0.5'}`}
              >
                Siguiente <Play size={16} className="ml-1" />
              </button>
            </div>

            {/* Descripción del video */}
            <div className="bg-white bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312699/fondo_hwrosv.png')] rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-2 mb-4">
                <TextAlignStart size={18} className="text-[#d7f250]" />
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-900">{clase.titulo}</span>
                  {videoIndex >= 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-sm font-semibold text-[#d7f250]">Clase {videoIndex + 1} de {videosOrdenados.length}</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {videoActivo?.descripcion || clase.descripcionDetallada || 'Sin descripción disponible para esta lección.'}
              </p>
              
              {/* Notificación de Video Completado */}
              {videosCompletados.has(videoActivo?.id) && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-sm font-semibold text-green-700">Clase completada</span>
                </div>
              )}
            </div>
          </div>

          {/* ================= COLUMNA DERECHA (LISTA DE VIDEOS) ================= */}
          <div className="lg:col-span-4">
            <div className="bg-white bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1774312699/fondo_hwrosv.png')] rounded-3xl border border-neutral-100 p-6 top-28 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Contenido del curso: </h2>
                <span className="text-sm font-bold text-[#d7f250] bg-[#d7f250]/10 px-3 py-1 rounded-full">
                  {videosCompletados.size}/{videosOrdenados.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {videosOrdenados.map((video: any, index: number) => {
                  const isActivo = videoActivo?.id === video.id;
                  const isCompletado = videosCompletados.has(video.id);

                  return (
                    <div
                      key={video.id}
                      onClick={() => setVideoActivo(video)}
                      className={`group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                        isActivo
                        ? 'bg-[#d7f250]/80 border-[#d7f250] hover:bg-[#131313]/60 hover:border-neutral-400'
                        : 'bg-gray-50/50 hover:bg-gray-100 border-transparent hover:border-gray-200'
                      }`}
                    >
                      {/* Número o check */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActivo ? 'bg-[#131313] text-white' : isCompletado ? 'bg-green-100 text-green-600' : 'bg-gray-300 text-gray-800'
                      }`}>
                        {isCompletado && !isActivo ? <CheckCircle size={16} /> : index + 1}
                      </div>

                      {/* Info del Video */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-bold leading-tight line-clamp-2 ${isActivo ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                          {video.titulo}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock size={12} className={isActivo ? 'text-gray-700' : 'text-gray-400'} />
                          <span className={`text-xs ${isActivo ? 'text-gray-700' : 'text-gray-400'}`}>
                            {video.duracionFormateada || '0:00'}
                          </span>
                          {isActivo && (
                            <span className="ml-auto text-xs font-bold text-gray-900 uppercase tracking-tight">
                              En reproducción
                            </span>
                          )}
                        </div>
                      </div>
                      {!isActivo && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-900/0 group-hover:bg-gray-900/10 transition-all">
                          <Play size={20} className="text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity ml-87" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};