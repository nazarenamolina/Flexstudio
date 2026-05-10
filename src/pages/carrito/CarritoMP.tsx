// src/pages/carrito/CarritoMP.tsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { obtenerMiPerfilRequest, type CheckoutPerfilData } from '../../api/usuario';
import Stepper from './components/Stepper';
import Paso1Carrito from './components/Paso1Carrito';
import Paso2Formulario from './components/Paso2Formulario';
import Paso3Resumen from './components/Paso3Resumen';

 
const CarritoMP = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const [pasoActual, setPasoActual] = useState(1);
  const [metodoPago, setMetodoPago] = useState('mercadopago');

  const [formData, setFormData] = useState<CheckoutPerfilData>({
    documentoIdentidad: '',
    telefono: '',
    direccion: '',
    provincia: '',
    ciudad: '',
    codigoPostal: ''
  });

  useEffect(() => {
    const fetchDatosExtra = async () => {
      try {
        const datosBD = await obtenerMiPerfilRequest();
        setFormData({
          documentoIdentidad: datosBD.documentoIdentidad || '',
          telefono: datosBD.telefono || '',
          direccion: datosBD.direccion || '',
          provincia: datosBD.provincia || '',
          ciudad: datosBD.ciudad || '',
          codigoPostal: datosBD.codigoPostal || '',
        });
      } catch (error) {
        console.warn("No se pudo precargar la info del perfil.");
      }
    };
    if (usuario) fetchDatosExtra();
  }, [usuario]);

  return (
    <section className="min-h-screen text-[#131313] pt-24 pb-12 px-4 md:px-6 font-sans">
      <Stepper pasoActual={pasoActual} />
      
      {pasoActual === 1 && (
        <Paso1Carrito onNext={() => setPasoActual(2)} />
      )}
      
      {pasoActual === 2 && (
        <Paso2Formulario 
          formData={formData} 
          usuario={usuario}
          onPrev={() => setPasoActual(1)}
          onNext={(datosValidados) => {
            setFormData(datosValidados); 
            setPasoActual(3); 
          }}
        />
      )}
      
      {pasoActual === 3 && (
        <Paso3Resumen 
          formData={formData}
          usuario={usuario}
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          onPrev={() => setPasoActual(2)}
        />
      )}
    </section>
  );
};

export default CarritoMP;