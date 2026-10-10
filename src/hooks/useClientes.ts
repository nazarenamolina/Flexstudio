import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { obtenerHistorialClientes, obtenerComprobantesCliente, type ComprobanteData, type OrdenClientes, type RespuestaPaginadaClientes } from '../api/admin';
import toast from 'react-hot-toast';

export type SortField = OrdenClientes;

// Espera desde la última tecla antes de buscar en el back (un pedido por búsqueda, no por letra).
const ESPERA_BUSQUEDA_MS = 350;
export type SortDir = 'asc' | 'desc';

export const useClientes = () => {
  const queryClient = useQueryClient();
  const [busqueda, setBusquedaTexto] = useState('');
  const [busquedaAplicada, setBusquedaAplicada] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comprobantes, setComprobantes] = useState<Record<string, ComprobanteData[]>>({});
  const [cargandoComprobantes, setCargandoComprobantes] = useState<Record<string, boolean>>({});
  const [pagina, setPagina] = useState(1);
  const limit = 5;

  useEffect(() => {
    const espera = setTimeout(() => setBusquedaAplicada(busqueda.trim()), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(espera);
  }, [busqueda]);

  // Cambiar la búsqueda o el orden vuelve a la primera página (la actual puede no existir).
  const setBusqueda = (texto: string) => {
    setBusquedaTexto(texto);
    setPagina(1);
  };

  const { data: respuestaPagina, isLoading: cargando, isPlaceholderData, isError, refetch, isFetching } = useQuery<RespuestaPaginadaClientes>({
    queryKey: ['historial-clientes', pagina, busquedaAplicada, sortField, sortDir],
    queryFn: () => obtenerHistorialClientes(pagina, limit, {
      busqueda: busquedaAplicada,
      orden: sortField ?? undefined,
      direccion: sortField ? sortDir : undefined,
    }),
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
      } catch {
        toast.error('Error al cargar los comprobantes');
      } finally {
        setCargandoComprobantes(prev => ({ ...prev, [idUsuario]: false }));
      }
    }
  };

  // La página ya viene filtrada y ordenada por el back.
  const clientesFiltrados = clientes;
  const totalClientes = respuestaPagina?.meta.totalItems ?? 0;
  const buscando = busqueda.trim() !== busquedaAplicada || (isPlaceholderData && busquedaAplicada !== '');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      // Montos, cantidades y fechas: primero los más altos o recientes.
      setSortDir(field === 'nombreCompleto' || field === 'pais' ? 'asc' : 'desc');
    }
    setPagina(1);
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
    isError,
    refetch,
    isFetching,
    totalClientes,
    buscando,
    busquedaAplicada,
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