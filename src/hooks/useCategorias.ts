import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  obtenerCategoriasRequest,
  eliminarCategoriaRequest,
  type Categoria,
} from '../api/categoria';

interface CategoriaConVideos extends Categoria {
  videos?: any[];
}

export const useCategorias = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: categorias = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<CategoriaConVideos[]>({
    queryKey: ['categorias'],
    queryFn: async () => {
      const data = await obtenerCategoriasRequest();
      if (Array.isArray(data)) return data;
      if (data && Array.isArray((data as any).categorias)) return (data as any).categorias;
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const eliminarMutation = useMutation({
    mutationFn: eliminarCategoriaRequest,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['categorias'] });
      const previous = queryClient.getQueryData(['categorias']);
      queryClient.setQueryData(['categorias'], (old: CategoriaConVideos[] = []) =>
        old.filter((c) => c.id !== id)
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Categoría eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(['categorias'], context?.previous);
      toast.error('Ocurrió un error al eliminar la categoría');
    },
  });

  const abrirModalEliminacion = (id: string, titulo: string) => {
    return { id, titulo };
  };

  const handleEliminar = (id: string) => {
    eliminarMutation.mutate(id);
  };

  const navigateANueva = () => {
    navigate('/admin/categorias/nueva');
  };

  const navigateAEditar = (id: string) => {
    navigate(`/admin/categorias/editar/${id}`);
  };

  return {
    categorias,
    isLoading,
    isError,
    refetch,
    estaEliminando: eliminarMutation.isPending,
    abrirModalEliminacion,
    handleEliminar,
    navigateANueva,
    navigateAEditar,
  };
};
