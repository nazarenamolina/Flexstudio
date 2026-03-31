import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ShoppingCart, CircleUser, Search, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { AvatarIniciales } from "./AvatarIniciales"; // 👈 IMPORTANTE: Ajusta esta ruta si lo guardaste en otra carpeta

export const HeaderComponent = () => {
  const { usuario, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClasesOpen, setIsClasesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
      ${isMobileMenuOpen
              ? "translate-x-0"
              : "translate-x-full"
            }
    `}
          >

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
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
                    lg:absolute lg:left-0 lg:min-w-[200px] lg:mt-2 lg:top-full
                    ${isClasesOpen ? 'opacity-100 scale-y-100 max-h-[500px]' : 'opacity-0 scale-y-0 max-h-0 lg:max-h-[500px] pointer-events-none'}
                  `}
                >
                  <div className="py-2 flex flex-col"> 
                    <Link to="/deportistas" className="px-4 py-2 text-md text-[#161616] hover:bg-gray-50 hover:text-[#d7f250] transition-colors">Deportistas</Link>
                    <hr className="my-1 border-gray-100" />
                    <Link to="/progresivas" className="px-4 py-2 text-md text-[#161616] hover:bg-gray-50 hover:text-[#d7f250] transition-colors">Progresivas Generales</Link>
                    <hr className="my-1 border-gray-100" />
                    <Link to="/gimnastas" className="px-4 py-2 text-md text-[#161616] hover:bg-gray-50 hover:text-[#d7f250] transition-colors">Gimnastas</Link>
                    <hr className="my-1 border-gray-100" />
                    <Link to="/acrobatas" className="px-4 py-2 text-md text-[#161616] hover:bg-gray-50 hover:text-[#d7f250] transition-colors">Acróbatas</Link>
                    <hr className="my-1 border-gray-100" />
                    <Link to="/bailarinas" className="px-4 py-2 text-md text-[#161616] hover:bg-gray-50 hover:text-[#d7f250] transition-colors">Bailarinas</Link>
                    <hr className="my-1 border-gray-100" />
                    <Link to="/patinadoras" className="px-4 py-2 text-md text-[#161616] hover:bg-gray-50 hover:text-[#d7f250] transition-colors">Patinadoras</Link>
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
                    className="flex w-full items-center justify-between text-[0.95rem] font-medium text-[#161616] transition-colors hover:text-[#d7f250] lg:w-auto py-2"
                  >
                    <span className="flex items-center cursor-pointer">
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

              <Link to="/carrito" className="flex items-center py-2 text-[0.95rem] font-medium text-[#161616] transition-colors hover:text-[#d7f250]">
              <ShoppingCart size={20} className="mr-2" />
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