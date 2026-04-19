import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, LayoutDashboard, Video, LogOut, ChartNoAxesCombined } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { logoutRequest } from '../../api/auth';

const MotionLink = motion(Link);

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
    { name: 'Dashboard', path: '/admin', icon: ChartNoAxesCombined },
    { name: 'Clientes', path: '/admin/clientes', icon: Users },
    { name: 'Categorías', path: '/admin/categorias', icon: LayoutDashboard },
    { name: 'Videos', path: '/admin/videos', icon: Video },
  ];

  return (
    <aside className="hidden md:flex fixed left-4 top-4 bottom-4 z-50 bg-[#111111] rounded-2xl border border-gray-800/80 shadow-2xl w-24 flex-col items-center py-6">
      
      {/* Logo */}
      <div className="flex items-center justify-center mb-8 shrink-0">
        <Link to="/" className="flex items-center justify-center w-12 h-12 rounded-xl bg-black border border-gray-800 hover:border-[#C6FF33] transition-colors duration-300">
          <Home/>
        </Link>
      </div>

      {/* Navegación */}
      <nav className="flex-1 flex flex-col gap-3 w-full items-center">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return <SidebarItem key={item.name} item={item} isActive={isActive} />;
        })}
      </nav>

      {/* Perfil y Logout */}
      <div className="flex flex-col items-center gap-3 mt-auto shrink-0 w-full">
        <SidebarProfile usuario={usuario} />
        <SidebarLogout onLogout={handleLogout} />
      </div>
    </aside>
  );
};

// --- SUBCOMPONENTES ---

const SidebarItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <div 
      className="relative w-12 h-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MotionLink
        to={item.path}
        layout
        initial={{ width: 48, borderRadius: 24 }}
        animate={{ 
          width: isHovered ? "auto" : 48,
          // 👇 LA MAGIA NEÓN: Si hay hover es Lime sólido. Si está activo (sin hover) es oscuro con borde.
          backgroundColor: isHovered ? "#C6FF33" : (isActive ? "#1a1a1a" : "transparent"),
          borderColor: isHovered ? "#C6FF33" : (isActive ? "rgba(198, 255, 51, 0.4)" : "transparent"),
          boxShadow: isHovered ? "0px 0px 20px rgba(198, 255, 51, 0.5)" : (isActive ? "0px 0px 10px rgba(198, 255, 51, 0.1)" : "none")
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute left-0 top-0 flex items-center h-12 overflow-hidden z-20 border"
        style={{ zIndex: isHovered ? 50 : 20 }}
      >
        <div className="w-12 h-12 shrink-0 flex items-center justify-center transition-colors duration-200">
          {/* 👇 El icono pasa a Negro absoluto al hacer hover */}
          <Icon size={24} strokeWidth={isActive || isHovered ? 2.5 : 2} className={isHovered ? 'text-black' : (isActive ? 'text-[#C6FF33]' : 'text-gray-400')} />
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
              transition={{ delay: 0.05 }}
              // 👇 El texto es Negro absoluto y más grueso (font-black) para destacar sobre el neón
              className="font-principal font-black tracking-widest uppercase text-xs whitespace-nowrap pr-6 text-black"
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
      </MotionLink>
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
        className="absolute left-0 top-0 flex items-center h-12 rounded-full overflow-hidden bg-[#7D39EB] shadow-[0_0_15px_rgba(125,57,235,0.4)] border border-[#7D39EB]/50 cursor-default"
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
              className="flex flex-col justify-center whitespace-nowrap pr-6"
            >
              <span className="text-white text-sm font-bold leading-tight truncate">{usuario?.nombre}</span>
              <span className="text-[#C6FF33] text-[10px] font-bold uppercase tracking-wider leading-tight truncate">{usuario?.correo}</span>
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
          backgroundColor: isHovered ? "#ef4444" : "transparent",
          borderColor: isHovered ? "#ef4444" : "transparent",
          boxShadow: isHovered ? "0px 0px 15px rgba(239, 68, 68, 0.4)" : "none"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute left-0 top-0 flex items-center h-12 rounded-full overflow-hidden border text-red-500 hover:text-white"
        style={{ zIndex: isHovered ? 50 : 20 }}
      >
        <div className="w-12 h-12 shrink-0 flex items-center justify-center transition-colors duration-200">
          <LogOut size={22} strokeWidth={2.5} className={isHovered ? 'text-white' : 'text-red-500'} />
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
              className="font-principal font-black tracking-widest uppercase text-xs whitespace-nowrap pr-6 text-white"
            >
              Salir
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};