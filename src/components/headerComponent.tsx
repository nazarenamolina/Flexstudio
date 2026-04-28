import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { ShoppingCart, CircleUser, LogOut, Menu, X, ChevronDown } from "lucide-react";
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
      <header className="fixed top-0 left-0 z-50 w-full bg-white border-b border-gray-100">
        <nav className="container flex items-center justify-between py-4 lg:px-4">

          <Link to="/" className="flex-shrink-0">
            <img
              src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774488885/Logo_hfou8a.png"
              className="h-10 w-auto object-contain pl-4 lg:pl-0"
              alt="Logo"
            />
          </Link>

          <button
            className="mr-4 text-gray-600 hover:text-[#d7f250] transition-colors lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <div
            className={`
              fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden
              ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className={`
            fixed inset-y-0 right-0 z-50 flex h-screen w-72 flex-col gap-6 bg-white px-6 pt-20 pb-8 shadow-2xl transition-transform duration-300 ease-out
            lg:static lg:z-auto lg:h-auto lg:w-auto lg:flex-row lg:items-center lg:p-0 lg:shadow-none lg:translate-x-0 lg:gap-6
            ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}>
            <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-5">

              {/* DROPDOWN CLASES */}
              <div
                className="relative"
                onMouseEnter={() => setIsClasesOpen(true)}
                onMouseLeave={() => setIsClasesOpen(false)}
              >
                <button
                  onClick={() => setIsClasesOpen(!isClasesOpen)}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-[#d7f250] transition-colors cursor-pointer py-2 lg:py-1"
                >
                  Clases
                  <ChevronDown
                    size={16}
                    className={`ml-1 transition-transform duration-200 ${isClasesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <div
                  className={`
                    mt-1 flex flex-col rounded-xl border border-gray-100 bg-white shadow-lg z-50 overflow-hidden
                    transition-all duration-200 origin-top
                    lg:absolute lg:left-0 lg:min-w-[220px] lg:mt-0 lg:top-full
                    ${isClasesOpen ? 'opacity-100 scale-y-100 max-h-[500px]' : 'opacity-0 scale-y-0 max-h-0 lg:max-h-[500px] pointer-events-none'}
                  `}
                >
                  <div className="py-2 flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {categoriasMenu.length > 0 ? (
                      categoriasMenu.map((cat, index) => (
                        <div key={cat.id}>
                          <Link
                            to={`/categorias/${cat.id}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#d7f250] transition-colors"
                          >
                            {cat.titulo}
                          </Link>
                          {index < categoriasMenu.length - 1 && <hr className="my-0 border-gray-100" />}
                        </div>
                      ))
                    ) : (
                      <span className="px-4 py-3 text-sm text-gray-400 italic">Cargando clases...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* CARRITO */}
              <Link
                to="/carrito"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#d7f250] transition-colors py-2 lg:py-1"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingCart size={20} />
                  {cantidadCarrito > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#d7f250] text-[10px] font-bold text-gray-900">
                      {cantidadCarrito}
                    </span>
                  )}
                </div>
                Carrito
              </Link>

              {isAuthenticated ? (
                <div
                  className="relative"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center py-2 text-sm font-medium text-gray-700 hover:text-[#d7f250] transition-colors lg:px-2 cursor-pointer"
                  >
                    <span className="flex items-center whitespace-nowrap">
                      <AvatarIniciales
                        nombre={usuario?.nombre || ''}
                        apellido={usuario?.apellido || ''}
                        size="sm"
                        className="mr-2"
                      />
                      Hola, {usuario?.nombre}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`ml-1 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <div
                    className={`
                      mt-1 flex flex-col rounded-xl border border-gray-100 bg-white shadow-lg z-50 overflow-hidden
                      transition-all duration-200 origin-top
                      lg:absolute lg:right-0 lg:min-w-[200px] lg:mt-0 lg:top-full
                      ${isProfileOpen ? 'opacity-100 scale-y-100 max-h-[500px]' : 'opacity-0 scale-y-0 max-h-0 lg:max-h-[500px] pointer-events-none'}
                    `}
                  >
                    <div className="py-2 flex flex-col">
                      <Link
                        to="/mi-perfil"
                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#d7f250] transition-colors"
                      >
                        Mi Perfil
                      </Link>
                      {usuario?.rol === "ADMIN" && (
                        <Link
                          to="/admin"
                          className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#d7f250] transition-colors"
                        >
                          Panel de Admin
                        </Link>
                      )}
                      {usuario?.rol !== "ADMIN" && (
                        <Link
                          to="/mis-clases"
                          className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#d7f250] transition-colors"
                        >
                          Mis Clases
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <LogOut size={16} className="mr-2" /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-[#d7f250] transition-colors"
                  >
                    <CircleUser size={20} className="mr-1.5" /> Login
                  </Link>
                  <Link
                    to="/registro"
                    className="rounded-full bg-[#d7f250] px-4 py-2 text-sm font-bold text-gray-900 hover:bg-[#c4e038] transition-colors"
                  >
                    Registrate
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
