import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ShoppingCart, CircleUser, Search, LogOut, Menu, X, ChevronDown } from "lucide-react";

export const HeaderComponent = () => {
  const { usuario, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  // Estados para manejar los menús que antes controlaba Bootstrap
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
      <nav className="container 2 flex items-center justify-between px-4 py-3 lg:px-3">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          {/* Ajusta la ruta o variable de tu imagen aquí */}
          <img src="https://res.cloudinary.com/dmp7mcwie/image/upload/v1774488885/Logo_hfou8a.png" className="w-40 pl-4 object-contain" alt="Logo" />
        </Link>

        {/* Botón Hamburguesa (Mobile) */}
        <button
          className="text-bg-card transition-colors hover:text-neon-pink lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Contenedor de Enlaces y Buscador (Desktop y Mobile) */}
        <div className={`
          absolute left-0 top-full flex w-full flex-col gap-5 bg-white p-20 shadow-lg transition-all duration-300 ease-in-out 
          lg:static lg:w-auto lg:flex-row lg:items-center lg:p-0 lg:shadow-none
          ${isMobileMenuOpen ? "flex" : "hidden lg:flex"}
        `}>
          
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            
            {/* Dropdown Clases */}
            <div className="relative">
              <button
                onClick={() => setIsClasesOpen(!isClasesOpen)}
                className="flex w-full items-center justify-between text-[0.95rem] font-medium text-bg-card transition-colors hover:text-neon-pink lg:w-auto"
              >
                Clases <ChevronDown size={16} className="ml-1" />
              </button>
              
              {isClasesOpen && (
                <div className="mt-2 flex flex-col rounded-md border border-gray-100 bg-white py-2 shadow-lg lg:absolute lg:left-0 lg:min-w-[200px]">
                  <Link to="/deportistas" className="px-4 py-2 text-sm text-[#161616] hover:bg-gray-50 hover:text-[#d7f250]">Deportistas</Link>
                  <hr className="my-1 border-gray-100" />
                  <Link to="/progresivas" className="px-4 py-2 text-sm text-[#161616] hover:bg-gray-50 hover:text-[#d7f250]">Progresivas Generales</Link>
                  <hr className="my-1 border-gray-100" />
                  <Link to="/gimnastas" className="px-4 py-2 text-sm text-[#161616] hover:bg-gray-50 hover:text-[#d7f250]">Gimnastas</Link>
                  <hr className="my-1 border-gray-100" />
                  <Link to="/acrobatas" className="px-4 py-2 text-sm text-[#161616] hover:bg-gray-50 hover:text-[#d7f250]">Acróbatas</Link>
                  <hr className="my-1 border-gray-100" />
                  <Link to="/bailarinas" className="px-4 py-2 text-sm text-[#161616] hover:bg-gray-50 hover:text-[#d7f250]">Bailarinas</Link>
                  <hr className="my-1 border-gray-100" />
                  <Link to="/patinadoras" className="px-4 py-2 text-sm text-[#161616] hover:bg-gray-50 hover:text-[#d7f250]">Patinadoras</Link>
                </div>
              )}
            </div>

            {/* Lógica de Autenticación */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex w-full items-center justify-between text-[0.95rem] font-medium text-[#161616] transition-colors hover:text-[#d7f250] lg:w-auto"
                >
                  <span className="flex items-center"><CircleUser size={23} className="mr-2" /> Hola, {usuario?.nombre}</span>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                
                {isProfileOpen && (
                  <div className="mt-2 flex flex-col rounded-md border border-gray-100 bg-white py-2 shadow-lg lg:absolute lg:right-0 lg:min-w-[200px]">
                    <Link to="/mi-perfil" className="px-4 py-2 text-sm text-[#161616] hover:bg-gray-50 hover:text-[#d7f250]">Mi Perfil</Link>
                    {usuario?.rol === "ADMIN" && (
                      <Link to="/admin" className="px-4 py-2 text-sm text-[#161616] hover:bg-gray-50 hover:text-[#d7f250]">Panel de Admin</Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 hover:text-red-600">
                      <LogOut size={16} className="mr-2" /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <Link to="/login" className="flex items-center text-[0.95rem] font-medium text-[#161616] transition-colors hover:text-[#d7f250]">
                  <CircleUser size={20} className="mr-2" /> Login
                </Link>
                <Link to="/registro" className="text-[0.95rem] font-medium text-[#161616] transition-colors hover:text-[#d7f250]">
                  Registrate
                </Link>
              </div>
            )}

            {/* Carrito */}
            <Link to="/carrito" className="flex items-center text-[0.95rem] font-medium text-[#161616] transition-colors hover:text-[#d7f250]">
              Carrito <ShoppingCart size={20} className="ml-2" />
            </Link>
          </div>

          {/* Buscador */}
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