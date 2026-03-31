import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminLayout } from '../components/layout/AdminLayout';
import { RegistroPage } from '../pages/auth/RegistroPage';
import HomePage from '../pages/HomePage';
import { CategoriasPage } from '../pages/admin/categorias/CategoriasPage';
import { AdminVideosPage } from '../pages/admin/videos/AdminVideosPage';
import { NuevaCategoriaPage } from '../pages/admin/categorias/NuevaCategoriaPage';
import HeaderComponent from '../components/headerComponent';
import FooterComponent from '../components/footerComponent';
import Categorias from '../pages/Categorias';
import { NuevoVideoPage } from '../pages/admin/videos/NuevoVideoPage';
import { EditarCategoriaPage } from '../pages/admin/categorias/EditarCategoriaPage';
import { EditarVideoPage } from '../pages/admin/videos/EditarVideoPage';
import PaginaError from '../pages/PaginaError';

const LayoutConNav = () => {
  return (
    <div>
      <HeaderComponent />
      <div>
        <Outlet/>
      </div>
      <FooterComponent />
    </div>
  );
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* === RUTAS PÚBLICAS === */}
        <Route element={<LayoutConNav />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/categorias/:id' element={ <Categorias /> } />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/registro' element={<RegistroPage/>}/>

        {/* === RUTAS PRIVADAS (Panel de Control) === */}
        {/* Todas las rutas que empiecen con /admin pasarán por el AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin/categorias" element={<CategoriasPage/>}/>
        <Route path="categorias/nueva" element={<NuevaCategoriaPage />} />
        <Route path="/admin/videos" element={<AdminVideosPage/>}/>
        <Route path="/admin/videos/nuevo" element={<NuevoVideoPage/>}/>
        <Route path="/admin/categorias/editar/:id" element={<EditarCategoriaPage />} />
        <Route path="/admin/videos/editar/:id" element={<EditarVideoPage/>}/>
        </Route>

        {/* === FALLBACK (Ruta por defecto) === */}
        {/* Si alguien entra a la raíz "/" o a una ruta que no existe, lo mandamos al login */}
        <Route path="*" element={<PaginaError />} />
      </Routes>
    </BrowserRouter>
  );
};