import { Link } from "react-router-dom";
import { Frown } from "lucide-react";

const PaginaError = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Frown className="w-16 h-16 text-[#161616] mb-4"/>
      <h1 className="text-4xl font-bold text-gray-800">404 - No tenés cursos comprados! </h1>
        <Link to={`/`} className="w-[10%] bg-[#161616] hover:bg-[#d7f250] hover:text-[#161616] hover:-translate-y-[1px] text-white font-bold py-3 px-5 rounded-lg transition-all mt-20">
              <span>Volver al inicio</span>
        </Link>
    </div>
  );
};

export default PaginaError;