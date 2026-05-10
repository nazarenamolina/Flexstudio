import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { ShoppingCart, CircleUser, LogOut, Menu, X, ChevronDown, UserPlus } from "lucide-react";
import { AvatarIniciales } from "./AvatarIniciales";
import { obtenerCategoriasRequest, type Categoria } from "../api/categoria";
import { logoutRequest } from "../api/auth";

export const HeaderComponent = () => {
  const { usuario, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.cartItems);
  const cantidadCarrito = cartItems.length;
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClasesOpen, setIsClasesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [categoriasMenu, setCategoriasMenu] = useState<Categoria[]>([]);
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const cargarMenuCategorias = async () => {
      try {
        const data = await obtenerCategoriasRequest();
        setCategoriasMenu(data);
      } catch (error) {
        console.error("Error al cargar categorías para el menú:", error);
      }
    };
    cargarMenuCategorias();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } finally {
      logout();
      navigate("/login");
    }
  };

  const cerrarMenus = () => {
    setIsMobileMenuOpen(false);
    setIsClasesOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 z-40 w-full transition-all duration-200 ${scrolled ? 'bg-white shadow-md' : 'bg-white border-b border-gray-100'}`}>
        <nav className="container mx-auto flex items-center justify-between py-3 px-5 lg:px-8">

          {/* LOGO */}
          <Link to="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-105" onClick={cerrarMenus}>
            <img
              src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774488885/Logo_hfou8a.png"
              className="h-9 sm:h-10 w-auto object-contain"
              alt="Logo Flex Studio"
            />
          </Link>

          {/* BOTÓN HAMBURGUESA (Móvil) */}
          <button
            className="text-gray-900 hover:text-gray-600 transition-colors lg:hidden p-2 -mr-2 relative z-50"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={26} />
          </button>
          <div className={`
            fixed inset-0 z-50 flex flex-col bg-white overflow-hidden transition-transform duration-300
            lg:static lg:z-auto lg:h-auto lg:w-full lg:flex-row lg:items-center lg:p-0 lg:translate-x-0 lg:bg-transparent lg:flex-1 lg:overflow-visible
            ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}>
            
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 lg:hidden bg-white">
              <img
                src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774488885/Logo_hfou8a.png"
                className="h-9 w-auto object-contain"
                alt="Logo Flex Studio"
              />
              <button
                className="text-gray-900 bg-gray-50 rounded-full p-2 hover:bg-gray-100 transition-colors"
                onClick={cerrarMenus}
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 lg:overflow-visible lg:p-0 lg:flex lg:flex-row lg:items-center lg:justify-end lg:gap-8 lg:w-full">

              {/* ======================= DROPDOWN CLASES ======================= */}
              <div
                className="relative group/nav lg:flex lg:h-full lg:items-center"
                onMouseEnter={() => window.innerWidth >= 1024 && setIsClasesOpen(true)}
                onMouseLeave={() => window.innerWidth >= 1024 && setIsClasesOpen(false)}
              >
                <button
                  onClick={() => setIsClasesOpen(!isClasesOpen)}
                  className="flex w-full items-center justify-between text-[16px] lg:text-[14px] font-bold text-gray-600 hover:text-black hover:bg-gray-50 lg:hover:bg-transparent rounded-xl px-4 py-3.5 lg:px-0 lg:py-4 transition-all cursor-pointer"
                >
                  Clases
                  <ChevronDown size={15} className={`ml-1.5 transition-transform duration-300 ${isClasesOpen ? 'rotate-180 text-black' : 'text-gray-400'}`} />
                </button>

                <div className={`
                    flex flex-col transition-all duration-300 origin-top
                    lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:pt-2 lg:z-50
                    ${isClasesOpen ? 'opacity-100 max-h-[500px] pointer-events-auto' : 'opacity-0 max-h-0 pointer-events-none lg:pointer-events-none'}
                  `}
                >
                  <div className="flex flex-col rounded-2xl border-none lg:border lg:border-gray-100 bg-white lg:shadow-xl overflow-hidden lg:min-w-[260px] pl-4 lg:pl-0">
                    <div className="p-2 flex flex-col max-h-[60vh] overflow-y-auto scrollbar-hide">
                      <p className="px-3 py-2 text-[11px] font-black tracking-widest uppercase text-[#d7f250] hidden lg:block">Nuestras Disciplinas</p>
                      {categoriasMenu.length > 0 ? (
                        categoriasMenu.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/categorias/${cat.id}`}
                            onClick={cerrarMenus}
                            className="block px-4 py-3 text-[14px] font-bold text-gray-500 lg:text-gray-600 rounded-xl hover:bg-gray-100 hover:text-black lg:hover:pl-5 transition-all duration-300"
                          >
                            {cat.titulo}
                          </Link>
                        ))
                      ) : (
                        <span className="px-4 py-3 text-sm text-gray-400 italic">Cargando...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================= CARRITO ======================= */}
              <Link
                to="/carrito"
                onClick={cerrarMenus}
                className="group flex lg:ml-2 items-center justify-between lg:justify-start text-[16px] lg:text-[14px] font-bold text-gray-600 hover:text-black hover:bg-gray-50 lg:hover:bg-transparent rounded-xl px-4 py-3.5 lg:px-0 lg:py-4 transition-all"
              >Carrito
                <div className="relative flex items-center justify-center lg:ml-2">
                    <ShoppingCart size={18} className="text-gray-700" />
                  {cantidadCarrito > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d7f250] text-[9px] font-black text-black shadow-sm ring-2 ring-white">
                      {cantidadCarrito}
                    </span>
                  )}
                </div>
              </Link>

              <hr className="border-gray-100 my-2 lg:hidden" />

              {/* ======================= USUARIO / AUTH ======================= */}
              {isAuthenticated ? (
                <div
                  className="relative lg:flex lg:h-full lg:items-center"
                  onMouseEnter={() => window.innerWidth >= 1024 && setIsProfileOpen(true)}
                  onMouseLeave={() => window.innerWidth >= 1024 && setIsProfileOpen(false)}
                >
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex w-full items-center justify-between px-4 py-3.5 lg:px-1 lg:py-4 text-[16px] lg:text-[14px] font-bold text-gray-700 hover:text-black transition-colors cursor-pointer rounded-xl hover:bg-gray-100 lg:hover:bg-transparent"
                  >
                    <span className="flex items-center whitespace-nowrap">
                      <div className="p-0.5 rounded-full ring-2 ring-transparent hover:ring-[#d7f250] transition-all mr-2">
                        <AvatarIniciales nombre={usuario?.nombre || ''} apellido={usuario?.apellido || ''} size="sm" />
                      </div>
                      {usuario?.nombre}
                    </span>
                    <ChevronDown size={15} className={`ml-2 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-black' : 'text-gray-400'}`} />
                  </button>

                  <div
                    className={`
                      flex flex-col transition-all duration-300 origin-top
                      lg:absolute lg:top-full lg:right-0 lg:pt-2 lg:z-50
                      ${isProfileOpen ? 'opacity-100 scale-y-100 max-h-[500px] pointer-events-auto' : 'opacity-0 scale-y-0 max-h-0 pointer-events-none lg:pointer-events-none'}
                    `}
                  >
                    <div className="flex flex-col rounded-2xl border-none lg:border lg:border-gray-100 bg-white lg:shadow-xl overflow-hidden lg:min-w-[220px] pl-4 lg:pl-0">
                      <div className="p-2 flex flex-col">
                        <div className="px-4 py-3 mb-2 border-b border-gray-50 hidden lg:block">
                          <p className="text-[10px] font-black tracking-widest uppercase text-[#d7f250]">Sesión Actual</p>
                        </div>

                        <Link to="/mi-perfil" onClick={cerrarMenus} className="px-4 py-2.5 text-[14px] font-bold text-gray-500 lg:text-gray-600 rounded-xl hover:bg-gray-100 hover:text-black transition-all">
                          Mi Perfil
                        </Link>
                        {usuario?.rol === "ADMIN" && (
                          <Link to="/admin" onClick={cerrarMenus} className="px-4 py-2.5 text-[14px] font-bold text-gray-500 lg:text-gray-600 rounded-xl hover:bg-gray-100 hover:text-black transition-all">
                            Panel de Admin
                          </Link>
                        )}
                        {usuario?.rol !== "ADMIN" && (
                          <Link to="/mis-clases" onClick={cerrarMenus} className="px-4 py-2.5 text-[14px] font-bold text-gray-500 lg:text-gray-600 rounded-xl hover:bg-gray-100 hover:text-black transition-all">
                            Mis Clases
                          </Link>
                        )}
                        
                        <div className="mt-1 p-1">
                          <button onClick={handleLogout} className="flex w-full items-center px-3 py-2.5 text-[13px] font-bold text-red-500 lg:bg-red-50/50 rounded-xl hover:bg-red-200 hover:text-red-600 transition-all cursor-pointer">
                            <LogOut size={15} className="mr-2" /> Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4 mt-6 lg:mt-0 lg:px-0">
                  <Link 
                    to="/login" 
                    onClick={cerrarMenus}
                    className="flex w-full lg:w-auto items-center justify-center text-[15px] lg:text-[14px] font-bold text-gray-600 hover:text-black px-4 py-3.5 lg:py-2 transition-colors rounded-xl hover:bg-gray-50 lg:hover:bg-transparent border lg:border-transparent border-gray-200"
                  >
                    Iniciar Sesión<CircleUser size={20} className="ml-2" />
                  </Link>
                  
                  <Link 
                    to="/registro" 
                    onClick={cerrarMenus}
                    className="flex w-full lg:w-auto items-center justify-center text-[15px] lg:text-[14px] font-bold text-gray-600 hover:text-black px-4 py-3.5 lg:py-2 transition-colors rounded-xl hover:bg-gray-50 lg:hover:bg-transparent border lg:border-transparent border-gray-200"
                  >
                    Regístrate<UserPlus size={20} className="ml-2" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default HeaderComponent;