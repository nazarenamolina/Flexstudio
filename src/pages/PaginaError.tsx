import { Link } from "react-router-dom";
import { Frown } from "lucide-react";

const PaginaError = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Frown className="w-16 h-16 text-[#161616] mb-4"/>
      <h1 className="text-4xl font-bold text-gray-800">404 - Page not found </h1>
        <Link to={`/`} className="w-[10%] bg-[#161616] hover:bg-[#d7f250] hover:text-[#161616] hover:-translate-y-[1px] text-white font-bold py-3 px-5 rounded-lg transition-all mt-20">
              <span>Volver al inicio</span>
        </Link>
        <p className="text-gray-600 mt-4 text-center">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos sit numquam assumenda necessitatibus molestias explicabo ipsa, possimus in illo. Nulla amet veniam debitis odio? Et, voluptatem necessitatibus. Illo, minus impedit.Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero, dolores. Eligendi atque animi fugit repellendus esse. Vel voluptatum possimus neque repellat dolores rerum omnis dolor aspernatur numquam. Ipsum, recusandae quia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum in, omnis eveniet commodi similique blanditiis voluptatibus. Optio recusandae maiores non consectetur ullam est modi, id porro asperiores, dicta harum temporibus?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur totam ipsum rem hic unde, nesciunt a excepturi nihil voluptatem et recusandae ullam cum corporis delectus assumenda obcaecati qui rerum dolore!
        </p>
    </div>
  );
};

export default PaginaError;