import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  eliminarCategoriaRequest,
  obtenerCategoriasEliminadasRequest,
  restaurarCategoriaRequest,
  type Categoria,
} from '../api/categoria';
import { mensajeDeError } from '../api/errores';
import { useCategoriasPublicas } from './useCategoriasPublicas';

export const useCategorias = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Misma consulta que la home y el carrito: un cambio en el admin se ve en todo el sitio.
  // isLoadingError: solo si nunca cargó. Si falla una actualización, se sigue mostrando la lista que ya había.
  const { data: categorias = [], isLoading, isLoadingError: isError, refetch, isFetching } = useCategoriasPublicas();

  const eliminarMutation = useMutation({
    mutationFn: eliminarCategoriaRequest,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['categorias'] });
      const previous = queryClient.getQueryData<Categoria[]>(['categorias']);
      queryClient.setQueryData<Categoria[]>(['categorias'], (old = []) => old.filter((c) => c.id !== id));
      return { previous };
    },
    onSuccess: () => {
      toast.success('Clase dada de baja. Podés restaurarla desde "Dadas de baja".');
    },
    onError: (error, _id, context) => {
      queryClient.setQueryData(['categorias'], context?.previous);
      toast.error(mensajeDeError(error, 'No se pudo dar de baja la clase.'));
    },
    onSettled: (_datos, _error, id) => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['categorias-eliminadas'] });
      queryClient.invalidateQueries({ queryKey: ['categoria', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
    },
  });

  // Clases dadas de baja: el back las conserva (soft delete) para que se puedan restaurar.
  const { data: categoriasEliminadas = [] } = useQuery<Categoria[]>({
    queryKey: ['categorias-eliminadas'],
    queryFn: obtenerCategoriasEliminadasRequest,
  });

  const restaurarMutation = useMutation({
    mutationFn: restaurarCategoriaRequest,
    onSuccess: (_datos, id) => {
      toast.success('Clase restaurada: vuelve a estar en el catálogo');
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['categorias-eliminadas'] });
      queryClient.invalidateQueries({ queryKey: ['categoria', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
    },
    onError: (error) => {
      toast.error(mensajeDeError(error, 'No se pudo restaurar la clase.'));
    },
  });

  return {
    categorias,
    isLoading,
    isError,
    isFetching,
    refetch,
    estaEliminando: eliminarMutation.isPending,
    categoriasEliminadas,
    handleRestaurar: (id: string) => restaurarMutation.mutate(id),
    estaRestaurando: restaurarMutation.isPending,
    handleEliminar: (id: string) => eliminarMutation.mutate(id),
    navigateANueva: () => navigate('/admin/categorias/nueva'),
    navigateAEditar: (id: string) => navigate(`/admin/categorias/editar/${id}`),
  };
};
