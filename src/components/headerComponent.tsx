import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { ShoppingCart, CircleUser, Search, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { AvatarIniciales } from "./AvatarIniciales";
import { obtenerCategoriasRequest, type Categoria } from "../api/categoria";
import { logoutRequest } from "../api/auth"; 

export const HeaderComponent = () => {
  const { usuario, isAuthenticated, logout } = useAuthStore();
  
  // 👇 Traemos el estado del carrito
  const cartItems = useCartStore((state) => state.cartItems); 
  const cantidadCarrito = cartItems.length;

  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClasesOpen, setIsClasesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [categoriasMenu, setCategoriasMenu] = useState<Categoria[]>([]);
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
    } catch (error) {
      console.error('Error al cerrar sesión en backend:', error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm">
        <nav className="container flex items-center justify-between py-3 lg:px-3">

          <Link to="/" className="flex-shrink-3">
            <img src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774488885/Logo_hfou8a.png" className="w-40 pl-4 object-contain" alt="Logo" />
          </Link>

          <button
            className="text-bg-card transition-colors hover:text-neon-pink lg:hidden pr-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <div
            className={`
              fixed inset-0 z-40 bg-black/60 transition-opacity duration-500 lg:hidden
              ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className={`fixed inset-y-0 right-0 z-50 flex h-screen w-80 flex-col gap-6 bg-white px-8 pt-16 pb-10 shadow-2xl transition-transform duration-500 ease-in-out
            lg:static lg:z-auto lg:h-auto lg:w-auto lg:flex-row lg:items-center lg:p-0 lg:shadow-none lg:translate-x-0
            ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              
              {/* DROPDOWN CLASES */}
              <div
                className="relative group"
                onMouseEnter={() => setIsClasesOpen(true)}
                onMouseLeave={() => setIsClasesOpen(false)}
              >
                <button
                  onClick={() => setIsClasesOpen(!isClasesOpen)}
                  className="flex w-full items-center justify-between text-[0.95rem] font-medium text-bg-card transition-colors hover:text-neon-pink lg:w-auto cursor-pointer py-1"
                >
                  Clases <ChevronDown size={16} className={`ml-1 transition-transform duration-300 ${isClasesOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`
                    mt-2 flex flex-col rounded-xl border border-gray-100 bg-white shadow-lg z-50 overflow-hidden
                    transition-all duration-300 origin-top
                    lg:absolute lg:left-0 lg:min-w-[220px] lg:mt-0 lg:top-full
                    ${isClasesOpen ? 'opacity-100 scale-y-100 max-h-[500px]' : 'opacity-0 scale-y-0 max-h-0 lg:max-h-[500px] pointer-events-none'}
                  `}
                >
                  <div className="py-2 flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* 👇 RENDERIZADO DINÁMICO DE CATEGORÍAS 👇 */}
                    {categoriasMenu.length > 0 ? (
                      categoriasMenu.map((cat, index) => (
                        <div key={cat.id}>
                          <Link 
                            to={`/categorias/${cat.id}`} 
                            onClick={() => setIsMobileMenuOpen(false)} // Cierra el menú en móvil al hacer clic
                            className="block px-4 py-2.5 text-sm font-medium text-[#161616] hover:bg-gray-50 hover:text-[#d7f250] transition-colors"
                          >
                            {cat.titulo}
                          </Link>
                          {/* Dibuja la línea divisoria excepto en el último elemento */}
                          {index < categoriasMenu.length - 1 && <hr className="my-0 border-gray-100" />}
                        </div>
                      ))
                    ) : (
                      <span className="px-4 py-3 text-sm text-gray-400 italic">Cargando clases...</span>
                    )}
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <div
                  className="relative group"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex w-full items-center justify-between py-2 text-[0.95rem] font-medium text-[#161616] transition-colors hover:text-[#d7f250] lg:w-auto lg:px-3"
                  >
                    <span className="flex items-center cursor-pointer whitespace-nowrap">
                      <AvatarIniciales
                        nombre={usuario?.nombre || ''}
                        apellido={usuario?.apellido || ''}
                        size="sm"
                        className="mr-2"
                      />
                      Hola, {usuario?.nombre}
                    </span>
                    <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div
                    className={`
                      mt-2 flex flex-col rounded-lg border border-gray-100 bg-white shadow-lg z-50 overflow-hidden
                      transition-all duration-300 origin-top
                      lg:absolute lg:right-0 lg:min-w-[200px] lg:mt-0 lg:top-full
                      ${isProfileOpen ? 'opacity-100 scale-y-100 max-h-[500px]' : 'opacity-0 scale-y-0 max-h-0 lg:max-h-[500px] pointer-events-none'}
                    `}
                  >
                    <div className="py-2 flex flex-col">
                      <Link to="/mi-perfil" className="px-4 py-2 text-md text-[#161616] hover:bg-gray-50 hover:text-[#d7f250] transition-colors">Mi Perfil</Link>
                      {usuario?.rol === "ADMIN" && (
                        <Link to="/admin" className="px-4 py-2 text-md text-[#161616] hover:bg-gray-50 hover:text-[#d7f250] transition-colors">Panel de Admin</Link>
                      )}
                      {usuario?.rol !== "ADMIN" && (
                        <Link to="/mis-clases" className="px-4 py-2 text-md text-[#161616] hover:bg-gray-50 hover:text-[#d7f250] transition-colors">Mis Clases</Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-left text-md cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut size={16} className="mr-2" /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                  <Link to="/login" className="flex items-center py-2 text-[0.95rem] font-medium text-[#161616] transition-colors hover:text-[#d7f250]">
                    <CircleUser size={20} className="mr-2" /> Login
                  </Link>
                  <Link to="/registro" className="flex items-center py-2 ml-2 text-[0.95rem] font-medium text-[#161616] transition-colors hover:text-[#d7f250]">
                    Registrate
                  </Link>
                </div>
              )}

              {/* 👇 LINK DEL CARRITO CON BADGE DE NOTIFICACIÓN 👇 */}
              <Link to="/carrito" className="flex items-center py-2 text-[0.95rem] font-medium text-[#161616] transition-colors hover:text-[#d7f250]">
                <div className="relative mr-2 flex items-center justify-center">
                  <ShoppingCart size={20} />
                  {/* El badge solo aparece si hay items */}
                  {cantidadCarrito > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-white">
                      {cantidadCarrito}
                    </span>
                  )}
                </div>
                Carrito
              </Link>
            </div>

            <form
              className="relative w-full max-w-[550px] lg:ml-4"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="search"
                placeholder="Search"
                className="w-full rounded-[15px] border border-[#ccc] py-2 pl-4 pr-[70px] text-[#161616] outline-none transition-colors focus:border-[#d7f250] focus:ring-1 focus:ring-[#d7f250]"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 flex h-full items-center justify-center px-4 text-[#161616] transition-colors hover:text-[#d7f250]"
              >
                <Search size={20} />
              </button>
            </form>

          </div>
        </nav>
      </header>
    </>
  );
};

export default HeaderComponent;