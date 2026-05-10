import { useState, useMemo } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { obtenerHistorialClientes, obtenerComprobantesCliente, type ComprobanteData, type RespuestaPaginadaClientes } from '../api/admin';  
import toast from 'react-hot-toast';

export type SortField = 'nombreCompleto' | 'pais' | 'totalClasesCompradas' | 'totalInvertidoArs' | 'totalInvertidoUsd' | 'fechaUltimaCompra';
export type SortDir = 'asc' | 'desc';

export const useClientes = () => {
  const queryClient = useQueryClient();
  const [busqueda, setBusqueda] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comprobantes, setComprobantes] = useState<Record<string, ComprobanteData[]>>({});
  const [cargandoComprobantes, setCargandoComprobantes] = useState<Record<string, boolean>>({});
  const [pagina, setPagina] = useState(1);
  const limit = 5;

  const { data: respuestaPagina, isLoading: cargando, isPlaceholderData } = useQuery<RespuestaPaginadaClientes>({
    queryKey: ['historial-clientes', pagina],
    queryFn: () => obtenerHistorialClientes(pagina, limit),
    staleTime: 1000 * 60 * 5, 
    placeholderData: keepPreviousData, 
  });

  const clientes = respuestaPagina?.data || [];
  const meta = respuestaPagina?.meta || { totalPages: 1, currentPage: 1 };

  const handleExpand = async (idUsuario: string) => {
    if (expandedId === idUsuario) {
      setExpandedId(null); 
      return;
    }
    setExpandedId(idUsuario);
    if (!comprobantes[idUsuario]) {
      setCargandoComprobantes(prev => ({ ...prev, [idUsuario]: true }));
      try {
        const data = await queryClient.fetchQuery({
          queryKey: ['comprobantes-cliente', idUsuario],
          queryFn: () => obtenerComprobantesCliente(idUsuario),
          staleTime: 1000 * 60 * 15,
        });
        setComprobantes(prev => ({ ...prev, [idUsuario]: data }));
      } catch (error) {
        toast.error('Error al cargar los comprobantes');
      } finally {
        setCargandoComprobantes(prev => ({ ...prev, [idUsuario]: false }));
      }
    }
  };

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
    formatCurrency,
    paginaActual: meta.currentPage,
    totalPages: meta.totalPages,
    setPagina,
    isPlaceholderData
  };
};