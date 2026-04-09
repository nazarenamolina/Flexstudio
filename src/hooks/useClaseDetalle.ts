import { useState, useEffect } from 'react';
import { obtenerDetalleClase } from '../api/compras';

export const useClaseDetalle = (id: string | undefined) => {
  const [clase, setClase] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchClase = async () => {
      try {
        const data = await obtenerDetalleClase(id);
        setClase(data);
      } catch (err) {
        setError('No pudimos cargar esta clase.');
      } finally {
        setCargando(false);
      }
    };
    fetchClase();
  }, [id]);

  return { clase, cargando, error };
};