import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminLayout } from '../components/layout/AdminLayout';
import { RegistroPage } from '../pages/auth/RegistroPage';
import HomePage from '../pages/HomePage';
import { CategoriasPage } from '../pages/admin/CategoriasPage';
import { AdminVideosPage } from '../pages/admin/AdminVideosPage';
import { NuevaCategoriaPage } from '../pages/admin/NuevaCategoriaPage';
import HeaderComponent from '../components/headerComponent';
import FooterComponent from '../components/footerComponent';
import Categorias from '../pages/Categorias';
import { NuevoVideoPage } from '../pages/admin/NuevoVideoPage';
import { EditarCategoriaPage } from '../pages/admin/EditarCategoriaPage';

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
        </Route>

        {/* === FALLBACK (Ruta por defecto) === */}
        {/* Si alguien entra a la raíz "/" o a una ruta que no existe, lo mandamos al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};