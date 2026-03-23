import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminLayout } from '../components/layout/AdminLayout';
import { RegistroPage } from '../pages/auth/RegistroPage';
import HomePage from '../pages/auth/HomePage';

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
          {/* Aquí anidaremos <Route path="categorias" element={<CategoriasPage />} /> más adelante */}
        </Route>

        {/* === FALLBACK (Ruta por defecto) === */}
        {/* Si alguien entra a la raíz "/" o a una ruta que no existe, lo mandamos al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};