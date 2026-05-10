import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, LayoutDashboard, Video, LogOut, ChartNoAxesCombined } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { logoutRequest } from '../../api/auth';

 

export const Sidebar = () => {
  const { usuario, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

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

  const menuItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Dashboard', path: '/admin', icon: ChartNoAxesCombined },
    { name: 'Clientes', path: '/admin/clientes', icon: Users },
    { name: 'Categorías', path: '/admin/categorias', icon: LayoutDashboard },
    { name: 'Videos', path: '/admin/videos', icon: Video },
  ];

  return (
    <aside className="hidden md:flex fixed left-4 top-4 bottom-4 z-50 bg-[#1a1a1a] rounded-2xl shadow-2xl w-24 flex-col items-center py-6">

      <nav className="flex-1 flex flex-col gap-3 w-full items-center">
        {menuItems.map((item) => {
          const isActive = (item.path === '/' || item.path === '/admin') 
            ? location.pathname === item.path 
            : location.pathname.startsWith(item.path);
          return <SidebarItem key={item.name} item={item} isActive={isActive} />;
        })}
      </nav>

      <div className="flex flex-col items-center gap-3 mt-auto shrink-0 w-full">
        <SidebarProfile usuario={usuario} />
        <SidebarLogout onLogout={handleLogout} />
      </div>
    </aside>
  );
};

const SidebarItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <div 
      className="relative w-12 h-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Usamos motion.div nativo para que la física del resorte funcione perfecto */}
      <motion.div
        layout
        animate={{ 
          width: isHovered ? "auto" : 48,
          backgroundColor: isHovered ? "#d7f250" : (isActive ? "#d7f250" : "transparent"),
          borderColor: isHovered ? "#d7f250" : (isActive ? "rgba(215, 242, 80, 0.4)" : "transparent"),
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute left-0 top-0 h-12 rounded-full overflow-hidden z-20 border"
        style={{ zIndex: isHovered ? 50 : 20 }}
      >
        {/* El Link normal va por dentro ocupando el 100% del espacio */}
        <Link to={item.path} className="flex items-center w-full h-full">
          
          <div className="w-12 h-12 shrink-0 flex items-center justify-center transition-colors duration-200">
            <Icon 
              size={24} 
              strokeWidth={isActive || isHovered ? 2.5 : 2} 
              className={isHovered ? 'text-black' : (isActive ? 'text-[#131313]' : 'text-neutral-600')} 
            />
          </div>
          
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
                className="font-principal font-black tracking-widest uppercase text-xs whitespace-nowrap pr-6 text-black"
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>

        </Link>
      </motion.div>
    </div>
  );
};

const SidebarProfile = ({ usuario }: { usuario: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-12 h-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        layout
        animate={{ width: isHovered ? "auto" : 48 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute left-0 top-0 flex items-center h-12 rounded-full overflow-hidden bg-[#7D39EB] border border-[#7D39EB]/50 cursor-pointer"
        style={{ zIndex: isHovered ? 50 : 20 }}
      >
        <div className="w-12 h-12 shrink-0 flex items-center justify-center text-white font-black text-xl leading-none pt-0.5">
          {usuario?.nombre?.charAt(0).toUpperCase() || 'A'}
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
              className="flex flex-col justify-center whitespace-nowrap pr-8"
            >
              <span className="text-white text-sm font-bold leading-tight">{usuario?.nombre}</span>
              <span className="text-[#d7f250] text-[10px] font-bold pt-1 uppercase tracking-wider leading-tight">{usuario?.correo}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const SidebarLogout = ({ onLogout }: { onLogout: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-12 h-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        onClick={onLogout}
        layout
        animate={{ 
          width: isHovered ? "auto" : 48,
          backgroundColor: isHovered ? "#9a0002" : "transparent",
          borderColor: isHovered ? "#9a0002" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute left-0 top-0 flex items-center h-12 rounded-full overflow-hidden border text-[#9a0002] hover:text-white cursor-pointer"
        style={{ zIndex: isHovered ? 50 : 20 }}
      >
        <div className="w-12 h-12 shrink-0 flex items-center justify-center transition-colors duration-200">
          <LogOut size={22} strokeWidth={2.5} className={isHovered ? 'text-white' : 'text-[#d21a1e]'} />
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
              className="font-principal font-black tracking-widest uppercase text-xs whitespace-nowrap pr-6 text-white"
            >
              Cerrar Sesión
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};