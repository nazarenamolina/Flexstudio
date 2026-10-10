import { Toaster, type ToasterProps } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

type Opciones = NonNullable<ToasterProps['toastOptions']>;

const CLARO: Opciones = {
  style: {
    background: '#fff',
    color: '#131313',
    border: '1px solid #e5e5e5',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  },
  success: {
    iconTheme: { primary: '#d7f250', secondary: '#131313' },
  },
  error: {
    iconTheme: { primary: '#dc2626', secondary: '#fff' },
  },
};

const OSCURO: Opciones = {
  style: {
    background: '#1a1a1a',
    color: '#fff',
    border: '1px solid #333',
  },
  success: {
    iconTheme: { primary: '#d7f250', secondary: '#131313' },
    style: { border: '1px solid #d7f250' },
  },
  error: {
    style: { border: '1px solid #ff4d4f' },
  },
};

export const Avisos = () => {
  const { pathname } = useLocation();
  const esAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  return <Toaster position="top-right" toastOptions={esAdmin ? OSCURO : CLARO} />;
};
