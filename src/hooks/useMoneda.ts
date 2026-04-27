import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';

export const useMoneda = () => {
  const { usuario } = useAuthStore();
  const [moneda, setMoneda] = useState<'ARS' | 'USD'>('USD');
  const [cargandoMoneda, setCargandoMoneda] = useState(true);
  const paisDetectadoRef = useRef<boolean>(false);

  useEffect(() => {
    if (usuario && usuario.pais) {
      const esArgentina = usuario.pais.toLowerCase() === 'argentina' || usuario.pais.toLowerCase() === 'ar';
      setMoneda(esArgentina ? 'ARS' : 'USD');
      setCargandoMoneda(false);
      paisDetectadoRef.current = true;
      return;
    }

    if (paisDetectadoRef.current) return;

    const detectarPaisPorIP = async () => {
      try {
        const respuesta = await fetch('https://get.geojs.io/v1/ip/country.json');
        const data = await respuesta.json();
        if (data.country === 'AR') {
          setMoneda('ARS');
        } else {
          setMoneda('USD');
        }
        paisDetectadoRef.current = true;
      } catch (error) {
        console.error('Error detectando país:', error);
        setMoneda('USD');
        paisDetectadoRef.current = true;
      } finally {
        setCargandoMoneda(false);
      }
    };
    detectarPaisPorIP();
  }, [usuario]);

  return { moneda, cargandoMoneda };
};