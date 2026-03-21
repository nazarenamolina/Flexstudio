import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Tags, Video, LogOut, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuthStore } from '../../store/authStore';
import { logoutRequest } from '../../api/auth';

export const AdminLayout = () => {
  const { isAuthenticated, usuario, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. LÓGICA DE CERRAR SESIÓN
  const handleLogout = async () => {
    try {
      await logoutRequest(); 
      logout(); 
      toast.success('Sesión cerrada');
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  // 3. MENÚ DE NAVEGACIÓN
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
/*     { name: 'Disciplinas', path: '/admin/categorias', icon: Tags }, */
    { name: 'Clientes', path: '#', icon: Tags },
    { name: 'categorias', path: '#', icon: Tags },
    { name: 'videos', path: '#', icon: Video },
/*     { name: 'Videos Mux', path: '/admin/videos', icon: Video },
    { name: 'Configuración', path: '/admin/configuracion', icon: Settings }, */
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white font-sans">
      
      {/* === SIDEBAR (Barra Lateral Izquierda) === */}
      <aside className="w-64 bg-bg-card border-r border-gray-800 hidden md:flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <h2 className="text-2xl font-black tracking-tighter">
            FLEX <span className="text-[#d7f250]">STUDIO</span>
          </h2>
        </div>

        {/* Links de Navegación */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Verificamos si la ruta actual coincide con el link para pintarlo de verde lima
            const isActive = location.pathname === item.path || 
                            (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#d7f250]/10 text-[#d7f250] border border-[#d7f250]/20' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-[#d7f250]' : 'text-gray-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Perfil Inferior en el Sidebar */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-[#d7f250] flex items-center justify-center text-bg-card font-bold text-lg">
              {usuario?.nombre?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{usuario?.nombre} {usuario?.apellido}</p>
              <p className="text-xs text-gray-400 truncate">{usuario?.correo}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-sm font-bold"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* === ÁREA PRINCIPAL (Derecha) === */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Cabecera Móvil (Solo se ve en pantallas pequeñas) */}
        <header className="h-16 bg-bg-card border-b border-gray-800 flex md:hidden items-center justify-between px-4">
          <h2 className="text-xl font-black">
            FLEX <span className="text-[#d7f250]">STUDIO</span>
          </h2>
          <button className="text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
        </header>

        {/* CONTENIDO DINÁMICO: Aquí se inyectan las páginas (Dashboard, Categorias, etc) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet /> {/* 👈 ¡LA MAGIA DE REACT ROUTER ESTÁ AQUÍ! */}
        </div>
      </main>

    </div>
  );
};