import { useMisClases } from '../hooks/useMisClases';
import { ClaseCard } from '../components/ClaseCard';
import { Link } from 'react-router-dom';

export const MisClasesPage = () => {
  const { clases, cargando, error } = useMisClases();

  // Estado 1: Cargando (Puedes cambiar esto por un Skeleton más adelante)
  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // Estado 2: Error de red o servidor
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <div className="rounded-xl bg-red-50 p-8 text-red-600">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  // Estado 3: Renderizado exitoso
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Cabecera */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Mis Clases
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Tu acceso vitalicio al programa Elite de Flex Studio.
          </p>
        </div>

        {/* Grilla de Clases */}
        {clases.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
            {clases.map((clase) => (
              <ClaseCard key={clase.id} clase={clase} />
            ))}
          </div>
        ) : (
          /* Estado 4: Aún no ha comprado nada */
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Aún no tienes clases disponibles</h2>
            <p className="mb-6 text-gray-500">Explora nuestro catálogo y comienza tu entrenamiento.</p>
            <Link 
              to="/cursos" // Ajusta a la ruta donde vendes tus clases
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Ir a la Tienda
            </Link>
          </div>
        )}

      </div>
    </main>
  );
};