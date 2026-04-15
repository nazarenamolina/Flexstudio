import { useEffect, useState } from 'react';
import { Users, Search } from 'lucide-react';
import { obtenerHistorialClientes, type ResumenCliente } from '../../../api/admin';
import toast from 'react-hot-toast';

export const ClientesPage = () => {
  const [clientes, setClientes] = useState<ResumenCliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const data = await obtenerHistorialClientes();
        setClientes(data);
      } catch (error) {
        toast.error('Error al cargar el historial de clientes');
      } finally {
        setCargando(false);
      }
    };
    cargarClientes();
  }, []);

  const clientesFiltrados = clientes.filter(c => 
    c.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) || 
    c.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatearFecha = (fechaISO: string | null) => {
    if (!fechaISO) return 'Sin compras';
    return new Date(fechaISO).toLocaleDateString('es-AR', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-principal font-bold text-white flex items-center gap-3">
            <Users className="text-[#d7f250]" size={32} />
            Historial de Clientes
          </h1>
          <p className="text-[#a1a1aa] mt-1">Monitorea las compras y el valor de tus estudiantes.</p>
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#131313] border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#d7f250] transition-colors"
          />
        </div>
      </div>

      {cargando ? (
        <div className="text-center py-20 text-[#d7f250] animate-pulse font-bold">
          Cargando base de datos...
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#131313] border-b border-white/10 text-xs uppercase tracking-wider text-[#a1a1aa] font-bold">
                  <th className="p-4 pl-6">Cliente</th>
                  <th className="p-4">País</th>
                  <th className="p-4 text-center">Clases</th>
                  <th className="p-4 text-right">Inversión (ARS)</th>
                  <th className="p-4 text-right">Inversión (USD)</th>
                  <th className="p-4 pr-6 text-right">Última Compra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No se encontraron clientes.
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-white">{cliente.nombreCompleto}</p>
                        <p className="text-xs text-gray-400">{cliente.correo}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {cliente.pais}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block px-2 py-1 bg-[#d7f250]/10 text-[#d7f250] rounded text-xs font-bold">
                          {cliente.totalClasesCompradas}
                        </span>
                      </td>
                      <td className="p-4 text-right text-sm font-bold text-white">
                        ${cliente.totalInvertidoArs.toLocaleString('es-AR')}
                      </td>
                      <td className="p-4 text-right text-sm font-bold text-white">
                        U$D {cliente.totalInvertidoUsd.toFixed(2)}
                      </td>
                      <td className="p-4 pr-6 text-right text-sm text-gray-400">
                        {formatearFecha(cliente.fechaUltimaCompra)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};