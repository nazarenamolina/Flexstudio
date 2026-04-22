import { useEffect, useState, useMemo } from 'react';
import { obtenerHistorialClientes, obtenerComprobantesCliente, type ResumenCliente, type ComprobanteData } from '../api/admin';  
import toast from 'react-hot-toast';

export type SortField = 'nombreCompleto' | 'pais' | 'totalClasesCompradas' | 'totalInvertidoArs' | 'totalInvertidoUsd' | 'fechaUltimaCompra';
export type SortDir = 'asc' | 'desc';

export const useClientes = () => {
  const [clientes, setClientes] = useState<ResumenCliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comprobantes, setComprobantes] = useState<Record<string, ComprobanteData[]>>({});
  const [cargandoComprobantes, setCargandoComprobantes] = useState<Record<string, boolean>>({});

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

  const handleExpand = async (idUsuario: string) => {
    if (expandedId === idUsuario) {
      setExpandedId(null); 
      return;
    }
    
    setExpandedId(idUsuario);
    if (!comprobantes[idUsuario]) {
      setCargandoComprobantes(prev => ({ ...prev, [idUsuario]: true }));
      try {
        const data = await obtenerComprobantesCliente(idUsuario);
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

  return {clientesFiltrados, cargando, busqueda, setBusqueda, sortField, sortDir, handleSort, expandedId, handleExpand, comprobantes, cargandoComprobantes,formatearFecha, formatearFechaRegistro, formatCurrency,};
};