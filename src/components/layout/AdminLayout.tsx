import { Navigate, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Sidebar } from './Sidebar';  

export const AdminLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex relative">
      
      {/* Nuestro nuevo componente flotante */}
      <Sidebar />

      {/* === ÁREA PRINCIPAL === */}
      {/* Agregamos pl-4 en móvil y pl-28 en desktop (para no tapar la barra colapsada) */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full pl-0 md:pl-28">

        {/* Cabecera Móvil (Solo se ve en pantallas pequeñas) */}
        <header className="h-16 bg-[#131313] border-b border-gray-800 flex md:hidden items-center justify-between px-4">
          <h2 className="text-xl font-black">
            FLEX <span className="text-[#d7f250]">STUDIO</span>
          </h2>
          <button className="text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
        </header>

        {/* CONTENIDO DINÁMICO */}
        {/* Aquí va tu panel, con un padding generoso */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet /> 
        </div>
        
      </main>
    </div>
  );
};