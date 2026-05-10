import React from 'react';
import { Users, Search, ChevronUp, ChevronDown, ChevronRight, Phone, Calendar, Globe, FileText, ExternalLink, Loader2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClientes, type SortField } from '../../../hooks/useClientes';
import { type ResumenCliente } from '../../../api/admin';

const obtenerCodigoBandera = (pais: string | null | undefined) => {
  if (!pais) return null;
  const mapaPaises: Record<string, string> = {spain: 'es', argentina: 'ar', mexico: 'mx', méxico: 'mx', uruguay: 'uy', chile: 'cl', colombia: 'co', españa: 'es', peru: 'pe', perú: 'pe', 'united states': 'us', usa: 'us', ecuador: 'ec', bolivia: 'bo', paraguay: 'py', venezuela: 've', brasil: 'br', brazil: 'br',};
  const paisNormalizado = pais.toLowerCase().trim();
  return mapaPaises[paisNormalizado] || null;
};

export const ClientesPage = () => {
  const {
    clientesFiltrados, cargando, busqueda, setBusqueda, sortField, sortDir, handleSort, 
    expandedId, handleExpand, comprobantes, cargandoComprobantes, 
    formatearFecha, formatearFechaRegistro, formatCurrency,
    paginaActual, totalPages, setPagina, isPlaceholderData
  } = useClientes();

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="opacity-0 group-hover:opacity-30 w-3 h-3" />;
    return sortDir === 'asc' 
      ? <ChevronUp className="w-3 h-3 text-[#d7f250]" /> 
      : <ChevronDown className="w-3 h-3 text-[#d7f250]" />;
  };

  const DetallesExpandidos = ({ cliente }: { cliente: ResumenCliente }) => (
    <div className="px-4 pb-4 pt-4 border-t border-white/5 bg-[#1a1a1a]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Lado Izquierdo: Info del Cliente */}
        <div className="grid grid-cols-2 gap-3 h-min">
          <div className="p-3 bg-[#131313] rounded-lg">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3" /> Teléfono
            </p>
            <p className="text-sm text-white font-medium">
              {cliente.telefono || 'No disponible'}
            </p>
          </div>
          <div className="p-3 bg-[#131313] rounded-lg">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Registro
            </p>
            <p className="text-sm text-white font-medium">
              {formatearFechaRegistro(cliente.fechaRegistro)}
            </p>
          </div>
          <div className="p-3 bg-[#131313] rounded-lg col-span-2">
            <p className="text-xs text-gray-500 mb-2">Desglose de Inversión</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">ARS</span>
              <span className="text-sm font-semibold text-white">
                {formatCurrency(cliente.totalInvertidoArs)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-400">USD</span>
              <span className="text-sm font-semibold text-white">
                {formatCurrency(cliente.totalInvertidoUsd, true)}
              </span>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Lista de Comprobantes */}
        <div className="p-4 bg-[#131313] rounded-lg flex flex-col max-h-[180px]">
          <p className="text-sm text-[#d7f250] mb-3 flex items-center gap-2 font-bold">
            <FileText className="w-4 h-4" /> Historial de Comprobantes
          </p>
          
          <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-2">
            {cargandoComprobantes[cliente.id] ? (
              <div className="flex items-center justify-center py-4 text-gray-500 gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> 
                <span className="text-sm">Buscando en la nube...</span>
              </div>
            ) : comprobantes[cliente.id]?.length > 0 ? (
              comprobantes[cliente.id].map(comp => (
                <div key={comp.id} className="flex items-center justify-between bg-[#1a1a1a] p-2.5 rounded border border-white/5 hover:border-[#d7f250]/30 transition-colors">
                  <div>
                    <p className="text-sm text-white font-medium">{comp.numeroRecibo}</p>
                    <p className="text-xs text-gray-500">{formatearFecha(comp.fechaEmision)}</p>
                  </div>
                  <button
                    onClick={() => window.open(comp.urlPdf, '_blank')}
                    className="text-[#d7f250] hover:bg-[#d7f250]/20 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    Ver PDF <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No hay comprobantes generados.</p>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-5xl font-principal font-bold text-white flex items-center gap-2 sm:gap-3">
            <Users className="text-[#d7f250]" size={40} />
            <span className="hidden xs:inline">Historial de</span>Clientes
          </h1>
 
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar en esta página..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#131313] border border-white/10 rounded-full py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]/30 transition-all text-sm"
          />
        </div>
      </div>

      {/* CONTENIDO */}
      {cargando ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-[#d7f250] animate-pulse font-bold"
        >
          Cargando base de datos...
        </motion.div>
      ) : clientesFiltrados.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
            <Users className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg">No se encontraron clientes</p>
          <p className="text-gray-600 text-sm mt-1">Intenta con otro término o en otra página</p>
        </motion.div>
      ) : (
        <div className={isPlaceholderData ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
          <AnimatePresence mode="wait">
            <motion.div
              key={paginaActual}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* TABLA PARA DESKTOP */}
              <div className="hidden md:block bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#131313] border-b border-white/10 sticky top-0 z-10">
                      <tr className="text-xs uppercase tracking-wider text-[#a1a1aa] font-bold">
                        <th className="p-4 pl-6 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('nombreCompleto')}>
                          <span className="flex items-center gap-1">Cliente <SortIcon field="nombreCompleto" /></span>
                        </th>
                        <th className="p-4 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('pais')}>
                          <span className="flex items-center gap-1">País <SortIcon field="pais" /></span>
                        </th>
                        <th className="p-4 text-center cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('totalClasesCompradas')}>
                          <span className="flex items-center justify-center gap-1">Clases <SortIcon field="totalClasesCompradas" /></span>
                        </th>
                        <th className="p-4 text-right cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('totalInvertidoArs')}>
                          <span className="flex items-center justify-end gap-1">Inversión (ARS) <SortIcon field="totalInvertidoArs" /></span>
                        </th>
                        <th className="p-4 text-right cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('totalInvertidoUsd')}>
                          <span className="flex items-center justify-end gap-1">Inversión (USD) <SortIcon field="totalInvertidoUsd" /></span>
                        </th>
                        <th className="p-4 pr-6 text-right cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('fechaUltimaCompra')}>
                          <span className="flex items-center justify-end gap-1">Última Compra <SortIcon field="fechaUltimaCompra" /></span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {clientesFiltrados.map((cliente, idx) => {
                        const codBandera = obtenerCodigoBandera(cliente.pais);
                        const isExpanded = expandedId === cliente.id;

                        return (
                          <React.Fragment key={cliente.id}>
                            <motion.tr
                              onClick={() => handleExpand(cliente.id)}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.03, duration: 0.2 }}
                              className={`cursor-pointer transition-colors ${isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'}`}
                            >
                              <td className="p-4 pl-6">
                                <p className="font-semibold text-white">{cliente.nombreCompleto}</p>
                                <p className="text-xs text-gray-500">{cliente.correo}</p>
                              </td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-md text-sm text-gray-300">
                                  {codBandera ? (
                                    <img
                                      src={`https://flagcdn.com/w20/${codBandera}.png`}
                                      alt={cliente.pais || 'Bandera'}
                                      className="w-[18px] h-[13px] rounded-[2px] object-cover shadow-sm"
                                    />
                                  ) : (
                                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                                  )}
                                  {cliente.pais || 'Desconocido'}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className="inline-block px-2.5 py-1 bg-[#d7f250]/10 text-[#d7f250] rounded text-sm font-bold">
                                  {cliente.totalClasesCompradas}
                                </span>
                              </td>
                              <td className="p-4 text-right font-semibold text-white">
                                {formatCurrency(cliente.totalInvertidoArs)}
                              </td>
                              <td className="p-4 text-right font-semibold text-white">
                                {formatCurrency(cliente.totalInvertidoUsd, true)}
                              </td>
                              <td className="p-4 pr-6 text-right text-gray-400 text-sm flex items-center justify-end gap-3">
                                {formatearFecha(cliente.fechaUltimaCompra)}
                                <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90 text-[#d7f250]' : ''}`} />
                              </td>
                            </motion.tr>

                            {/* DETALLE EXPANDIDO PARA PC */}
                            <AnimatePresence>
                              {isExpanded && (
                                <tr>
                                  <td colSpan={6} className="p-0">
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                                      className="overflow-hidden"
                                    >
                                      <DetallesExpandidos cliente={cliente} />
                                    </motion.div>
                                  </td>
                                </tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CARDS PARA MOBILE */}
              <div className="md:hidden space-y-3">
                {clientesFiltrados.map((cliente, idx) => {
                  const codBandera = obtenerCodigoBandera(cliente.pais);
                  const isExpanded = expandedId === cliente.id;

                  return (
                    <motion.div
                      key={cliente.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
                      <div className={`bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden transition-colors ${isExpanded ? 'border-[#d7f250]/30' : ''}`}>
                        <button
                          onClick={() => handleExpand(cliente.id)}
                          className="w-full p-4 text-left active:bg-white/[0.02]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-white text-base truncate">{cliente.nombreCompleto}</p>
                              <p className="text-xs text-gray-500 truncate mt-0.5">{cliente.correo}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#d7f250]/10 text-[#d7f250] font-bold text-xs flex-shrink-0">
                                {cliente.totalClasesCompradas} {cliente.totalClasesCompradas === 1 ? 'clase' : 'clases'}
                              </span>
                              <ChevronRight
                                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
                            <span className="inline-flex items-center gap-1.5 text-gray-400">
                              {codBandera ? (
                                <img
                                  src={`https://flagcdn.com/w20/${codBandera}.png`}
                                  alt={cliente.pais || 'Bandera'}
                                  className="w-4 h-[11px] rounded-[1.5px] object-cover shadow-sm"
                                />
                              ) : (
                                <Globe className="w-3.5 h-3.5" />
                              )}
                              {cliente.pais || 'Desc.'}
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-white">
                              {formatCurrency(cliente.totalInvertidoArs)}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {formatCurrency(cliente.totalInvertidoUsd, true)}
                            </span>
                          </div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <DetallesExpandidos cliente={cliente} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* CONTROLES DE PAGINACIÓN */}
      {!cargando && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 bg-[#131313] border border-white/10 p-1.5 rounded-full px-2 shadow-sm">
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={paginaActual === 1 || isPlaceholderData}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white transition-all hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                if (totalPages <= 7 || (page === 1 && page <= totalPages) || (page === totalPages && page <= totalPages) || (page >= paginaActual - 1 && page <= paginaActual + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setPagina(page)}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                        paginaActual === page
                        ? 'bg-[#d7f250] text-black scale-110'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setPagina(p => Math.min(totalPages, p + 1))}
              disabled={paginaActual === totalPages || isPlaceholderData}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white transition-all hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};