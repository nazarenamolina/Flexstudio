
import { useState, useEffect } from 'react';
import { obtenerMisClasesCompradas, type ClaseComprada } from '../api/compras';
import { useAuthStore } from '../store/authStore';

export const useMisClases = () => {
  const [clases, setClases] = useState<ClaseComprada[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    let isMounted = true;  

    const cargarClases = async () => {
      if (!isAuthenticated) {
        setCargando(false);
        return;
      }
      
      try {
        setCargando(true);
        setError(null);
        const data = await obtenerMisClasesCompradas();
        
        if (isMounted) {
          setClases(data);
        }
      } catch (err: any) {
        console.error('Error al cargar mis clases:', err);
        if (isMounted) {
          setError('No pudimos cargar tus clases en este momento. Intenta recargar la página.');
        }
      } finally {
        if (isMounted) {
          setCargando(false);
        }
      }
    };

    cargarClases();

    return () => {
      isMounted = false;  
    };
  }, [isAuthenticated]); 

  return { clases, cargando, error };
};