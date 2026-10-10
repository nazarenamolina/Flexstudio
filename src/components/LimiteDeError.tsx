import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';
import { esErrorDeVersion, recargarPorVersionNueva } from '../versionNueva';


interface Props {
  children: ReactNode;
  /** Claro para el sitio, oscuro para el panel admin. */
  variante?: 'claro' | 'oscuro';
  /** Al cambiar (por ejemplo, la ruta), se vuelve a intentar mostrar el contenido. */
  claveReinicio?: string;
}

interface Estado {
  error: Error | null;
  claveReinicio?: string;
}

/**
 * Pantalla de error general: antes, un fallo en cualquier componente dejaba la página en blanco.
 * Muestra un mensaje con "Volver a intentar" y, si el error es por una versión vieja del sitio,
 * recarga sola una vez para traer la nueva.
 */
export class LimiteDeError extends Component<Props, Estado> {
  state: Estado = { error: null, claveReinicio: this.props.claveReinicio };

  static getDerivedStateFromError(error: Error): Partial<Estado> {
    return { error };
  }

  // Navegar a otra página limpia el error: el resto del sitio puede funcionar bien.
  static getDerivedStateFromProps(props: Props, estado: Estado): Partial<Estado> | null {
    if (props.claveReinicio !== estado.claveReinicio) {
      return { error: null, claveReinicio: props.claveReinicio };
    }
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (esErrorDeVersion(error) && recargarPorVersionNueva()) return;
    console.error('Error en la interfaz:', error, info.componentStack);
  }

  private reintentar = () => {
    if (this.state.error && esErrorDeVersion(this.state.error)) {
      window.location.reload();
      return;
    }
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const oscuro = this.props.variante === 'oscuro';
    const deVersion = esErrorDeVersion(error);
    return (
      <div role="alert" className="min-h-[60vh] flex items-center justify-center px-4 pt-24 pb-16">
        <div
          className={`max-w-md w-full rounded-3xl border p-8 text-center flex flex-col items-center gap-4 ${
            oscuro ? 'bg-[#131313] border-white/10 text-white' : 'bg-white border-neutral-200 text-[#131313] shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
          }`}
        >
          <AlertTriangle className={`w-10 h-10 ${oscuro ? 'text-red-400' : 'text-red-500'}`} aria-hidden="true" />
          <h1 className="font-principal text-3xl uppercase">
            {deVersion ? 'Hay una versión nueva' : 'Algo salió mal'}
          </h1>
          <p className={oscuro ? 'text-gray-400' : 'text-neutral-600'}>
            {deVersion
              ? 'Actualizamos el sitio mientras lo tenías abierto. Recargá la página para seguir.'
              : 'No pudimos mostrar esta pantalla. Probá de nuevo; si sigue pasando, recargá la página.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <button
              type="button"
              onClick={this.reintentar}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#d7f250] px-5 py-3 font-principal font-bold uppercase tracking-wide text-[#131313] transition-colors hover:bg-[#131313] hover:text-white"
            >
              <RotateCw size={18} aria-hidden="true" /> {deVersion ? 'Recargar' : 'Volver a intentar'}
            </button>
            {/* Enlace común (no de React Router): sale del estado roto con una carga limpia. */}
            <a
              href="/"
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 font-principal font-bold uppercase tracking-wide transition-colors ${
                oscuro ? 'border-white/20 text-white hover:bg-white/10' : 'border-neutral-300 text-[#131313] hover:bg-neutral-100'
              }`}
            >
              <Home size={18} aria-hidden="true" /> Ir al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }
}
