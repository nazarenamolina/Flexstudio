import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { logoutRequest } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useSubidasStore, hayCargasActivas } from '../store/subidasStore';

/**
 * Cierre de sesión del panel (barra lateral y menú del celular). La sesión local se cierra siempre,
 * aunque el back no responda: antes, con la sesión ya vencida, el pedido fallaba, aparecía "Error al
 * cerrar sesión" y el admin quedaba adentro.
 */
export const useCerrarSesionAdmin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return async () => {
    // Se leen al hacer clic: suscribirse re-renderizaría todo el layout del admin con cada avance de una subida.
    const { subidas, quitar: quitarSubida } = useSubidasStore.getState();
    if (hayCargasActivas(subidas) && !window.confirm('Hay videos subiéndose. Si cerrás sesión se cancelan. ¿Cerrar sesión igual?')) {
      return;
    }
    subidas.forEach((s) => quitarSubida(s.id));
    try {
      await logoutRequest();
    } catch {
      // La cookie ya no era válida o el back no respondió: igual se cierra la sesión acá.
    } finally {
      logout();
      // Clientes, comprobantes y estadísticas no quedan en memoria para la próxima sesión.
      queryClient.clear();
      toast.success('Sesión cerrada');
      navigate('/login');
    }
  };
};
