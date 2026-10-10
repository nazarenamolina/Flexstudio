import { useEffect } from 'react';
import { obtenerMiPerfilRequest } from '../api/usuario';
import { useAuthStore } from '../store/authStore';

/**
 * La sesión del front (localStorage) puede sobrevivir a la cookie: vence a 1 día (30 con
 * "Mantenerme conectado") o el navegador la bloquea. Al abrir el sitio se confirma con el back:
 *  - si sigue vigente, se refrescan los datos guardados (nombre, rol y país pueden haber cambiado);
 *  - si no, el interceptor de axios cierra la sesión local (401) sin sacar al usuario de la página.
 */
export const ValidadorSesion = () => {
  const setUsuario = useAuthStore((state) => state.setUsuario);

  useEffect(() => {
    if (!useAuthStore.getState().isAuthenticated) return;
    obtenerMiPerfilRequest()
      .then((perfil) => {
        // Solo si la sesión sigue abierta (el usuario pudo cerrar sesión mientras tanto).
        if (!useAuthStore.getState().isAuthenticated) return;
        setUsuario({
          id: perfil.id,
          nombre: perfil.nombre,
          apellido: perfil.apellido,
          correo: perfil.correo,
          rol: perfil.rol,
          pais: perfil.pais ?? undefined,
        });
      })
      .catch(() => {
        // 401: ya lo resolvió el interceptor. Otros errores (red caída): se mantiene la sesión.
      });
  }, [setUsuario]);

  return null;
};
