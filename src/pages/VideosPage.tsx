import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClaseDetalle } from "../hooks/useClaseDetalle";
import { Play, Loader2 } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { obtenerCredencialesReproduccion } from "../api/videos";

export const VideosPage = () => {
  const { id } = useParams<{ id: string }>();
  const { clase, cargando, error } = useClaseDetalle(id);

  const [videoActivo, setVideoActivo] = useState<any>(null);
  const [credencialesSeguras, setCredencialesSeguras] = useState<{ playbackId: string, token: string } | null>(null);
  const [cargandoVideo, setCargandoVideo] = useState(false);

  // 1. Selección inicial del primer video
  useEffect(() => {
    if (clase?.videos && clase.videos.length > 0 && !videoActivo) {
      const videosOrdenados = [...clase.videos].sort((a, b) => a.orden - b.orden);
      setVideoActivo(videosOrdenados[0]);
    }
  }, [clase, videoActivo]);

  // 2. Seguridad: Obtener URL firmada (Token JWT) cada vez que cambia el video
  useEffect(() => {
    const solicitarLlaves = async () => {
      if (!videoActivo?.id) return;

      setCargandoVideo(true);
      setCredencialesSeguras(null);

      try {
        const credenciales = await obtenerCredencialesReproduccion(videoActivo.id);
        setCredencialesSeguras(credenciales);
        console.log("¡Llave secreta recibida para el video!", credenciales.token);
      } catch (err) {
        console.error("Error de seguridad en Mux:", err);
      } finally {
        setCargandoVideo(false);
      }
    };

    solicitarLlaves();
  }, [videoActivo?.id]);

  if (cargando) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <Loader2 className="w-10 h-10 animate-spin text-[#d7f250]" />
    </div>
  );

  if (error || !clase) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
      <p>Error al cargar la clase. Verifica tu suscripción.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* COLUMNA IZQUIERDA (8/12): Reproductor y Texto */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* REPRODUCTOR MUX CON TOKEN */}
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-white/5">
            {cargandoVideo ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#131313]">
                <Loader2 className="w-12 h-12 animate-spin text-[#d7f250] mb-4" />
                <p className="font-principal tracking-[0.2em] text-xs text-[#d7f250]">VALIDANDO ACCESO...</p>
              </div>
            ) : credencialesSeguras?.token ? (
              <MuxPlayer
                streamType="on-demand"
                playbackId={credencialesSeguras.playbackId}
                tokens={{
                  playback: credencialesSeguras.token,
                  thumbnail: credencialesSeguras.token
                }}
                poster={videoActivo?.imagenUrl}
                metadataVideoTitle={videoActivo?.titulo || clase.titulo}
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
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <p>Selecciona una lección para comenzar</p>
              </div>
            )}
          </div>

          {/* DETALLES DINÁMICOS */}
          <div className="space-y-4 py-4">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {videoActivo?.titulo || clase.titulo}
            </h1>
            <div className="flex items-center gap-2 text-[#d7f250] font-bold text-sm tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#d7f250] animate-pulse" />
              {clase.titulo}
            </div>
            <p className="text-gray-400 text-base md:text-lg max-w-4xl leading-relaxed">
              {videoActivo?.descripcion || clase.descripcionDetallada || 'Sin descripción disponible para esta lección.'}
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA (4/12): Listado de Contenido Estilo Foto */}
        <div className="lg:col-span-4">
          <div className="bg-[#131313] rounded-3xl border border-white/5 p-6 sticky top-28">
            <h2 className="text-[#d7f250] font-black italic text-xl mb-6 tracking-tighter uppercase">
              Contenido
            </h2>

            <div className="flex flex-col gap-3">
              {clase.videos?.sort((a: any, b: any) => a.orden - b.orden).map((video: any) => {
                const isActivo = videoActivo?.id === video.id;

                return (
                  <div
                    key={video.id}
                    onClick={() => !isActivo && setVideoActivo(video)}
                    className={`group relative flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 ${isActivo
                        ? 'bg-[#d7f250] text-black shadow-[0_10px_30px_rgba(215,242,80,0.2)]'
                        : 'bg-white/5 hover:bg-white/10'
                      }`}
                  >
                    {/* Thumbnail con Play Overlay */}
                    <div className="relative w-24 aspect-video rounded-lg overflow-hidden shrink-0 bg-black">
                      {video.imagenUrl && (
                        <img src={video.imagenUrl} alt="" className={`w-full h-full object-cover ${isActivo ? 'opacity-80' : 'opacity-40 group-hover:opacity-60'}`} />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className={`w-5 h-5 ${isActivo ? 'text-black fill-black' : 'text-white/50'}`} />
                      </div>
                    </div>

                    {/* Info de la clase */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-black leading-tight line-clamp-2 uppercase ${isActivo ? 'text-black' : 'text-white'}`}>
                        {video.titulo}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold ${isActivo ? 'text-black/60' : 'text-gray-500'}`}>
                          {video.duracionFormateada || '0:00'}
                        </span>
                        {isActivo && (
                          <span className="text-[10px] font-black uppercase tracking-tighter ml-auto">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};