import { Navigate } from 'react-router-dom';
import CarritoMP from './carrito/CarritoMP';
import { useAuthStore } from '../store/authStore'; 

const CarritoPage = () => {
  const usuario = useAuthStore((state) => state.usuario);
  if (!usuario) {
    return <Navigate to="/login" />;
  }
  return <CarritoMP />;
};

export default CarritoPage;