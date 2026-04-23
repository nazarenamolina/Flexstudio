import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Video, DollarSign, Globe, Loader2, PlusCircle, LayoutGrid, Search, ArrowRight, BarChart} from 'lucide-react';
import { obtenerEstadisticasRequest, obtenerHistorialClientes, type EstadisticasDashboard, type ResumenCliente } from '../../../api/admin';
import toast from 'react-hot-toast';
import Chart from 'react-apexcharts';
import {type ApexOptions } from 'apexcharts';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard | null>(null);
  const [clientesRecientes, setClientesRecientes] = useState<ResumenCliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [periodoActivo, setPeriodoActivo] = useState<'hoy' | 'semana' | 'mes' | 'anio'>('mes')

  useEffect(() => {
    const cargarDatos = async () => {
      try {
 
        const [dataEstadisticas, dataClientes] = await Promise.all([
          obtenerEstadisticasRequest(),
          obtenerHistorialClientes()
        ]);
        
        setEstadisticas(dataEstadisticas);
        setClientesRecientes(dataClientes.slice(0, 5)); 
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
        toast.error('No se pudieron cargar algunas métricas');
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
        <p className="font-bold tracking-widest uppercase text-sm">Cargando centro de mando...</p>
      </div>
    );
  }

  if (!estadisticas) return null;


  const chartOptions: ApexOptions = {
    chart: { type: 'donut', background: 'transparent' },
    theme: { mode: 'dark' },
    labels: ['Compras en ARS', 'Compras en USD'],
    colors: ['#d7f250', '#a855f7'],
    stroke: { show: true, colors: ['#131313'], width: 4 },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: { show: true, color: '#a1a1aa' },
            value: { show: true, color: '#ffffff', fontSize: '24px', fontWeight: 'bold' },
            total: { show: true, showAlways: true, label: 'Total Ventas', color: '#a1a1aa' }
          }
        }
      }
    },
    legend: { position: 'bottom' }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* CABECERA */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
          Panel de <span className="text-[#d7f250]">Control</span>
        </h1>
        <p className="text-gray-400 mt-2 font-medium">
          Resumen general de rendimiento y ventas de Flex Studio.
        </p>
      </div>

      {/* 1. TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Alumnos */}
        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-[#d7f250]/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Users size={80} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#d7f250]/10 flex items-center justify-center text-[#d7f250] mb-4 border border-[#d7f250]/20">
            <Users size={24} />
          </div>
          <p className="text-4xl font-black text-white">{estadisticas.totalUsuarios}</p>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2">Alumnos Registrados</p>
        </div>

        {/* Clases Vendidas */}
        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Video size={80} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 border border-purple-500/20">
            <Video size={24} />
          </div>
          <p className="text-4xl font-black text-white">{estadisticas.clasesVendidas}</p>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2">Clases Vendidas</p>
        </div>

        {/* Ingresos ARS */}
        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
            <DollarSign size={24} />
          </div>
          <p className="text-3xl font-black text-white">$ {estadisticas.ingresosArs.toLocaleString('es-AR')}</p>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2">Ingresos (ARS)</p>
        </div>

        {/* Ingresos USD */}
        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Globe size={80} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
            <Globe size={24} />
          </div>
          <p className="text-3xl font-black text-white">U$D {estadisticas.ingresosUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2">Ingresos (USD)</p>
        </div>
      </div>

      {/* 2. ACCESOS DIRECTOS (QUICK ACTIONS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <button onClick={() => navigate('/admin/videos/nuevo')} className="flex items-center gap-4 p-4 bg-[#131313] border border-gray-800 hover:border-[#d7f250] rounded-2xl transition-all group">
          <div className="bg-white/5 p-3 rounded-xl group-hover:bg-[#d7f250] group-hover:text-black transition-colors">
            <PlusCircle size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold text-white uppercase tracking-wider text-sm">Subir Nueva Clase</p>
            <p className="text-xs text-gray-500">Agrega contenido a la librería</p>
          </div>
        </button>

        <button onClick={() => navigate('/admin/categorias')} className="flex items-center gap-4 p-4 bg-[#131313] border border-gray-800 hover:border-[#d7f250] rounded-2xl transition-all group">
          <div className="bg-white/5 p-3 rounded-xl group-hover:bg-[#d7f250] group-hover:text-black transition-colors">
            <LayoutGrid size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold text-white uppercase tracking-wider text-sm">Gestionar Categorías</p>
            <p className="text-xs text-gray-500">Organiza tus disciplinas</p>
          </div>
        </button>

        <button onClick={() => navigate('/admin/clientes')} className="flex items-center gap-4 p-4 bg-[#131313] border border-gray-800 hover:border-[#d7f250] rounded-2xl transition-all group">
          <div className="bg-white/5 p-3 rounded-xl group-hover:bg-[#d7f250] group-hover:text-black transition-colors">
            <Search size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold text-white uppercase tracking-wider text-sm">Buscar Alumna</p>
            <p className="text-xs text-gray-500">Ver historial de compras</p>
          </div>
        </button>
      </div>

    {/* 2. SECCIÓN FINANCIERA Y GRÁFICOS */}
      <div className="bg-[#131313] border border-gray-800 rounded-3xl p-6 shadow-2xl mt-6">
        
        {/* Cabecera con Botones de Filtro */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <BarChart className="text-[#d7f250] w-6 h-6" />
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Desempeño Financiero</h2>
          </div>
          
          {/* BOTONES INTERACTIVOS */}
          <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-gray-800">
            {[
              { id: 'hoy', label: 'Hoy' },
              { id: 'semana', label: '7 Días' },
              { id: 'mes', label: 'Este Mes' },
              { id: 'anio', label: 'Este Año' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPeriodoActivo(tab.id as any)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  periodoActivo === tab.id 
                    ? 'bg-[#d7f250] text-[#131313] shadow-md' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Contenido Dinámico (Cambia según el botón) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Bloque de Ingresos */}
          <div className="space-y-6">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
              Ingresos del período seleccionado
            </p>
            
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d7f250] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <p className="text-sm text-gray-500 font-bold mb-1">Pesos Argentinos (ARS)</p>
              <p className="text-4xl font-black text-white">
                ${estadisticas.resumenPeriodos[periodoActivo].ars.toLocaleString('es-AR')}
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <p className="text-sm text-gray-500 font-bold mb-1">Dólares (USD)</p>
              <p className="text-4xl font-black text-[#d7f250]">
                U$D {estadisticas.resumenPeriodos[periodoActivo].usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Bloque del Gráfico Circular */}
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            {estadisticas.resumenPeriodos[periodoActivo].ventasArs === 0 && 
             estadisticas.resumenPeriodos[periodoActivo].ventasUsd === 0 ? (
               <div className="text-center p-8 border-2 border-dashed border-gray-800 rounded-2xl w-full h-full flex flex-col justify-center items-center">
                  <p className="text-gray-500 font-medium">No hay transacciones registradas</p>
                  <p className="text-sm text-gray-600 mt-1">en este período de tiempo.</p>
               </div>
            ) : (
              <>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">
                  Volumen de Transacciones
                </p>
                <Chart 
                  options={{
                    ...chartOptions,
                    labels: ['Ventas ARS', 'Ventas USD'],
                  }} 
                  series={[
                    estadisticas.resumenPeriodos[periodoActivo].ventasArs, 
                    estadisticas.resumenPeriodos[periodoActivo].ventasUsd
                  ]} 
                  type="donut" 
                  width="100%" 
                  height="320" 
                />
              </>
            )}
          </div>

        </div>
      </div>

      {/* 3. TABLA DE CLIENTES RECIENTES */}
      <div className="pt-4">
        <div className="bg-[#131313] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Actividad Reciente</h2>
              <p className="text-sm text-gray-500">Últimas alumnas en realizar compras.</p>
            </div>
            <button onClick={() => navigate('/admin/clientes')} className="flex items-center gap-2 text-sm font-bold text-[#d7f250] hover:text-white transition-colors">
              Ver Todas <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-500 uppercase tracking-widest bg-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold">Alumna</th>
                  <th className="px-6 py-4 font-bold">País</th>
                  <th className="px-6 py-4 font-bold">Clases</th>
                  <th className="px-6 py-4 font-bold">Inversión Total</th>
                  <th className="px-6 py-4 font-bold">Última Compra</th>
                </tr>
              </thead>
              <tbody>
                {clientesRecientes.length > 0 ? (
                  clientesRecientes.map((cliente) => (
                    <tr key={cliente.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{cliente.nombreCompleto}</p>
                        <p className="text-xs">{cliente.correo}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-800 text-gray-300 py-1 px-3 rounded-full text-xs font-medium">
                          {cliente.pais}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        {cliente.totalClasesCompradas}
                      </td>
                      <td className="px-6 py-4">
                        {cliente.totalInvertidoUsd > 0 && <span className="block text-[#d7f250] font-bold">U$D {cliente.totalInvertidoUsd}</span>}
                        {cliente.totalInvertidoArs > 0 && <span className="block text-white font-bold">$ {cliente.totalInvertidoArs}</span>}
                      </td>
                      <td className="px-6 py-4">
                        {cliente.fechaUltimaCompra 
                          ? new Date(cliente.fechaUltimaCompra).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }) 
                          : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      No hay compras registradas aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};