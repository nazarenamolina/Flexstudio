import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useClaseDetalle } from "../hooks/useClaseDetalle";
import { useAuthStore } from "../store/authStore";
import { Play, Loader2, Video, Clock, CheckCircle, TextAlignStart, AlertTriangle, RotateCcw, Lock } from "lucide-react";
import { formatearFecha, nombreModulo } from "../modulos";
import MuxPlayer from "@mux/mux-player-react";
import { mensajeDeError } from "../api/errores";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { tituloVisible } from "../titulos";

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
    errorVideo,
    renovarCredenciales,
    alEmpezarReproduccion,
    videosCompletados,
    marcarCompletado
  } = useClaseDetalle(id);

  useTituloPagina(clase && tituloVisible(clase.titulo));

  // El admin llega desde el panel: vuelve ahí, porque no tiene "Mis clases".
  const esAdmin = useAuthStore((state) => state.usuario?.rol === 'ADMIN');
  const rutaVolver = esAdmin ? '/admin/categorias' : '/mis-clases';
  const textoVolver = esAdmin ? 'Volver al panel' : 'Volver a mis clases';

  // Posición del video: si hay que pedir un token nuevo (venció o falló), sigue desde ahí.
  const posicionRef = useRef(0);
  const [reanudar, setReanudar] = useState<{ idVideo: string; segundos: number } | null>(null);
  const renovarDesdeDondeIba = () => {
    if (videoActivo) setReanudar({ idVideo: videoActivo.id, segundos: posicionRef.current });
    renovarCredenciales();
  };
  // Video que terminó de verse: sobre el reproductor se ofrece pasar al siguiente.
  const [terminado, setTerminado] = useState<string | null>(null);

  const inicio = reanudar && reanudar.idVideo === videoActivo?.id && reanudar.segundos > 0 ? reanudar.segundos : undefined;
  // Un solo reintento automático hasta que el video vuelva a cargar bien: si el error no era del
  // token, no se entra en un bucle de pedir credenciales.
  const reintentoAutomaticoRef = useRef(false);
  useEffect(() => {
    posicionRef.current = 0;
  }, [videoActivo?.id]);

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
      <div role="alert" className="flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <Video className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-gray-700 font-medium text-center max-w-sm">
          {mensajeDeError(error, 'No pudimos cargar la clase. Revisá tu conexión e intentá de nuevo.')}
        </p>
        <Link to={rutaVolver} className="font-principal uppercase tracking-wide underline underline-offset-4 decoration-[#d7f250] decoration-2 hover:decoration-[#131313]">
          {textoVolver}
        </Link>
      </div>
    </div>
  );

  // Cálculos para la UI (el back manda los videos ordenados por mes y por orden)
  const videosOrdenados = clase.videos || [];
  const videoIndex = videosOrdenados.findIndex((v) => v.id === videoActivo?.id);
  const modulos = clase.modulos ?? [];
  const mesesVigentes = modulos.filter((m) => m.estado === 'VIGENTE');
  const moduloActivo = modulos.find((m) => m.id === videoActivo?.idModulo);
  const videosDelMes = videosOrdenados.filter((v) => v.idModulo === videoActivo?.idModulo);
  const indiceEnElMes = videosDelMes.findIndex((v) => v.id === videoActivo?.id);
  const esUltimoDelMes = indiceEnElMes >= 0 && indiceEnElMes === videosDelMes.length - 1;
  const siguienteVideo = videoIndex >= 0 ? videosOrdenados[videoIndex + 1] : undefined;
  // Al terminar el mes, el siguiente video puede ser del próximo mes o haber que comprarlo.
  const mesSiguiente = moduloActivo ? modulos.find((m) => m.numero > moduloActivo.numero && m.estado !== 'NO_DISPONIBLE') : undefined;
  const completadosVisibles = videosOrdenados.filter((v) => videosCompletados.has(v.id)).length;

  // --- UI PRINCIPAL ---
  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-24 pb-12">

        {esAdmin && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#131313] px-5 py-3 text-sm text-white">
            <span>Estás viendo la clase en modo admin, sin comprarla.</span>
            <Link to={rutaVolver} className="font-bold text-[#d7f250] underline underline-offset-4">{textoVolver}</Link>
          </div>
        )}

        {/* Header con título */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-15 h-15 rounded-full bg-gradient-to-br from-[#d7f250] to-[#b8d940] flex items-center justify-center shadow-sm">
              <Video size={30} className="text-gray-900" />
            </div>
            <h1 className="font-principal text-3xl md:text-4xl lg:text-5xl uppercase leading-tight text-[#131313]">
              {videoActivo?.titulo || tituloVisible(clase.titulo)}
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
              ) : errorVideo ? (
                <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-center">
                  <AlertTriangle className="w-10 h-10 text-[#d7f250]" />
                  <p className="text-white font-semibold max-w-sm">
                    {mensajeDeError(errorVideo, 'No pudimos cargar este video.')}
                  </p>
                  <button
                    type="button"
                    onClick={renovarDesdeDondeIba}
                    className="inline-flex items-center gap-2 rounded-full bg-[#d7f250] px-5 py-2.5 font-principal font-bold uppercase text-[#131313] hover:bg-white transition-colors cursor-pointer"
                  >
                    <RotateCcw size={16} /> Reintentar
                  </button>
                </div>
              ) : credencialesSeguras && videoActivo ? (
                <MuxPlayer
                  // Con tokens nuevos se monta un reproductor nuevo que arranca donde había quedado.
                  key={credencialesSeguras.tokens.playback}
                  streamType="on-demand"
                  playbackId={credencialesSeguras.playbackId}
                  tokens={credencialesSeguras.tokens}
                  startTime={inicio}
                  metadataVideoTitle={videoActivo.titulo || tituloVisible(clase.titulo)}
                  primaryColor="#ffffff"
                  accentColor="#d7f250"
                  onTimeUpdate={(e) => { posicionRef.current = (e.target as HTMLMediaElement).currentTime; }}
                  onError={() => {
                    // Lo más común es que el token venció (pausa larga): se pide uno nuevo una vez.
                    if (reintentoAutomaticoRef.current) return;
                    reintentoAutomaticoRef.current = true;
                    renovarDesdeDondeIba();
                  }}
                  onLoadedMetadata={() => { reintentoAutomaticoRef.current = false; }}
                  onPlay={alEmpezarReproduccion}
                  onEnded={() => { marcarCompletado(videoActivo.id); setTerminado(videoActivo.id); }}
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
                    <p className="text-gray-400 text-sm text-center px-6">
                      {videosOrdenados.length > 0
                        ? 'Elegí una lección para comenzar'
                        : modulos.some((m) => m.estado === 'VENCIDO')
                          ? 'Tu acceso a esta clase venció. Podés volver a comprar el mes que quieras ver.'
                          : 'Esta clase todavía no tiene videos disponibles.'}
                    </p>
                  </div>
                </div>
              )}
              {terminado === videoActivo?.id && (
                <div role="dialog" aria-label="Lección terminada" className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-[#131313]/90 p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-[#d7f250]" />
                  {siguienteVideo ? (
                    <>
                      <p className="font-principal text-2xl sm:text-3xl uppercase text-white">
                        {esUltimoDelMes && moduloActivo ? `¡Terminaste el Mes ${moduloActivo.numero}!` : '¡Terminaste esta lección!'}
                      </p>
                      <button
                        type="button"
                        autoFocus
                        onClick={() => { setTerminado(null); setVideoActivo(siguienteVideo); }}
                        className="inline-flex items-center gap-2 rounded-full bg-[#d7f250] px-6 py-3 font-principal font-bold uppercase text-[#131313] hover:bg-white transition-colors cursor-pointer max-w-full"
                      >
                        <Play size={18} className="shrink-0" />
                        <span className="truncate">Ver siguiente: {siguienteVideo.titulo}</span>
                      </button>
                    </>
                  ) : esUltimoDelMes && moduloActivo && mesSiguiente && !esAdmin ? (
                    <>
                      <p className="font-principal text-2xl sm:text-3xl uppercase text-white">¡Terminaste el Mes {moduloActivo.numero}!</p>
                      <p className="text-white/80">Ya podés seguir con el Mes {mesSiguiente.numero}.</p>
                      <Link to={`/categorias/${clase.id}#meses`} className="inline-flex items-center gap-2 rounded-full bg-[#d7f250] px-6 py-3 font-principal font-bold uppercase text-[#131313] hover:bg-white transition-colors">
                        Ver el Mes {mesSiguiente.numero}
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="font-principal text-2xl sm:text-3xl uppercase text-white">¡Terminaste la clase!</p>
                      <Link to={rutaVolver} className="inline-flex items-center gap-2 rounded-full bg-[#d7f250] px-6 py-3 font-principal font-bold uppercase text-[#131313] hover:bg-white transition-colors">
                        {textoVolver}
                      </Link>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setTerminado(null)}
                    className="inline-flex items-center gap-2 font-principal text-sm uppercase tracking-wide text-white/80 hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Ver de nuevo
                  </button>
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
            <div className="bg-white bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto/v1774312699/fondo_hwrosv.png')] rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-2 mb-4">
                <TextAlignStart size={18} className="text-[#131313]" />
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-900">{tituloVisible(clase.titulo)}</span>
                  {videoIndex >= 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-xs font-bold uppercase tracking-wide text-[#131313] bg-[#d7f250] px-2 py-0.5 rounded-full">Clase {videoIndex + 1} de {videosOrdenados.length}</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {videoActivo?.descripcion || clase.descripcionDetallada || 'Sin descripción disponible para esta lección.'}
              </p>
              
              {/* Notificación de Video Completado */}
              {!!videoActivo && videosCompletados.has(videoActivo.id) && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-sm font-semibold text-green-700">Clase completada</span>
                </div>
              )}
            </div>
          </div>

          {/* ================= COLUMNA DERECHA (LISTA DE VIDEOS) ================= */}
          <div className="lg:col-span-4">
            <div className="bg-white bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/f_auto,q_auto/v1774312699/fondo_hwrosv.png')] rounded-3xl border border-neutral-100 p-6 shadow-sm lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-principal text-xl uppercase text-[#131313]">Contenido de la clase</h2>
                <span className="text-sm font-bold text-[#131313] bg-[#d7f250] px-3 py-1 rounded-full" aria-label={`${completadosVisibles} de ${videosOrdenados.length} videos completados`}>
                  {completadosVisibles}/{videosOrdenados.length}
                </span>
              </div>

              <div className="flex flex-col gap-6">
              {mesesVigentes.map((mes) => (
              <section key={mes.id} aria-label={nombreModulo(mes)}>
              <div className="mb-3">
                <h3 className="font-principal text-lg uppercase leading-tight text-[#131313]">{nombreModulo(mes)}</h3>
                {mes.fechaVencimiento && !esAdmin && (
                  <p className="text-xs font-semibold text-neutral-600">Acceso hasta el {formatearFecha(mes.fechaVencimiento)}</p>
                )}
              </div>
              <ol className="flex flex-col gap-3">
                {videosOrdenados.filter((v) => v.idModulo === mes.id).map((video, index) => {
                  const isActivo = videoActivo?.id === video.id;
                  const isCompletado = videosCompletados.has(video.id);

                  return (
                    <li key={video.id}>
                      <button
                        type="button"
                        onClick={() => setVideoActivo(video)}
                        aria-current={isActivo ? 'true' : undefined}
                        className={`group w-full text-left flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border focus:outline-none focus-visible:ring-4 focus-visible:ring-[#131313]/30 ${
                          isActivo
                          ? 'bg-[#d7f250] border-[#d7f250]'
                          : 'bg-gray-50/50 hover:bg-gray-100 border-transparent hover:border-gray-200'
                        }`}
                      >
                        {/* Número o check */}
                        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isActivo ? 'bg-[#131313] text-white' : isCompletado ? 'bg-green-100 text-green-700' : 'bg-gray-300 text-gray-800'
                        }`}>
                          {isCompletado && !isActivo ? <CheckCircle size={16} aria-label="Completado" /> : index + 1}
                        </span>

                        {/* Info del video */}
                        <span className="flex-1 min-w-0">
                          <span className={`block text-sm font-bold leading-tight line-clamp-2 ${isActivo ? 'text-[#131313]' : 'text-gray-700 group-hover:text-gray-900'}`}>
                            {video.titulo}
                          </span>
                          <span className="flex items-center gap-1.5 mt-1">
                            <Clock size={12} className={isActivo ? 'text-gray-700' : 'text-gray-500'} />
                            <span className={`text-xs ${isActivo ? 'text-gray-700' : 'text-gray-500'}`}>
                              {video.duracionFormateada || '–'}
                            </span>
                            {isActivo && (
                              <span className="ml-auto text-xs font-bold text-[#131313] uppercase tracking-tight">En reproducción</span>
                            )}
                          </span>
                        </span>

                        {!isActivo && (
                          <Play size={18} aria-hidden className="shrink-0 text-gray-900 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
              </section>
              ))}

              {/* Meses sin acceso vigente: vencidos, bloqueados o sin comprar. */}
              {!esAdmin && modulos.some((m) => m.estado !== 'VIGENTE' && m.estado !== 'NO_DISPONIBLE') && (
                <div className="border-t border-neutral-200 pt-4">
                  <ul className="flex flex-col gap-2 text-sm">
                    {modulos.filter((m) => m.estado !== 'VIGENTE' && m.estado !== 'NO_DISPONIBLE').map((mes) => (
                      <li key={mes.id} className="flex items-start gap-2 text-neutral-700">
                        <Lock size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span>
                          <strong>{nombreModulo(mes)}:</strong>{' '}
                          {mes.estado === 'BLOQUEADO' ? `se habilita al terminar el Mes ${mes.requiereNumero}.`
                            : mes.estado === 'VENCIDO' && mes.fechaVencimiento ? `venció el ${formatearFecha(mes.fechaVencimiento)}.`
                            : 'todavía no lo compraste.'}
                          {mes.comprable && (
                            <> <Link to={`/categorias/${clase.id}#meses`} className="font-bold underline underline-offset-2">{mes.estado === 'VENCIDO' ? 'Volver a comprar' : 'Comprar'}</Link></>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};