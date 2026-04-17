import { useState, useEffect } from 'react';
import { Users, Video, DollarSign, Globe, Loader2 } from 'lucide-react';
import { obtenerEstadisticasRequest, type EstadisticasDashboard } from '../../../api/admin';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerEstadisticasRequest();
        setEstadisticas(data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        toast.error('No se pudieron cargar las estadísticas');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#d7f250]" />
        <p className="font-bold tracking-widest uppercase text-sm">Cargando métricas...</p>
      </div>
    );
  }

  if (!estadisticas) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Cabecera de la página */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
          Panel de <span className="text-[#d7f250]">Control</span>
        </h1>
        <p className="text-gray-400 mt-2 font-medium">
          Resumen general de rendimiento y ventas de Flex Studio.
        </p>
      </div>

      {/* Grid de Tarjetas (Widgets) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Tarjeta 1: Total Alumnos */}
        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-[#d7f250]/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Users size={80} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#d7f250]/10 flex items-center justify-center text-[#d7f250] mb-4 border border-[#d7f250]/20">
            <Users size={24} />
          </div>
          <p className="text-4xl font-black text-white">
            {estadisticas.totalUsuarios}
          </p>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2">
            Alumnos Registrados
          </p>
        </div>

        {/* Tarjeta 2: Clases Vendidas */}
        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Video size={80} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 border border-purple-500/20">
            <Video size={24} />
          </div>
          <p className="text-4xl font-black text-white">
            {estadisticas.clasesVendidas}
          </p>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2">
            Clases Vendidas
          </p>
        </div>

        {/* Tarjeta 3: Ingresos ARS */}
        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
            <DollarSign size={24} />
          </div>
          <p className="text-3xl font-black text-white">
            $ {estadisticas.ingresosArs.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2">
            Ingresos (ARS)
          </p>
        </div>

        {/* Tarjeta 4: Ingresos USD */}
        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Globe size={80} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
            <Globe size={24} />
          </div>
          <p className="text-3xl font-black text-white">
            U$D {estadisticas.ingresosUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2">
            Ingresos (USD)
          </p>
        </div>

      </div>

      {/* Espacio reservado para la Tabla de Clientes que haremos luego */}
      <div className="pt-8">
        <div className="w-full h-64 border-2 border-dashed border-gray-800 rounded-2xl flex items-center justify-center text-gray-500">
          <p className="font-bold tracking-widest uppercase text-sm">Próximamente: Historial de Clientes Recientes</p>
        </div>
      </div>

    </div>
  );
};