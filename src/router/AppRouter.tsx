import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminLayout } from '../components/layout/AdminLayout';
import { RegistroPage } from '../pages/auth/RegistroPage';
import HomePage from '../pages/HomePage';
import { CategoriasPage } from '../pages/admin/CategoriasPage';
import { AdminVideosPage } from '../pages/admin/AdminVideosPage';
import { NuevaCategoriaPage } from '../pages/admin/NuevaCategoriaPage';
import { NuevoVideoPage } from '../pages/admin/NuevoVideoPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* === RUTAS PÚBLICAS === */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/registro' element={<RegistroPage/>}/>

        {/* === RUTAS PRIVADAS (Panel de Control) === */}
        {/* Todas las rutas que empiecen con /admin pasarán por el AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin/categorias" element={<CategoriasPage/>}/>
        <Route path="categorias/nueva" element={<NuevaCategoriaPage />} />
        <Route path="/admin/videos" element={<AdminVideosPage/>}/>
        <Route path="/admin/videos/nuevo" element={<NuevoVideoPage/>}/>
        </Route>

        {/* === FALLBACK (Ruta por defecto) === */}
        {/* Si alguien entra a la raíz "/" o a una ruta que no existe, lo mandamos al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};