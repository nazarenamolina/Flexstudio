import { useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, Menu, X, Users, LayoutDashboard, Video, LogOut, ChartNoAxesCombined } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutRequest } from '../../api/auth';
import toast from 'react-hot-toast';

export const AdminLayout = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Dashboard', path: '/admin', icon: ChartNoAxesCombined },
    { name: 'Clientes', path: '/admin/clientes', icon: Users },
    { name: 'Categorías', path: '/admin/categorias', icon: LayoutDashboard },
    { name: 'Videos', path: '/admin/videos', icon: Video },
  ];

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[url('https://res.cloudinary.com/dmp7mcwie/image/upload/v1776644116/bgoscuro_vxdjim.png')] text-white font-sans flex relative">
      <Sidebar />
      <main className="flex flex-col overflow-hidden w-full pl-0 md:pl-28 relative">

        <header className="h-16 bg-[#131313] border-b border-neutral-800 flex md:hidden items-center justify-between px-3 z-40">
          <Link to="/" className="flex-shrink-3">
            <img src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774490155/logofooter_u3j6cz.png" className="w-30 object-contain" alt="Logo" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={28} />
          </button>
        </header>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#131313] flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4">
                <Link to="/" className="flex-shrink-3">
                  <img src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774490155/logofooter_u3j6cz.png" className="w-30 object-contain" alt="Logo" />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-[#d7f250] transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 flex flex-col py-8 px-6 overflow-y-auto border-t border-neutral-800">
                {menuItems.map((item) => {
                  const isActive = (item.path === '/' || item.path === '/admin')
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);
                  return (
                    <MobileMenuItem
                      key={item.name}
                      item={item}
                      isActive={isActive}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  );
                })}

                <div className="mt-auto pt-5 border-t border-neutral-800">
                  <motion.div whileTap={{ scale: 0.92 }} className="w-full flex justify-center">
                    <button
                      onClick={handleLogout}
                      className="relative flex items-center justify-center gap-3 h-14 rounded-2xl overflow-hidden transition-all duration-300 w-full bg-red-500/10 border border-red-500/20 text-red-500"
                    >
                      <LogOut size={22} strokeWidth={2.5} />
                      <span className="font-principal font-black tracking-widest uppercase text-sm">
                        Cerrar Sesión
                      </span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>

      </main>
    </div>
  );
};


const MobileMenuItem = ({ item, isActive, onClick }: { item: any, isActive: boolean, onClick: () => void }) => {
  const Icon = item.icon;

  return (
    <motion.div
      whileTap={{ scale: 0.92 }}
      className="w-full flex justify-center mb-4"
    >
      <Link
        to={item.path}
        onClick={onClick}
        className={`relative flex items-center h-14 rounded-2xl overflow-hidden transition-all duration-300 ease-out ${isActive
          ? "bg-[#d7f250] border border-[#d7f250] w-full"
          : "bg-[#393838]/40 border border-neutral-700 w-full"
          }`}
      >
        <div className="w-14 h-14 shrink-0 flex items-center justify-center">
          <Icon
            size={22}
            strokeWidth={isActive ? 2.5 : 2}
            className={isActive ? 'text-black' : 'text-neutral-300'}
          />
        </div>

        <span
          className={`font-principal font-black tracking-widest uppercase text-xs whitespace-nowrap pr-6 transition-colors duration-300 ${isActive ? 'text-black' : 'text-neutral-300'}`}
        >
          {item.name}
        </span>
      </Link>
    </motion.div>
  );
};