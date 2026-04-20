import { Users, Search, ChevronUp, ChevronDown, ChevronRight, Phone, Mail, Calendar, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClientes, type SortField } from '../../../hooks/useClientes'; // Ajusta la ruta a donde guardaste el hook

export const ClientesPage = () => {
 
  const {clientesFiltrados, cargando, busqueda, setBusqueda, sortField, sortDir, handleSort, expandedId, setExpandedId, formatearFecha, formatearFechaRegistro, formatCurrency,} = useClientes();

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="opacity-0 group-hover:opacity-30 w-3 h-3" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-[#d7f250]" />
      : <ChevronDown className="w-3 h-3 text-[#d7f250]" />;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-principal font-bold text-white flex items-center gap-2 sm:gap-3">
            <Users className="text-[#d7f250]" size={28} />
            <span className="hidden xs:inline">Historial de</span>Clientes
          </h1>
          <p className="text-[#a1a1aa] mt-1 text-sm md:text-base">
            {cargando ? 'Cargando...' : `${clientesFiltrados.length} estudiante${clientesFiltrados.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
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
          <p className="text-gray-600 text-sm mt-1">Intenta con otro término de búsqueda</p>
        </motion.div>
      ) : (
        <>
          {/* TABLA PARA DESKTOP */}
          <div className="hidden md:block bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#131313] border-b border-white/10 sticky top-0 z-10">
                  <tr className="text-xs uppercase tracking-wider text-[#a1a1aa] font-bold">
                    <th
                      className="p-4 pl-6 cursor-pointer hover:text-white transition-colors group"
                      onClick={() => handleSort('nombreCompleto')}
                    >
                      <span className="flex items-center gap-1">
                        Cliente
                        <SortIcon field="nombreCompleto" />
                      </span>
                    </th>
                    <th
                      className="p-4 cursor-pointer hover:text-white transition-colors group"
                      onClick={() => handleSort('pais')}
                    >
                      <span className="flex items-center gap-1">
                        País
                        <SortIcon field="pais" />
                      </span>
                    </th>
                    <th
                      className="p-4 text-center cursor-pointer hover:text-white transition-colors group"
                      onClick={() => handleSort('totalClasesCompradas')}
                    >
                      <span className="flex items-center justify-center gap-1">
                        Clases
                        <SortIcon field="totalClasesCompradas" />
                      </span>
                    </th>
                    <th
                      className="p-4 text-right cursor-pointer hover:text-white transition-colors group"
                      onClick={() => handleSort('totalInvertidoArs')}
                    >
                      <span className="flex items-center justify-end gap-1">
                        Inversión (ARS)
                        <SortIcon field="totalInvertidoArs" />
                      </span>
                    </th>
                    <th
                      className="p-4 text-right cursor-pointer hover:text-white transition-colors group"
                      onClick={() => handleSort('totalInvertidoUsd')}
                    >
                      <span className="flex items-center justify-end gap-1">
                        Inversión (USD)
                        <SortIcon field="totalInvertidoUsd" />
                      </span>
                    </th>
                    <th
                      className="p-4 pr-6 text-right cursor-pointer hover:text-white transition-colors group"
                      onClick={() => handleSort('fechaUltimaCompra')}
                    >
                      <span className="flex items-center justify-end gap-1">
                        Última Compra
                        <SortIcon field="fechaUltimaCompra" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {clientesFiltrados.map((cliente, idx) => (
                    <motion.tr
                      key={cliente.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="p-4 pl-6">
                        <p className="font-semibold text-white">{cliente.nombreCompleto}</p>
                        <p className="text-xs text-gray-500">{cliente.correo}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md text-sm text-gray-300">
                          <Globe className="w-3 h-3" />
                          {cliente.pais}
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
                      <td className="p-4 pr-6 text-right text-gray-400 text-sm">
                        {formatearFecha(cliente.fechaUltimaCompra)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CARDS PARA MOBILE */}
          <div className="md:hidden space-y-3">
            {clientesFiltrados.map((cliente, idx) => (
              <motion.div
                key={cliente.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <div
                  className={`bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden transition-colors ${
                    expandedId === cliente.id ? 'border-[#d7f250]/30' : ''
                  }`}
                >
                  {/* HEADER DE CARD - SIEMPRE VISIBLE */}
                  <button
                    onClick={() => setExpandedId(expandedId === cliente.id ? null : cliente.id)}
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
                          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                            expandedId === cliente.id ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* INFO PRINCIPAL EN COLLAPSED */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <Globe className="w-3.5 h-3.5" />
                        {cliente.pais}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-white">
                        {formatCurrency(cliente.totalInvertidoArs)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatCurrency(cliente.totalInvertidoUsd, true)}
                      </span>
                    </div>
                  </button>

                  {/* CONTENIDO EXPANDIDO */}
                  <AnimatePresence>
                    {expandedId === cliente.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 border-t border-white/5">
                          <div className="grid grid-cols-2 gap-3">
                            {/* Teléfono */}
                            <div className="p-3 bg-[#131313] rounded-lg">
                              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <Phone className="w-3 h-3" /> Teléfono
                              </p>
                              <p className="text-sm text-white font-medium">
                                {cliente.telefono || 'No disponible'}
                              </p>
                            </div>

                            {/* Fecha Registro */}
                            <div className="p-3 bg-[#131313] rounded-lg">
                              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Registro
                              </p>
                              <p className="text-sm text-white font-medium">
                                {formatearFechaRegistro(cliente.fechaRegistro)}
                              </p>
                            </div>

                            {/* Última Compra */}
                            <div className="p-3 bg-[#131313] rounded-lg col-span-2">
                              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> Última Compra
                              </p>
                              <p className="text-sm text-white font-medium">
                                {formatearFecha(cliente.fechaUltimaCompra)}
                              </p>
                            </div>

                            {/* Inversión Detallada */}
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
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};