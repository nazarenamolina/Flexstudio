import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { obtenerHistorialClientes, obtenerComprobantesCliente, type ResumenCliente, type ComprobanteData } from '../api/admin';  
import toast from 'react-hot-toast';

export type SortField = 'nombreCompleto' | 'pais' | 'totalClasesCompradas' | 'totalInvertidoArs' | 'totalInvertidoUsd' | 'fechaUltimaCompra';
export type SortDir = 'asc' | 'desc';

export const useClientes = () => {
  const queryClient = useQueryClient();

  // Estados locales para la interfaz (filtros, orden, expansión)
  const [busqueda, setBusqueda] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Diccionarios locales para los comprobantes (mantiene compatibilidad con el componente)
  const [comprobantes, setComprobantes] = useState<Record<string, ComprobanteData[]>>({});
  const [cargandoComprobantes, setCargandoComprobantes] = useState<Record<string, boolean>>({});

  // 👇 1. MAGIA DE TANSTACK QUERY: Obtenemos el listado principal
  const { data: clientes = [], isLoading: cargando } = useQuery<ResumenCliente[]>({
    queryKey: ['historial-clientes'],
    queryFn: obtenerHistorialClientes,
    staleTime: 1000 * 60 * 5, // Guarda los clientes en caché por 5 minutos
  });

  // 👇 2. EXPANSIÓN CON CACHÉ: Cargamos comprobantes individualmente
  const handleExpand = async (idUsuario: string) => {
    // Si ya está abierto, lo cerramos
    if (expandedId === idUsuario) {
      setExpandedId(null); 
      return;
    }
    
    setExpandedId(idUsuario);

    // Si no tenemos los comprobantes en el diccionario local, los pedimos
    if (!comprobantes[idUsuario]) {
      setCargandoComprobantes(prev => ({ ...prev, [idUsuario]: true }));
      try {
        // Usamos fetchQuery para que TanStack también guarde estos recibos en caché
        const data = await queryClient.fetchQuery({
          queryKey: ['comprobantes-cliente', idUsuario],
          queryFn: () => obtenerComprobantesCliente(idUsuario),
          staleTime: 1000 * 60 * 15, // 15 minutos de caché para recibos (rara vez cambian)
        });
        
        setComprobantes(prev => ({ ...prev, [idUsuario]: data }));
      } catch (error) {
        toast.error('Error al cargar los comprobantes');
      } finally {
        setCargandoComprobantes(prev => ({ ...prev, [idUsuario]: false }));
      }
    }
  };

  // 👇 3. FILTROS Y ORDENAMIENTO (Memoizados para rendimiento)
  const clientesFiltrados = useMemo(() => {
    let filtered = clientes.filter(c =>
      c.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.correo && c.correo.toLowerCase().includes(busqueda.toLowerCase()))
    );

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField] ?? '';
        const bVal = b[sortField] ?? '';
        const cmp = String(aVal).localeCompare(String(bVal), 'es', { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return filtered;
  }, [clientes, busqueda, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // 👇 4. FUNCIONES UTILITARIAS DE FORMATEO
  const formatearFecha = (fechaISO: string | null | undefined) => {
    if (!fechaISO) return 'Sin compras';
    return new Date(fechaISO).toLocaleDateString('es-AR', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatearFechaRegistro = (fechaISO: string | null | undefined) => {
    if (!fechaISO) return 'Dato no disponible';
    return new Date(fechaISO).toLocaleDateString('es-AR', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatCurrency = (value: number, isUsd = false) => {
    if (isUsd) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    }
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value);
  };

  return {
    clientesFiltrados, 
    cargando, 
    busqueda, 
    setBusqueda, 
    sortField, 
    sortDir, 
    handleSort, 
    expandedId, 
    handleExpand, 
    comprobantes, 
    cargandoComprobantes,
    formatearFecha, 
    formatearFechaRegistro, 
    formatCurrency
  };
};