import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Video, DollarSign, Globe, Loader2, PlusCircle, LayoutGrid, Search, ArrowRight, BarChart, Star, Image as ImageIcon } from 'lucide-react';
import { obtenerEstadisticasRequest, obtenerHistorialClientes, obtenerClasesMasCompradasRequest } from '../../../api/admin';
import { actualizarCategoriaRequest } from '../../../api/categoria';
import { ToggleDestacada } from '../../../components/ToggleDestacada';
import toast from 'react-hot-toast';
import Chart from 'react-apexcharts';
import { type ApexOptions } from 'apexcharts';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [periodoActivo, setPeriodoActivo] = useState<'hoy' | 'semana' | 'mes' | 'anio'>('mes');
 const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      const [dataEstadisticas, respuestaClientes, dataTopClases] = await Promise.all([
        obtenerEstadisticasRequest(),
        obtenerHistorialClientes(1, 5),
        obtenerClasesMasCompradasRequest(5) 
      ]);
      return {
        estadisticas: dataEstadisticas,
        clientesRecientes: respuestaClientes.data || [], 
        topClases: dataTopClases || []
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false, 
  }); 
  const toggleDestacadaMutation = useMutation({
    mutationFn: async ({ id, destacada }: { id: string, destacada: boolean }) => {
      const formData = new FormData();
      formData.append('destacada', String(destacada));
      return actualizarCategoriaRequest(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
      toast.success('Estado de clase actualizado');
    },
    onError: () => {
      toast.error('No se pudo actualizar el estado');
    }
  });

  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#d7f250]" />
        <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Cargando centro de mando...</p>
      </div>
    );
  }

  if (isError || !data?.estadisticas) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center text-red-500">
        <p className="font-bold uppercase tracking-widest">Error al cargar el dashboard</p>
        <p className="text-sm mt-2 text-gray-500">Por favor, recarga la página o intenta más tarde.</p>
      </div>
    );
  }

  const { estadisticas, clientesRecientes, topClases } = data;

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
        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-[#d7f250]/30 transition-colors shadow-lg">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Users size={80} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#d7f250]/10 flex items-center justify-center text-[#d7f250] mb-4 border border-[#d7f250]/20">
            <Users size={24} />
          </div>
          <p className="text-4xl font-black text-white">{estadisticas.totalUsuarios}</p>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2">Alumnos Registrados</p>
        </div>

        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors shadow-lg">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Video size={80} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 border border-purple-500/20">
            <Video size={24} />
          </div>
          <p className="text-4xl font-black text-white">{estadisticas.clasesVendidas}</p>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2">Clases Vendidas</p>
        </div>

        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors shadow-lg">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
            <DollarSign size={24} />
          </div>
          <p className="text-3xl font-black text-white">$ {estadisticas.ingresosArs.toLocaleString('es-AR')}</p>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2">Ingresos (ARS)</p>
        </div>

        <div className="bg-[#131313] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors shadow-lg">
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

      {/* 2. ACCESOS DIRECTOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <button onClick={() => navigate('/admin/videos/nuevo')} className="flex items-center gap-4 p-4 bg-[#131313] border border-gray-800 hover:border-[#d7f250] rounded-2xl transition-all group shadow-md hover:shadow-[#d7f250]/10">
          <div className="bg-white/5 p-3 rounded-xl group-hover:bg-[#d7f250] group-hover:text-black transition-colors">
            <PlusCircle size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold text-white uppercase tracking-wider text-sm">Subir Nueva Clase</p>
            <p className="text-xs text-gray-500">Agrega contenido a la librería</p>
          </div>
        </button>

        <button onClick={() => navigate('/admin/categorias')} className="flex items-center gap-4 p-4 bg-[#131313] border border-gray-800 hover:border-[#d7f250] rounded-2xl transition-all group shadow-md hover:shadow-[#d7f250]/10">
          <div className="bg-white/5 p-3 rounded-xl group-hover:bg-[#d7f250] group-hover:text-black transition-colors">
            <LayoutGrid size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold text-white uppercase tracking-wider text-sm">Gestionar Categorías</p>
            <p className="text-xs text-gray-500">Organiza tus disciplinas</p>
          </div>
        </button>

        <button onClick={() => navigate('/admin/clientes')} className="flex items-center gap-4 p-4 bg-[#131313] border border-gray-800 hover:border-[#d7f250] rounded-2xl transition-all group shadow-md hover:shadow-[#d7f250]/10">
          <div className="bg-white/5 p-3 rounded-xl group-hover:bg-[#d7f250] group-hover:text-black transition-colors">
            <Search size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold text-white uppercase tracking-wider text-sm">Buscar Alumna</p>
            <p className="text-xs text-gray-500">Ver historial de compras</p>
          </div>
        </button>
      </div>

      {/* 3. SECCIÓN FINANCIERA Y GRÁFICOS */}
      <div className="bg-[#131313] border border-gray-800 rounded-3xl p-6 shadow-2xl mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <BarChart className="text-[#d7f250] w-6 h-6" />
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Desempeño Financiero</h2>
          </div>
          
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
              Ingresos del período seleccionado
            </p>
            
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d7f250] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <p className="text-sm text-gray-500 font-bold mb-1">Pesos Argentinos (ARS)</p>
              <p className="text-4xl font-black text-white">
                ${estadisticas.resumenPeriodos[periodoActivo].ars.toLocaleString('es-AR')}
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-inner">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <p className="text-sm text-gray-500 font-bold mb-1">Dólares (USD)</p>
              <p className="text-4xl font-black text-[#d7f250]">
                U$D {estadisticas.resumenPeriodos[periodoActivo].usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

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

      {/* 👇 4. GRILLA INFERIOR (DOS COLUMNAS) 👇 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
        
        {/* COLUMNA IZQUIERDA: CLIENTES RECIENTES */}
        <div className="bg-[#131313] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Actividad Reciente</h2>
              <p className="text-sm text-gray-500">Últimas alumnas en comprar.</p>
            </div>
            <button onClick={() => navigate('/admin/clientes')} className="flex items-center gap-2 text-sm font-bold text-[#d7f250] hover:text-white transition-colors">
              Ver Todas <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-500 uppercase tracking-widest bg-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold">Alumna</th>
                  <th className="px-6 py-4 font-bold">Inversión</th>
                </tr>
              </thead>
              <tbody>
                {clientesRecientes.length > 0 ? (
                  clientesRecientes.map((cliente) => (
                    <tr key={cliente.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{cliente.nombreCompleto}</p>
                        <p className="text-xs truncate max-w-[150px]">{cliente.correo}</p>
                      </td>
                      <td className="px-6 py-4">
                        {cliente.totalInvertidoUsd > 0 && <span className="block text-[#d7f250] font-bold">U$D {cliente.totalInvertidoUsd}</span>}
                        {cliente.totalInvertidoArs > 0 && <span className="block text-white font-bold">$ {cliente.totalInvertidoArs}</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-10 text-center">No hay compras registradas aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUMNA DERECHA: CLASES MÁS VENDIDAS */}
        <div className="bg-[#131313] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Star className="text-[#d7f250] w-5 h-5" /> Top Clases
              </h2>
              <p className="text-sm text-gray-500">Tus disciplinas más compradas.</p>
            </div>
            <button onClick={() => navigate('/admin/categorias')} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
              Gestionar <ArrowRight size={16} />
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            {topClases.length > 0 ? (
              topClases.map((clase: any) => (
                <div key={clase.id} className="flex items-center justify-between p-4 border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Miniatura */}
                    <div className="w-16 h-12 rounded-lg bg-gray-900 overflow-hidden flex items-center justify-center shrink-0 border border-gray-800">
                      {clase.imagenTarjeta ? (
                        <img src={clase.imagenTarjeta} alt={clase.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={20} className="text-gray-600" />
                      )}
                    </div>
                    {/* Info */}
                    <div>
                      <p className="text-white font-bold text-sm line-clamp-1">{clase.titulo}</p>
                      <p className="text-xs text-gray-500 font-medium">{clase.totalCompras} ventas realizadas</p>
                    </div>
                  </div>

                  {/* Controles */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      {clase.ingresosArs > 0 && <p className="text-white font-bold text-sm">${clase.ingresosArs.toLocaleString('es-AR')}</p>}
                      {clase.ingresosUsd > 0 && <p className="text-[#d7f250] font-bold text-sm">U$D {clase.ingresosUsd.toLocaleString('en-US')}</p>}
                    </div>
                    
                    {/* El Switch mágico */}
                    <div className="pl-4 border-l border-gray-800 flex flex-col items-center gap-1">
                      <ToggleDestacada 
                        habilitado={clase.destacada} 
                        deshabilitado={toggleDestacadaMutation.isPending}
                        onChange={(val) => toggleDestacadaMutation.mutate({ id: clase.id, destacada: val })} 
                      />
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        {clase.destacada ? 'Visible' : 'Oculta'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-500 flex-1 flex flex-col justify-center">
                Aún no hay datos suficientes para calcular las clases más vendidas.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};