import { lazy, type ComponentType } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ProtectedRoute } from '../router/ProtectedRoute';
import HeaderComponent from '../components/headerComponent';
import FooterComponent from '../components/footerComponent';
import HomePage from '../pages/HomePage';
import { ScrollToTop } from '../components/ScrollToTop';
import { ValidadorSesion } from '../components/ValidadorSesion';
import { FloatingCart } from '../components/FloatingCart';
import { ContenidoSeguro } from '../components/ContenidoSeguro';
import { Avisos } from '../components/Avisos';

// Cada pantalla se descarga recién cuando se abre. Antes el sitio era un solo archivo de 3,3 MB:
// la home bajaba también el panel admin, el reproductor de Mux, los gráficos y el registro.
// La home queda en el archivo principal porque es la puerta de entrada.
const cargar = <T extends Record<string, unknown>>(importar: () => Promise<T>, nombre: keyof T) =>
  lazy(async () => ({ default: (await importar())[nombre] as ComponentType }));

const Categorias = lazy(() => import('../pages/Categorias'));
const PaginaError = lazy(() => import('../pages/PaginaError'));
const CarritoMP = lazy(() => import('../pages/carrito/CarritoMP'));
const MiPerfilPage = cargar(() => import('../pages/MiPerfilPage'), 'MiPerfilPage');
const MisClasesPage = cargar(() => import('../pages/MisClasesPage'), 'MisClasesPage');
const VideosPage = cargar(() => import('../pages/VideosPage'), 'VideosPage');
const CheckoutExitoPage = cargar(() => import('../pages/CheckoutExitoPage'), 'CheckoutExitoPage');
const CheckoutResultadoPage = cargar(() => import('../pages/CheckoutResultadoPage'), 'CheckoutResultadoPage') as ComponentType<{ tipo: 'error' | 'pendiente' }>;
const TerminosCondiciones = cargar(() => import('../pages/TerminosCondiciones'), 'TerminosCondiciones');
const PoliticaPrivacidad = cargar(() => import('../pages/PoliticaPrivacidad'), 'PoliticaPrivacidad');
const LoginPage = cargar(() => import('../pages/auth/LoginPage'), 'LoginPage');
const RegistroPage = cargar(() => import('../pages/auth/RegistroPage'), 'RegistroPage');
const VerificarEmailPage = cargar(() => import('../pages/auth/VerificarEmailPage'), 'VerificarEmailPage');
const ResetPasswordPage = cargar(() => import('../pages/auth/ResetPasswordPage'), 'ResetPasswordPage');
const AdminLayout = cargar(() => import('../components/layout/AdminLayout'), 'AdminLayout');
const AdminDashboard = cargar(() => import('../pages/admin/dasboard/AdminDashboard'), 'AdminDashboard');
const ClientesPage = cargar(() => import('../pages/admin/clientes/ClientesPage'), 'ClientesPage');
const CategoriasPage = cargar(() => import('../pages/admin/categorias/CategoriasPage'), 'CategoriasPage');
const NuevaCategoriaPage = cargar(() => import('../pages/admin/categorias/NuevaCategoriaPage'), 'NuevaCategoriaPage');
const EditarCategoriaPage = cargar(() => import('../pages/admin/categorias/EditarCategoriaPage'), 'EditarCategoriaPage');
const AdminVideosPage = cargar(() => import('../pages/admin/videos/AdminVideosPage'), 'AdminVideosPage');
const NuevoVideoPage = cargar(() => import('../pages/admin/videos/NuevoVideoPage'), 'NuevoVideoPage');
const EditarVideoPage = cargar(() => import('../pages/admin/videos/EditarVideoPage'), 'EditarVideoPage');
const HeroAdminPage = cargar(() => import('../pages/admin/hero/HeroAdminPage'), 'HeroAdminPage');

const LayoutConNav = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent />
      <main className="flex-grow">
        {/* El header y el footer siguen visibles mientras carga o si falla una pantalla. */}
        <ContenidoSeguro>
          <Outlet />
        </ContenidoSeguro>
      </main>
      <FloatingCart />
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
      <ValidadorSesion />
      <Avisos />
      <ContenidoSeguro>
        <Routes>
          {/*RUTAS PÚBLICAS CON NAVBAR Y FOOTER */}
          <Route element={<LayoutConNav />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/categorias/:id' element={<Categorias />} />
            <Route path='/terminos-condiciones' element={<TerminosCondiciones />} />
            <Route path='/politica-de-privacidad' element={<PoliticaPrivacidad />} />
            {/* Retornos de la pasarela sin pago aprobado: públicos por si la sesión no sobrevivió al viaje */}
            <Route path='/checkout/error' element={<CheckoutResultadoPage tipo="error" />} />
            <Route path='/checkout/pendiente' element={<CheckoutResultadoPage tipo="pendiente" />} />
            <Route element={<ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login" />}>
              <Route path='/mi-perfil' element={<MiPerfilPage />} />
              <Route path='/mis-clases' element={<MisClasesPage />} />
              <Route path='/mis-clases/:id' element={<VideosPage />} />
              <Route path='/carrito' element={<CarritoMP />} />
              <Route path='/checkout/exito' element={<CheckoutExitoPage />} />
            </Route>
            {/* 404 con header y footer, como el resto del sitio */}
            <Route path="*" element={<PaginaError />} />
          </Route>

          {/*RUTAS DE INVITADOS (Sin Navbar, Solo para No Logueados)*/}
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
            <Route path="/verificar-email" element={<VerificarEmailPage />} />
            <Route path='/reset-password' element={<ResetPasswordPage/>}/>
          </Route>

          {/* RUTAS DE ADMINISTRADOR (Panel de control)*/}
          <Route element={<ProtectedRoute isAllowed={isAuthenticated && usuario?.rol === 'ADMIN'} redirectTo={isAuthenticated ? '/' : '/login'} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path='clientes' element={<ClientesPage />} />
              <Route path="categorias" element={<CategoriasPage />} />
              <Route path="categorias/nueva" element={<NuevaCategoriaPage />} />
              <Route path="categorias/editar/:id" element={<EditarCategoriaPage />} />
              <Route path="videos" element={<AdminVideosPage />} />
              <Route path="videos/nuevo" element={<NuevoVideoPage />} />
              <Route path="videos/editar/:id" element={<EditarVideoPage />} />
              <Route path="carrusel" element={<HeroAdminPage />} />
            </Route>
          </Route>
        </Routes>
      </ContenidoSeguro>
    </BrowserRouter>
  );
};

