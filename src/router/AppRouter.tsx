import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ProtectedRoute } from '../router/ProtectedRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import HeaderComponent from '../components/headerComponent';
import FooterComponent from '../components/footerComponent';
import HomePage from '../pages/HomePage';
import Categorias from '../pages/Categorias';
import { MiPerfilPage } from '../pages/MiPerfilPage';
import PaginaError from '../pages/PaginaError';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegistroPage } from '../pages/auth/RegistroPage';
import { CategoriasPage } from '../pages/admin/categorias/CategoriasPage';
import { NuevaCategoriaPage } from '../pages/admin/categorias/NuevaCategoriaPage';
import { EditarCategoriaPage } from '../pages/admin/categorias/EditarCategoriaPage';
import { AdminVideosPage } from '../pages/admin/videos/AdminVideosPage';
import { NuevoVideoPage } from '../pages/admin/videos/NuevoVideoPage';
import { EditarVideoPage } from '../pages/admin/videos/EditarVideoPage';
import { VideosPage } from '../pages/VideosPage';
import { ScrollToTop } from '../components/ScrollToTop';
import CarritoMP from '../pages/CarritoMP';
import { CheckoutExitoPage } from '../pages/CheckoutExitoPage';
import { MisClasesPage } from '../pages/MisClasesPage';


const LayoutConNav = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterComponent />
    </div>
  );
};

export const AppRouter = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* RUTAS PÚBLICAS Y PRIVADAS CON NAVEGACIÓN */}
        <Route element={<LayoutConNav />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/categorias/:id' element={<Categorias />} />

          {/* RUTAS PRIVADAS DEL CLIENTE */}
          <Route element={<ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login" />}>
            <Route path='/mi-perfil' element={<MiPerfilPage />} />
            <Route path='/mis-clases' element={<MisClasesPage />} />
            <Route path='/mis-clases/:id' element={<VideosPage />} />
            <Route path='/carritoMP' element={<CarritoMP />} />
            <Route path='/checkout/exito' element={<CheckoutExitoPage />} />
          </Route>
        </Route>

        {/* RUTAS DE AUTENTICACIÓN (Solo si NO está logueado) */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={!isAuthenticated}
              redirectTo={usuario?.rol === 'ADMIN' ? '/admin/categorias' : '/'}
            />
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />
        </Route>

        {/* RUTAS DE ADMINISTRADOR */}
        <Route element={<ProtectedRoute isAllowed={isAuthenticated && usuario?.rol === 'ADMIN'} redirectTo="/" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="categorias" element={<CategoriasPage />} />
            <Route path="categorias/nueva" element={<NuevaCategoriaPage />} />
            <Route path="categorias/editar/:id" element={<EditarCategoriaPage />} />
            <Route path="videos" element={<AdminVideosPage />} />
            <Route path="videos/nuevo" element={<NuevoVideoPage />} />
            <Route path="videos/editar/:id" element={<EditarVideoPage />} />
            <Route index element={<Navigate to="categorias" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<PaginaError />} />
      </Routes>
    </BrowserRouter>
  );
};