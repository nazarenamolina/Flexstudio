import { Navigate } from 'react-router-dom';
import CarritoMP from './CarritoMP';
import CarritoPP from './CarritoPP';
import { useAuthStore } from '../store/authStore'; 

const CarritoPage = () => {
  const usuario = useAuthStore((state) => state.usuario);
  if (!usuario) {
    return <Navigate to="/login" />;
  }
  const esArgentina = 
    usuario.pais?.toLowerCase() === 'argentina' || 
    usuario.pais?.toLowerCase() === 'ar';
  if (esArgentina) {
    return <CarritoMP />;
  } else {
    return <CarritoPP />;
  }
};

export default CarritoPage;